import { execFile } from 'child_process';
import { KeyboardLayout } from './keyboardLayout';
import {
    MacStandardKeyboardVariants,
    MacSogouPinyinVariants,
    MacRimeSquirrelVariants,
    MacLayoutNameToLocale,
} from './macKeyboardVariants';

const EMPTY: KeyboardLayout = { language: '', country: '', variant: '' };

function exec(command: string, args: string[]): Promise<string> {
    return new Promise((resolve) => {
        execFile(command, args, { timeout: 3000 }, (error, stdout) => {
            resolve(error ? '' : stdout);
        });
    });
}

function extractDictEntries(output: string): string[] {
    const entries: string[] = [];
    const regex = /\{([^}]+)\}/g;
    let match;
    while ((match = regex.exec(output)) !== null) {
        entries.push(match[1]);
    }
    return entries;
}

function parseKeyboardEntry(content: string): KeyboardLayout | null {
    // Extract keyboard layout info
    const nameMatch = content.match(
        /"KeyboardLayout Name"\s*=\s*(?:"([^"]+)"|([^;\s]+))/,
    );
    const layoutName = nameMatch ? (nameMatch[1] ?? nameMatch[2] ?? '') : '';

    const idMatch = content.match(/"KeyboardLayout ID"\s*=\s*(-?\d+)/);
    const layoutId = idMatch ? idMatch[1] : '';

    if (!layoutName && !layoutId) return null;

    // Try ID-based variant lookup (matching IntelliJ behavior)
    const variant = MacStandardKeyboardVariants[layoutId] ?? '';

    // Get locale from layout name
    const locale = MacLayoutNameToLocale[layoutName];
    if (locale) {
        return { language: locale.language, country: locale.country, variant };
    }

    // Fallback: use layout name as country
    if (layoutName) {
        return { language: '', country: layoutName, variant };
    }

    return EMPTY;
}

function parseInputMethodEntry(content: string): KeyboardLayout | null {
    // Check for Input Mode (Sogou Pinyin, Rime Squirrel, etc.)
    const inputModeMatch = content.match(/"Input Mode"\s*=\s*"([^"]+)"/);
    if (inputModeMatch) {
        const inputMode = inputModeMatch[1];
        const variant =
            MacSogouPinyinVariants[inputMode] ??
            MacRimeSquirrelVariants[inputMode];
        if (variant) return { language: '', country: '', variant };
    }

    // Check for Bundle ID-based input methods
    const bundleIdMatch = content.match(/"Bundle ID"\s*=\s*"([^"]+)"/);
    if (bundleIdMatch) {
        const bundleId = bundleIdMatch[1];
        const variant =
            MacSogouPinyinVariants[bundleId] ??
            MacRimeSquirrelVariants[bundleId];
        if (variant) return { language: '', country: '', variant };
    }

    return null;
}

export async function detectMacLayout(): Promise<KeyboardLayout> {
    const output = await exec('defaults', [
        'read',
        'com.apple.HIToolbox',
        'AppleSelectedInputSources',
    ]);
    if (!output) return EMPTY;

    const entries = extractDictEntries(output);

    // First pass: look for a "Keyboard Layout" entry
    for (const entry of entries) {
        if (entry.includes('"Keyboard Layout"')) {
            const result = parseKeyboardEntry(entry);
            if (result) return result;
        }
    }

    // Second pass: look for known input method entries
    for (const entry of entries) {
        if (entry.includes('"Input Mode"') || entry.includes('"Bundle ID"')) {
            const result = parseInputMethodEntry(entry);
            if (result) return result;
        }
    }

    return EMPTY;
}
