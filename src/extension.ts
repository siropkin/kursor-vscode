import * as vscode from 'vscode';
import { detectKeyboardLayout } from './keyboard/keyboard';
import { keyboardLayoutToString, isKeyboardLayoutEmpty } from './keyboard/keyboardLayout';
import { readConfig, KursorConfig } from './config';
import { updateIndicator, repositionIndicator, disposeIndicator } from './indicator';
import { initCursorColor, updateCursorColor, restoreCursorColor } from './cursorColor';

let pollingTimer: ReturnType<typeof setInterval> | undefined;
let lastLayoutString = '';
let config: KursorConfig;
let isPolling = false;
let log: vscode.OutputChannel;

async function pollLayout(): Promise<void> {
    if (isPolling) return;
    isPolling = true;

    try {
        if (vscode.window.visibleTextEditors.length === 0) return;

        const layout = await detectKeyboardLayout();
        const layoutString = isKeyboardLayoutEmpty(layout)
            ? ''
            : keyboardLayoutToString(layout);

        if (layoutString === lastLayoutString) return;

        log.appendLine(`[poll] Layout changed: "${lastLayoutString}" → "${layoutString}"`);
        lastLayoutString = layoutString;

        await applyLayout(layoutString);
    } finally {
        isPolling = false;
    }
}

async function applyLayout(layoutString: string): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    const isDefaultLanguage =
        layoutString.toLowerCase() === config.defaultLanguage.toLowerCase();

    // Cursor color
    if (config.changeColorOnNonDefaultLanguage && !isDefaultLanguage && layoutString !== '') {
        await updateCursorColor(config.colorOnNonDefaultLanguage, log);
    } else {
        await updateCursorColor(null, log);
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

    log.appendLine(`[indicator] Showing "${indicatorText}" in ${indicatorColor}`);
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

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    log = vscode.window.createOutputChannel('Kursor');
    log.appendLine('[activate] Kursor extension starting...');

    config = readConfig();
    log.appendLine(`[activate] Config: defaultLanguage="${config.defaultLanguage}", pollingInterval=${config.pollingInterval}`);

    // Save original cursor color before we modify anything
    await initCursorColor(config.colorOnNonDefaultLanguage, log);

    startPolling();
    pollLayout();

    context.subscriptions.push(
        vscode.window.onDidChangeTextEditorSelection((e) => {
            repositionIndicator(e.textEditor);
        }),
    );

    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(() => {
            applyLayout(lastLayoutString);
        }),
    );

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration('kursor')) {
                config = readConfig();
                log.appendLine(`[config] Settings changed, reloading`);
                startPolling();
                lastLayoutString = '';
                pollLayout();
            }
        }),
    );

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

    context.subscriptions.push({
        dispose(): void {
            stopPolling();
            disposeIndicator();
        },
    });

    log.appendLine('[activate] Kursor extension started');
}

export async function deactivate(): Promise<void> {
    log?.appendLine('[deactivate] Kursor extension stopping...');
    stopPolling();
    disposeIndicator();
    await restoreCursorColor(log);
    log?.appendLine('[deactivate] Kursor extension stopped');
}
