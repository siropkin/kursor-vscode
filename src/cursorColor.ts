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
        customizations,
        vscode.ConfigurationTarget.Global,
    );
}

export async function updateCursorColor(color: string | null): Promise<void> {
    // Save original cursor color on first call
    if (!savedOriginal) {
        const customizations = getColorCustomizations();
        originalCursorColor = customizations['editorCursor.foreground'];
        savedOriginal = true;
    }

    // Skip update if color hasn't changed
    const colorOrUndefined = color ?? undefined;
    if (colorOrUndefined === currentCursorColor) return;
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

export async function restoreCursorColor(): Promise<void> {
    if (!savedOriginal) return;

    const customizations = getColorCustomizations();

    if (originalCursorColor) {
        customizations['editorCursor.foreground'] = originalCursorColor;
    } else {
        delete customizations['editorCursor.foreground'];
    }

    await setColorCustomizations(customizations);
    currentCursorColor = undefined;
}
