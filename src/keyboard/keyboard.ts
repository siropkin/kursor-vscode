import { KeyboardLayout } from './keyboardLayout';
import { detectMacLayout } from './macDetector';
import { detectWindowsLayout } from './windowsDetector';
import { detectLinuxLayout } from './linuxDetector';

export async function detectKeyboardLayout(): Promise<KeyboardLayout> {
    switch (process.platform) {
        case 'darwin':
            return detectMacLayout();
        case 'win32':
            return detectWindowsLayout();
        case 'linux':
            return detectLinuxLayout();
        default:
            return { language: '', country: '', variant: '' };
    }
}
