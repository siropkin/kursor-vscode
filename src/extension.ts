import * as vscode from 'vscode';
import { detectKeyboardLayout } from './keyboard/keyboard';
import { keyboardLayoutToString, isKeyboardLayoutEmpty } from './keyboard/keyboardLayout';
import { readConfig, KursorConfig } from './config';
import { updateIndicator, repositionIndicator, disposeIndicator } from './indicator';
import { updateCursorColor, restoreCursorColor } from './cursorColor';

let pollingTimer: ReturnType<typeof setInterval> | undefined;
let lastLayoutString = '';
let config: KursorConfig;

async function pollLayout(): Promise<void> {
    // Skip if no visible editors
    if (vscode.window.visibleTextEditors.length === 0) return;

    const layout = await detectKeyboardLayout();
    const layoutString = isKeyboardLayoutEmpty(layout)
        ? ''
        : keyboardLayoutToString(layout);

    // Skip update if layout hasn't changed
    if (layoutString === lastLayoutString) return;
    lastLayoutString = layoutString;

    await applyLayout(layoutString);
}

async function applyLayout(layoutString: string): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    const isDefaultLanguage =
        layoutString.toLowerCase() === config.defaultLanguage.toLowerCase();

    // Cursor color
    if (config.changeColorOnNonDefaultLanguage && !isDefaultLanguage && layoutString !== '') {
        await updateCursorColor(config.colorOnNonDefaultLanguage);
    } else {
        await updateCursorColor(null);
    }

    // Text indicator
    if (!config.showTextIndicator) {
        updateIndicator(editor, null, '', config);
        return;
    }

    if (isDefaultLanguage && !config.indicateDefaultLanguage) {
        updateIndicator(editor, null, '', config);
        return;
    }

    if (layoutString === '') {
        updateIndicator(editor, null, '', config);
        return;
    }

    const indicatorText = layoutString.toLowerCase();
    const indicatorColor =
        !isDefaultLanguage && config.changeColorOnNonDefaultLanguage
            ? config.colorOnNonDefaultLanguage
            : '#888888';

    updateIndicator(editor, indicatorText, indicatorColor, config);
}

function startPolling(): void {
    stopPolling();
    pollingTimer = setInterval(pollLayout, config.pollingInterval);
}

function stopPolling(): void {
    if (pollingTimer !== undefined) {
        clearInterval(pollingTimer);
        pollingTimer = undefined;
    }
}

export function activate(context: vscode.ExtensionContext): void {
    config = readConfig();

    // Start polling
    startPolling();

    // Trigger immediate check
    pollLayout();

    // Update decoration position on cursor move
    context.subscriptions.push(
        vscode.window.onDidChangeTextEditorSelection((e) => {
            repositionIndicator(e.textEditor);
            // Trigger immediate layout check on cursor move
            pollLayout();
        }),
    );

    // Update decoration when active editor changes
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(() => {
            lastLayoutString = ''; // Force re-evaluation
            pollLayout();
        }),
    );

    // Reload config when settings change
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration('kursor')) {
                config = readConfig();
                startPolling(); // Restart with new interval
                lastLayoutString = ''; // Force re-evaluation
                pollLayout();
            }
        }),
    );

    // Register detect layout command
    context.subscriptions.push(
        vscode.commands.registerCommand('kursor.detectLayout', async () => {
            const layout = await detectKeyboardLayout();
            const layoutString = keyboardLayoutToString(layout);

            if (isKeyboardLayoutEmpty(layout)) {
                vscode.window.showInformationMessage(
                    'Kursor: Could not detect keyboard layout.',
                );
                return;
            }

            const setAsDefault = 'Set as Default';
            const result = await vscode.window.showInformationMessage(
                `Kursor: Current keyboard layout is "${layoutString}".`,
                setAsDefault,
            );

            if (result === setAsDefault) {
                const kursorConfig = vscode.workspace.getConfiguration('kursor');
                await kursorConfig.update(
                    'defaultLanguage',
                    layoutString.toLowerCase(),
                    vscode.ConfigurationTarget.Global,
                );
                vscode.window.showInformationMessage(
                    `Kursor: Default language set to "${layoutString.toLowerCase()}".`,
                );
            }
        }),
    );

    // Cleanup on dispose
    context.subscriptions.push({
        dispose(): void {
            stopPolling();
            disposeIndicator();
        },
    });
}

export async function deactivate(): Promise<void> {
    stopPolling();
    disposeIndicator();
    await restoreCursorColor();
}
