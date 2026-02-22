<div align="center">

# Kursor

*VS Code extension for tracking keyboard language*

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/siropkin.kursor?style=flat-square&label=VS%20Code%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=siropkin.kursor)
[![Open VSX](https://img.shields.io/open-vsx/v/siropkin/kursor?style=flat-square&label=Open%20VSX)](https://open-vsx.org/extension/siropkin/kursor)

![Kursor Demo](readme/demo.png)
</div>

> **Also available for IntelliJ IDEA: [GitHub](https://github.com/siropkin/kursor) | [JetBrains Marketplace](https://plugins.jetbrains.com/plugin/22072-kursor)**

<!-- Extension description -->
## What is Kursor?
Avoid typos and coding errors caused by language switching.

Kursor simplifies language tracking directly in your VS Code editor.

It dynamically displays the current keyboard language near your cursor, offering the added functionality of changing the cursor's color to match the language in use.

This feature is particularly beneficial for developers juggling multiple languages, significantly reducing the likelihood of typing errors.

### Features
- **Cursor Color Change:** Automatically changes the cursor color based on the current language.
- **Language Indicator:** Displays the current language near the cursor.
- **Caps Lock Indicator:** Shows the Caps Lock status on the cursor (limited platform support).
- **Customization:** Customize the language indicator's font size, opacity, and position.
- **Supported Operating Systems:** Available on Windows, macOS, and Linux.
- **Supported Languages And Input Methods:** Supports a wide range of languages and input methods, including [Sogou Pinyin](https://pinyin.sogou.com/mac) and [Squirrel](https://rime.im) Zhuyin methods on macOS.


## Usage
Once installed, Kursor automatically activates when VS Code starts. Switch your keyboard layout and a language indicator will appear near the cursor within 500ms.

Use the command **Kursor: Detect Current Keyboard Layout** (from the Command Palette) to see the current layout and optionally set it as the default.


## Customization
You can customize Kursor's settings to suit your preferences:

1. Go to `File` > `Preferences` > `Settings`.
2. Search for `Kursor`.
3. Adjust the settings to your liking.

### Settings
| Setting                                  | Default     | Description                                                      |
| ---------------------------------------- | ----------- | ---------------------------------------------------------------- |
| `kursor.defaultLanguage`                 | `"us"`      | Default keyboard language. Indicator is hidden for this language. |
| `kursor.changeColorOnNonDefaultLanguage` | `true`      | Change cursor color for non-default languages.                   |
| `kursor.colorOnNonDefaultLanguage`       | `"#FF8C00"` | Cursor color for non-default languages.                          |
| `kursor.showTextIndicator`               | `true`      | Show text indicator near the cursor.                             |
| `kursor.indicateDefaultLanguage`         | `false`     | Show indicator even for the default language.                    |
| `kursor.indicateCapsLock`                | `true`      | Show Caps Lock status (limited platform support).                |
| `kursor.textIndicator.fontSize`          | `11`        | Font size of the text indicator (5-20).                          |
| `kursor.textIndicator.opacity`           | `180`       | Opacity of the text indicator (0-255).                           |
| `kursor.textIndicator.horizontalOffset`  | `4`         | Horizontal offset from the cursor in pixels (-10 to 10).         |
| `kursor.pollingInterval`                 | `500`       | Keyboard layout polling interval in milliseconds (100-5000).     |


## Platform Notes

### macOS
Uses `defaults read` to detect the current input source. Supports standard keyboard layouts and input methods (Sogou Pinyin, Rime Squirrel).

### Windows
Uses PowerShell with `System.Windows.Forms.InputLanguage` API. First detection may be slightly slower due to PowerShell startup.

### Linux
- **Ubuntu/GNOME:** Uses `gsettings` to read the most recently used input source.
- **X11:** Uses `setxkbmap` and `xset` to determine the active layout.
- **Wayland:** Not yet supported.


## Feedback and Suggestions
I value your feedback and suggestions to improve Kursor. If you have any ideas, issues, or feature requests, please share them with me on GitHub. Your input helps me make Kursor better for everyone.

To post your feedback or suggestions, visit our GitHub Issues page:

[https://github.com/siropkin/kursor-vscode/issues](https://github.com/siropkin/kursor-vscode/issues)

Thank you for supporting Kursor and helping me enhance your coding experience.


## License
Kursor is open-source and available under the [Apache 2.0 license](https://www.apache.org/licenses/LICENSE-2.0).


## Support
[Buy Me A Coffee](https://www.buymeacoffee.com/ivan.seredkin)
<!-- Extension description end -->
