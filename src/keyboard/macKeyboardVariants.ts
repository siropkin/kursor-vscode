// Standard Layouts — keyed by KeyboardLayout ID from macOS plist
// https://github.com/acidanthera/OpenCorePkg/blob/master/Utilities/AppleKeyboardLayouts/AppleKeyboardLayouts.txt
export const MacStandardKeyboardVariants: Record<string, string> = {
    '19456': 'RU',    // Russian
    '19458': 'RU',    // Russian - PC
    '-23205': 'UK',   // Ukrainian-QWERTY
    '-2354': 'UK',    // Ukrainian
};

// Apple built-in Chinese Input Methods
export const MacAppleChineseVariants: Record<string, string> = {
    'com.apple.inputmethod.SCIM': 'ZH',
    'com.apple.inputmethod.SCIM.ITABC': 'ZH',
    'com.apple.inputmethod.SCIM.WBX': 'ZH',
    'com.apple.inputmethod.SCIM.Shuangpin': 'ZH',
    'com.apple.inputmethod.TCIM': 'ZH',
    'com.apple.inputmethod.TCIM.Zhuyin': 'ZH',
    'com.apple.inputmethod.TCIM.Cangjie': 'ZH',
    'com.apple.inputmethod.TCIM.Pinyin': 'ZH',
};

// Sogou Pinyin Layouts https://pinyin.sogou.com/mac
export const MacSogouPinyinVariants: Record<string, string> = {
    'com.sogou.inputmethod.pinyin': 'ZH',
};

// Rime Squirrel Layouts https://rime.im
export const MacRimeSquirrelVariants: Record<string, string> = {
    'im.rime.inputmethod.Squirrel.Hans': 'ZH', // Simplified
    'im.rime.inputmethod.Squirrel.Hant': 'ZH', // Traditional
};

// Mapping from macOS KeyboardLayout Name to locale info
export const MacLayoutNameToLocale: Record<string, { language: string; country: string }> = {
    // English
    'U.S.': { language: 'en', country: 'US' },
    'ABC': { language: 'en', country: 'US' },
    'ABC - Extended': { language: 'en', country: 'US' },
    'USInternational-PC': { language: 'en', country: 'US' },
    'US Extended': { language: 'en', country: 'US' },
    'Dvorak': { language: 'en', country: 'US' },
    'Dvorak - Left': { language: 'en', country: 'US' },
    'Dvorak - Right': { language: 'en', country: 'US' },
    'Colemak': { language: 'en', country: 'US' },
    'British': { language: 'en', country: 'GB' },
    'British - PC': { language: 'en', country: 'GB' },
    'Australian': { language: 'en', country: 'AU' },
    'Canadian English': { language: 'en', country: 'CA' },
    'Irish': { language: 'en', country: 'IE' },
    // French
    'French': { language: 'fr', country: 'FR' },
    'French - PC': { language: 'fr', country: 'FR' },
    'French - Numerical': { language: 'fr', country: 'FR' },
    'Canadian French - CSA': { language: 'fr', country: 'CA' },
    'Swiss French': { language: 'fr', country: 'CH' },
    'Belgian': { language: 'fr', country: 'BE' },
    // German
    'German': { language: 'de', country: 'DE' },
    'German - Standard': { language: 'de', country: 'DE' },
    'Austrian': { language: 'de', country: 'AT' },
    'Swiss German': { language: 'de', country: 'CH' },
    // Italian
    'Italian': { language: 'it', country: 'IT' },
    'Italian - Pro': { language: 'it', country: 'IT' },
    // Spanish
    'Spanish': { language: 'es', country: 'ES' },
    'Spanish - ISO': { language: 'es', country: 'ES' },
    'Latin American': { language: 'es', country: 'LA' },
    // Portuguese
    'Portuguese': { language: 'pt', country: 'PT' },
    'Brazilian': { language: 'pt', country: 'BR' },
    'Brazilian - Pro': { language: 'pt', country: 'BR' },
    // Dutch
    'Dutch': { language: 'nl', country: 'NL' },
    // Nordic
    'Swedish': { language: 'sv', country: 'SE' },
    'Swedish - Pro': { language: 'sv', country: 'SE' },
    'Norwegian': { language: 'nb', country: 'NO' },
    'Norwegian Extended': { language: 'nb', country: 'NO' },
    'Danish': { language: 'da', country: 'DK' },
    'Finnish': { language: 'fi', country: 'FI' },
    'Finnish Extended': { language: 'fi', country: 'FI' },
    'Icelandic': { language: 'is', country: 'IS' },
    // Eastern European
    'Polish': { language: 'pl', country: 'PL' },
    'Polish Pro': { language: 'pl', country: 'PL' },
    'Czech': { language: 'cs', country: 'CZ' },
    'Czech - QWERTY': { language: 'cs', country: 'CZ' },
    'Slovak': { language: 'sk', country: 'SK' },
    'Slovak - QWERTY': { language: 'sk', country: 'SK' },
    'Hungarian': { language: 'hu', country: 'HU' },
    'Romanian': { language: 'ro', country: 'RO' },
    'Romanian - Standard': { language: 'ro', country: 'RO' },
    'Croatian': { language: 'hr', country: 'HR' },
    'Croatian - PC': { language: 'hr', country: 'HR' },
    'Slovenian': { language: 'sl', country: 'SI' },
    'Serbian': { language: 'sr', country: 'RS' },
    'Serbian - Latin': { language: 'sr', country: 'RS' },
    'Bosnian': { language: 'bs', country: 'BA' },
    'Bulgarian': { language: 'bg', country: 'BG' },
    'Bulgarian - Phonetic': { language: 'bg', country: 'BG' },
    'Estonian': { language: 'et', country: 'EE' },
    'Latvian': { language: 'lv', country: 'LV' },
    'Lithuanian': { language: 'lt', country: 'LT' },
    // Cyrillic
    'Russian': { language: 'ru', country: 'RU' },
    'RussianWin': { language: 'ru', country: 'RU' },
    'Russian - PC': { language: 'ru', country: 'RU' },
    'Russian - Phonetic': { language: 'ru', country: 'RU' },
    'Ukrainian': { language: 'uk', country: 'UA' },
    'Ukrainian-PC': { language: 'uk', country: 'UA' },
    'Ukrainian - QWERTY': { language: 'uk', country: 'UA' },
    'Belarusian': { language: 'be', country: 'BY' },
    // Greek / Turkish
    'Greek': { language: 'el', country: 'GR' },
    'Greek - Polytonic': { language: 'el', country: 'GR' },
    'Turkish': { language: 'tr', country: 'TR' },
    'Turkish - QWERTY': { language: 'tr', country: 'TR' },
    'Turkish - QWERTY PC': { language: 'tr', country: 'TR' },
    // Middle Eastern
    'Arabic': { language: 'ar', country: 'SA' },
    'Arabic - PC': { language: 'ar', country: 'SA' },
    'Arabic - QWERTY': { language: 'ar', country: 'SA' },
    'Hebrew': { language: 'he', country: 'IL' },
    'Hebrew - PC': { language: 'he', country: 'IL' },
    'Hebrew - QWERTY': { language: 'he', country: 'IL' },
    'Persian': { language: 'fa', country: 'IR' },
    'Persian - Standard': { language: 'fa', country: 'IR' },
    'Persian - ISIRI': { language: 'fa', country: 'IR' },
    // Asian
    'Thai': { language: 'th', country: 'TH' },
    'Thai - PattaChote': { language: 'th', country: 'TH' },
    'Vietnamese': { language: 'vi', country: 'VN' },
    'Hindi': { language: 'hi', country: 'IN' },
    'Hindi - Traditional': { language: 'hi', country: 'IN' },
    'Devanagari': { language: 'hi', country: 'IN' },
    'Gujarati': { language: 'gu', country: 'IN' },
    'Tamil': { language: 'ta', country: 'IN' },
    // East Asian
    'Japanese': { language: 'ja', country: 'JP' },
    'Kotoeri': { language: 'ja', country: 'JP' },
    'Korean': { language: 'ko', country: 'KR' },
    '2-Set Korean': { language: 'ko', country: 'KR' },
    '390 Sebulshik': { language: 'ko', country: 'KR' },
    'GongjinCheong Romaja': { language: 'ko', country: 'KR' },
};
