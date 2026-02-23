import * as vscode from 'vscode';

export interface KursorConfig {
    defaultLanguage: string;
    cursorColor: string;
    showTextIndicator: boolean;
    indicateDefaultLanguage: boolean;
    indicateCapsLock: boolean;
    textIndicatorColor: string;
    fontSize: number;
    backgroundColor: string;
    pollingInterval: number;
}

export function readConfig(): KursorConfig {
    const config = vscode.workspace.getConfiguration('kursor');
    return {
        defaultLanguage: config.get<string>('defaultLanguage', 'us'),
        cursorColor: config.get<string>('cursor.color', '#FF8C00'),
        showTextIndicator: config.get<boolean>('showTextIndicator', true),
        indicateDefaultLanguage: config.get<boolean>('indicateDefaultLanguage', false),
        indicateCapsLock: config.get<boolean>('indicateCapsLock', true),
        textIndicatorColor: config.get<string>('textIndicator.color', '#000000'),
        fontSize: config.get<number>('textIndicator.fontSize', 11),
        backgroundColor: config.get<string>('textIndicator.backgroundColor', '#FF8C00'),
        pollingInterval: config.get<number>('pollingInterval', 500),
    };
}
