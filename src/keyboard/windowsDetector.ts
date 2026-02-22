import { execFile } from 'child_process';
import { KeyboardLayout } from './keyboardLayout';
import { WindowsKeyboardVariants } from './windowsKeyboardVariants';

const EMPTY: KeyboardLayout = { language: '', country: '', variant: '' };

function exec(command: string, args: string[]): Promise<string> {
    return new Promise((resolve) => {
        execFile(command, args, { timeout: 5000 }, (error, stdout) => {
            resolve(error ? '' : stdout.trim());
        });
    });
}

const PS_COMMAND = [
    'Add-Type -AssemblyName System.Windows.Forms;',
    '$l = [System.Windows.Forms.InputLanguage]::CurrentInputLanguage;',
    '"$($l.Culture.TwoLetterISOLanguageName)|$($l.Culture.Name)|$($l.Handle.ToInt64().ToString(\'X16\'))"',
].join(' ');

export async function detectWindowsLayout(): Promise<KeyboardLayout> {
    const output = await exec('powershell', [
        '-NoProfile',
        '-NonInteractive',
        '-Command',
        PS_COMMAND,
    ]);
    if (!output) return EMPTY;

    const parts = output.split('|');
    if (parts.length < 3) return EMPTY;

    const language = parts[0]; // e.g., "en", "ru"
    const cultureName = parts[1]; // e.g., "en-US", "ru-RU"
    const handleHex = parts[2]; // e.g., "0000000004090409"

    // Extract country from culture name
    const country = cultureName.includes('-')
        ? cultureName.split('-')[1]
        : '';

    // Extract layout ID from handle for variant lookup
    // Handle format: layout bits (variable) + language ID (last 4 hex chars)
    let variant = '';
    if (handleHex.length >= 4) {
        const layoutPart = handleHex.slice(0, -4);

        // Handle special extended layouts (matching IntelliJ logic)
        const specialMappings: Record<string, string> = {
            'FFFFFFFFF008': '00010419',
            'FFFFFFFFF014': '0001041F',
            'FFFFFFFFF012': '00010407',
        };

        const layoutId =
            specialMappings[layoutPart] ??
            layoutPart.slice(-8).padStart(8, '0');
        variant = WindowsKeyboardVariants[layoutId.toUpperCase()] ?? '';
    }

    return { language, country, variant };
}
