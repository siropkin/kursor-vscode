import { execFile } from 'child_process';
import { KeyboardLayout } from './keyboardLayout';

const EMPTY: KeyboardLayout = { language: '', country: '', variant: '' };

function exec(command: string, args: string[]): Promise<string> {
    return new Promise((resolve) => {
        execFile(command, args, { timeout: 3000 }, (error, stdout) => {
            resolve(error ? '' : stdout);
        });
    });
}

let distribution = '';
let desktopGroup = '';
let desktopEnvironment = '';
let availableKeyboardLayouts: string[] = [];
let initialized = false;

function initLinuxConfig(): void {
    if (initialized) return;
    distribution = (process.env['DESKTOP_SESSION'] ?? '').toLowerCase();
    desktopGroup = (process.env['XDG_SESSION_TYPE'] ?? '').toLowerCase();
    desktopEnvironment = (process.env['XDG_CURRENT_DESKTOP'] ?? '').toLowerCase();
    initialized = true;
}

function isGnomeDesktop(): boolean {
    return distribution.startsWith('ubuntu') || desktopEnvironment.includes('gnome');
}

function isWayland(): boolean {
    return desktopGroup === 'wayland';
}

async function getUbuntuLayout(): Promise<KeyboardLayout> {
    // Output example: [('xkb', 'us'), ('xkb', 'ru'), ('xkb', 'ca+eng')]
    const output = await exec('gsettings', [
        'get',
        'org.gnome.desktop.input-sources',
        'mru-sources',
    ]);
    const afterFirst = output.split("('xkb', '")[1];
    if (!afterFirst) return EMPTY;
    const value = afterFirst.split("')")[0];
    const split = value.split('+');
    const language = split.length > 1 ? split[1] : '';
    const country = split[0];
    return { language, country, variant: '' };
}

async function getOtherLinuxLayout(): Promise<KeyboardLayout> {
    if (availableKeyboardLayouts.length === 0) {
        // Output example:
        // rules:      evdev
        // model:      pc105
        // layout:     us
        // options:    grp:win_space_toggle,...
        const xkbOutput = await exec('setxkbmap', ['-query']);
        const afterLayout = xkbOutput.split('layout:')[1];
        if (!afterLayout) return EMPTY;
        const layoutLine = afterLayout.split('\n')[0].trim();
        availableKeyboardLayouts = layoutLine.split(',');
    }

    // Output contains LED mask info from which we derive the current layout index
    const xsetOutput = await exec('xset', ['-q']);
    const afterLED = xsetOutput.split('LED mask:')[1];
    if (!afterLED) return EMPTY;
    const ledValue = afterLED.split('\n')[0].trim();
    if (ledValue.length < 5) return EMPTY;
    const layoutIndex = parseInt(ledValue.substring(4, 5), 16);

    if (layoutIndex >= availableKeyboardLayouts.length) {
        return EMPTY;
    }

    // If there are more than 2 layouts and index > 0, we can't reliably determine which
    if (availableKeyboardLayouts.length > 2 && layoutIndex > 0) {
        return EMPTY;
    }

    const country = availableKeyboardLayouts[layoutIndex];
    return { language: '', country, variant: '' };
}

export async function detectLinuxLayout(): Promise<KeyboardLayout> {
    initLinuxConfig();

    if (isGnomeDesktop()) {
        return getUbuntuLayout();
    }

    if (isWayland()) {
        return EMPTY;
    }

    return getOtherLinuxLayout();
}
