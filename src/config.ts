import * as vscode from 'vscode';

export interface KursorConfig {
    defaultLanguage: string;
    indicateCapsLock: boolean;
    indicateDefaultLanguage: boolean;
    cursorColor: string;
    showTextIndicator: boolean;
    textIndicatorColor: string;
    textIndicatorBackgroundColor: string;
    pollingInterval: number;
}

export function readConfig(): KursorConfig {
    const config = vscode.workspace.getConfiguration('kursor');
    return {
        defaultLanguage: config.get<string>('defaultLanguage', 'us'),
        indicateCapsLock: config.get<boolean>('indicateCapsLock', true),
        indicateDefaultLanguage: config.get<boolean>('indicateDefaultLanguage', false),
        cursorColor: config.get<string>('cursor.color', '#FF8C00'),
        showTextIndicator: config.get<boolean>('showTextIndicator', true),
        textIndicatorColor: config.get<string>('textIndicator.color', '#000000'),
        textIndicatorBackgroundColor: config.get<string>('textIndicator.backgroundColor', '#FF8C00'),
        pollingInterval: config.get<number>('pollingInterval', 500),
    };
}
