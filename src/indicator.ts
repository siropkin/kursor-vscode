import * as vscode from 'vscode';
import { KursorConfig } from './config';

type IndicatorMode = 'midline' | 'endline' | 'emptyline';

let currentDecorationType: vscode.TextEditorDecorationType | undefined;
let currentEditor: vscode.TextEditor | undefined;
let currentText: string | undefined;
let currentColor: string | undefined;
let currentFontSize: number | undefined;
let currentBackgroundColor: string | undefined;
let currentMode: IndicatorMode | undefined;
let currentConfig: KursorConfig | undefined;

function opacityToHex(opacity: number): string {
    const clamped = Math.max(0, Math.min(255, Math.round(opacity)));
    return clamped.toString(16).padStart(2, '0');
}

function createDecorationType(
    text: string,
    color: string,
    config: KursorConfig,
    mode: IndicatorMode,
): vscode.TextEditorDecorationType {
    const alpha = opacityToHex(255);
    let colorWithAlpha: string;
    if (color.startsWith('#') && color.length === 7) {
        colorWithAlpha = color + alpha;
    } else {
        colorWithAlpha = color;
    }

    const hasBg = config.backgroundColor.trim().length > 0;
    let bgColorWithAlpha: string | undefined;
    if (hasBg) {
        const bg = config.backgroundColor;
        if (bg.startsWith('#') && bg.length === 7) {
            bgColorWithAlpha = bg + alpha;
        } else {
            bgColorWithAlpha = bg;
        }
    }

    const leftOffset = mode === 'endline' ? 'calc(1ch + 0.3em)' : '0.3em';

    const textDecorationStyles = [
        'none',
        'pointer-events: none',
        `font-size: ${config.fontSize}px`,
        'font-weight: normal',
        'font-style: normal',
        'white-space: nowrap',
    ];
    if (mode === 'emptyline') {
        textDecorationStyles.push(
            'display: inline-block',
            'position: relative',
            'top: calc(-1lh - 0.9em)',
            'left: 0.4em',
        );
        if (hasBg) {
            textDecorationStyles.push(`margin-right: -${text.length}ch`);
        } else {
            textDecorationStyles.push('width: 0', 'overflow: visible');
        }
    } else {
        textDecorationStyles.push(
            'display: inline-block',
            'position: relative',
            'top: -0.9em',
            `left: ${leftOffset}`,
        );
        if (hasBg) {
            textDecorationStyles.push(`margin-right: -${text.length}ch`);
        } else {
            textDecorationStyles.push('width: 0', 'overflow: visible');
        }
    }
    const textDecoration = textDecorationStyles.join('; ');

    return vscode.window.createTextEditorDecorationType({
        before: {
            contentText: text,
            color: colorWithAlpha,
            backgroundColor: bgColorWithAlpha,
            fontWeight: 'normal',
            textDecoration,
        },
        rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
    });
}

function getIndicatorMode(editor: vscode.TextEditor): IndicatorMode {
    const cursor = editor.selection.active;
    const line = editor.document.lineAt(cursor.line);
    if (line.range.end.character === 0) {
        return 'emptyline';
    }
    if (cursor.character >= line.range.end.character) {
        return 'endline';
    }
    return 'midline';
}

function getDecorationRange(editor: vscode.TextEditor, mode: IndicatorMode): vscode.Range {
    const cursor = editor.selection.active;
    if (mode === 'endline') {
        return new vscode.Range(cursor.translate(0, -1), cursor);
    }
    if (mode === 'emptyline') {
        const nextLine = cursor.line + 1;
        if (nextLine < editor.document.lineCount) {
            const nextLineLen = editor.document.lineAt(nextLine).range.end.character;
            if (nextLineLen > 0) {
                const start = new vscode.Position(nextLine, 0);
                return new vscode.Range(start, start.translate(0, 1));
            }
        }
        if (cursor.line > 0) {
            const prevLine = editor.document.lineAt(cursor.line - 1);
            const endChar = prevLine.range.end.character;
            if (endChar > 0) {
                return new vscode.Range(
                    new vscode.Position(cursor.line - 1, endChar - 1),
                    new vscode.Position(cursor.line - 1, endChar),
                );
            }
        }
        return new vscode.Range(cursor, cursor);
    }
    return new vscode.Range(cursor, cursor.translate(0, 1));
}

function ensureDecorationType(mode: IndicatorMode): void {
    if (mode !== currentMode && currentText && currentColor && currentConfig) {
        if (currentDecorationType) {
            if (currentEditor) {
                currentEditor.setDecorations(currentDecorationType, []);
            }
            currentDecorationType.dispose();
        }
        currentDecorationType = createDecorationType(currentText, currentColor, currentConfig, mode);
        currentMode = mode;
    }
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

    if (currentEditor && currentEditor !== editor && currentDecorationType) {
        currentEditor.setDecorations(currentDecorationType, []);
    }

    const mode = getIndicatorMode(editor);

    if (
        text !== currentText ||
        color !== currentColor ||
        config.fontSize !== currentFontSize ||
        config.backgroundColor !== currentBackgroundColor ||
        mode !== currentMode
    ) {
        if (currentDecorationType) {
            currentDecorationType.dispose();
        }
        currentDecorationType = createDecorationType(text, color, config, mode);
        currentText = text;
        currentColor = color;
        currentFontSize = config.fontSize;
        currentBackgroundColor = config.backgroundColor;
        currentMode = mode;
        currentConfig = config;
    }

    currentEditor = editor;
    const range = getDecorationRange(editor, mode);
    editor.setDecorations(currentDecorationType!, [{ range }]);
}

export function repositionIndicator(editor: vscode.TextEditor): void {
    if (!currentDecorationType || !currentText || !currentConfig) return;

    const mode = getIndicatorMode(editor);

    ensureDecorationType(mode);

    const range = getDecorationRange(editor, mode);
    editor.setDecorations(currentDecorationType!, [{ range }]);
}

export function disposeIndicator(): void {
    if (currentDecorationType) {
        if (currentEditor) {
            currentEditor.setDecorations(currentDecorationType, []);
        }
        currentDecorationType.dispose();
        currentDecorationType = undefined;
    }
    currentEditor = undefined;
    currentText = undefined;
    currentColor = undefined;
    currentFontSize = undefined;
    currentBackgroundColor = undefined;
    currentMode = undefined;
    currentConfig = undefined;
}
