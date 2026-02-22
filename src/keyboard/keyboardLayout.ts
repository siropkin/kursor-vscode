export interface KeyboardLayout {
    language: string;
    country: string;
    variant: string;
}

export function keyboardLayoutToString(layout: KeyboardLayout): string {
    return [layout.variant, layout.country, layout.language].find(s => s.length > 0) ?? '';
}

export function isKeyboardLayoutEmpty(layout: KeyboardLayout): boolean {
    return layout.language === '' && layout.country === '' && layout.variant === '';
}
