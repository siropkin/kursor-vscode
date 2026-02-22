import * as vscode from 'vscode';

let originalCursorColor: string | undefined;
let currentCursorColor: string | undefined;
let savedOriginal = false;

function getColorCustomizations(): Record<string, string> {
    const config = vscode.workspace.getConfiguration('workbench');
    return { ...(config.get<Record<string, string>>('colorCustomizations') ?? {}) };
}

async function setColorCustomizations(
    customizations: Record<string, string>,
): Promise<void> {
    const config = vscode.workspace.getConfiguration('workbench');
    await config.update(
        'colorCustomizations',
        Object.keys(customizations).length > 0 ? customizations : undefined,
        vscode.ConfigurationTarget.Global,
    );
}

export async function initCursorColor(extensionColor: string, log?: vscode.OutputChannel): Promise<void> {
    if (!savedOriginal) {
        const customizations = getColorCustomizations();
        const current = customizations['editorCursor.foreground'];
        // If the current color matches our extension's color, it's likely
        // leftover from a previous session that didn't deactivate cleanly.
        if (current && current.toLowerCase() === extensionColor.toLowerCase()) {
            originalCursorColor = undefined;
            log?.appendLine(`[cursorColor] Detected leftover color ${current}, cleaning up`);
            // Immediately remove the leftover from settings
            delete customizations['editorCursor.foreground'];
            await setColorCustomizations(customizations);
        } else {
            originalCursorColor = current;
        }
        savedOriginal = true;
        log?.appendLine(`[cursorColor] Original cursor color: ${originalCursorColor ?? 'default'}`);
    }
}

export async function updateCursorColor(
    color: string | null,
    log?: vscode.OutputChannel,
): Promise<void> {

    const colorOrUndefined = color ?? undefined;
    if (colorOrUndefined === currentCursorColor) return;

    log?.appendLine(`[cursorColor] Changing cursor color: ${currentCursorColor ?? 'default'} → ${colorOrUndefined ?? 'default'}`);
    currentCursorColor = colorOrUndefined;

    const customizations = getColorCustomizations();

    if (color) {
        customizations['editorCursor.foreground'] = color;
    } else if (originalCursorColor) {
        customizations['editorCursor.foreground'] = originalCursorColor;
    } else {
        delete customizations['editorCursor.foreground'];
    }

    await setColorCustomizations(customizations);
}

export async function restoreCursorColor(
    log?: vscode.OutputChannel,
): Promise<void> {
    log?.appendLine(`[cursorColor] Restoring cursor color to: ${originalCursorColor ?? 'default'}`);

    const customizations = getColorCustomizations();

    if (originalCursorColor) {
        customizations['editorCursor.foreground'] = originalCursorColor;
    } else {
        delete customizations['editorCursor.foreground'];
    }

    await setColorCustomizations(customizations);
    currentCursorColor = undefined;
}
