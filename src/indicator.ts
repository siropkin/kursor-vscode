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
            fontWeight: 'normal',
            textDecoration: `none; font-size: ${config.fontSize}px; position: relative; top: -0.9em; left: ${config.horizontalOffset}px; display: inline-block; width: 0; overflow: visible; white-space: nowrap`,
        },
        rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
    });
}

function getDecorationRange(editor: vscode.TextEditor): vscode.Range {
    const cursor = editor.selection.active;
    const line = editor.document.lineAt(cursor.line);
    // Use a single-character range so that VS Code creates a real DOM span.
    if (cursor.character < line.range.end.character) {
        return new vscode.Range(cursor, cursor.translate(0, 1));
    }
    // Cursor at end of line — decorate the last character
    if (line.range.end.character > 0) {
        const last = new vscode.Position(cursor.line, line.range.end.character - 1);
        return new vscode.Range(last, line.range.end);
    }
    // Empty line — zero-width fallback
    return new vscode.Range(cursor, cursor);
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

    const range = getDecorationRange(editor);
    editor.setDecorations(currentDecorationType!, [{ range }]);
}

export function repositionIndicator(editor: vscode.TextEditor): void {
    if (!currentDecorationType) return;
    const range = getDecorationRange(editor);
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
