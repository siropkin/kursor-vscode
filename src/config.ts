import * as vscode from 'vscode';

export interface KursorConfig {
    defaultLanguage: string;
    changeColorOnNonDefaultLanguage: boolean;
    colorOnNonDefaultLanguage: string;
    showTextIndicator: boolean;
    indicateDefaultLanguage: boolean;
    indicateCapsLock: boolean;
    fontSize: number;
    opacity: number;
    horizontalOffset: number;
    pollingInterval: number;
}

export function readConfig(): KursorConfig {
    const config = vscode.workspace.getConfiguration('kursor');
    return {
        defaultLanguage: config.get<string>('defaultLanguage', 'us'),
        changeColorOnNonDefaultLanguage: config.get<boolean>('changeColorOnNonDefaultLanguage', true),
        colorOnNonDefaultLanguage: config.get<string>('colorOnNonDefaultLanguage', '#FF8C00'),
        showTextIndicator: config.get<boolean>('showTextIndicator', true),
        indicateDefaultLanguage: config.get<boolean>('indicateDefaultLanguage', false),
        indicateCapsLock: config.get<boolean>('indicateCapsLock', true),
        fontSize: config.get<number>('textIndicator.fontSize', 11),
        opacity: config.get<number>('textIndicator.opacity', 180),
        horizontalOffset: config.get<number>('textIndicator.horizontalOffset', 4),
        pollingInterval: config.get<number>('pollingInterval', 500),
    };
}
