import * as vscode from 'vscode';
import { KursorConfig } from './config';

let currentDecorationType: vscode.TextEditorDecorationType | undefined;
let currentText: string | undefined;
let currentColor: string | undefined;
let currentFontSize: number | undefined;
let currentOpacity: number | undefined;
let currentOffset: number | undefined;

function opacityToHex(opacity: number): string {
    const clamped = Math.max(0, Math.min(255, Math.round(opacity)));
    return clamped.toString(16).padStart(2, '0');
}

function createDecorationType(
    text: string,
    color: string,
    config: KursorConfig,
): vscode.TextEditorDecorationType {
    const alpha = opacityToHex(config.opacity);
    // Append alpha to the hex color
    let colorWithAlpha: string;
    if (color.startsWith('#') && color.length === 7) {
        colorWithAlpha = color + alpha;
    } else {
        colorWithAlpha = color;
    }

    return vscode.window.createTextEditorDecorationType({
        after: {
            contentText: text,
            color: colorWithAlpha,
            margin: `0 0 0 ${config.horizontalOffset}px`,
            fontWeight: 'normal',
            textDecoration: `none; font-size: ${config.fontSize}px; position: relative; top: -0.9em`,
        },
        rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
    });
}

export function updateIndicator(
    editor: vscode.TextEditor | undefined,
    text: string | null,
    color: string,
    config: KursorConfig,
): void {
    if (!editor) {
        disposeIndicator();
        return;
    }

    // If text is null, hide the indicator
    if (text === null) {
        disposeIndicator();
        return;
    }

    // Only recreate decoration if appearance changed
    if (
        text !== currentText ||
        color !== currentColor ||
        config.fontSize !== currentFontSize ||
        config.opacity !== currentOpacity ||
        config.horizontalOffset !== currentOffset
    ) {
        if (currentDecorationType) {
            currentDecorationType.dispose();
        }
        currentDecorationType = createDecorationType(text, color, config);
        currentText = text;
        currentColor = color;
        currentFontSize = config.fontSize;
        currentOpacity = config.opacity;
        currentOffset = config.horizontalOffset;
    }

    // Apply decoration at cursor position
    const cursorPosition = editor.selection.active;
    const range = new vscode.Range(cursorPosition, cursorPosition);
    editor.setDecorations(currentDecorationType!, [{ range }]);
}

export function repositionIndicator(editor: vscode.TextEditor): void {
    if (!currentDecorationType) return;
    const cursorPosition = editor.selection.active;
    const range = new vscode.Range(cursorPosition, cursorPosition);
    editor.setDecorations(currentDecorationType, [{ range }]);
}

export function disposeIndicator(): void {
    if (currentDecorationType) {
        currentDecorationType.dispose();
        currentDecorationType = undefined;
    }
    currentText = undefined;
    currentColor = undefined;
    currentFontSize = undefined;
    currentOpacity = undefined;
    currentOffset = undefined;
}
