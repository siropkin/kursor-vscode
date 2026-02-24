# Changelog

All notable changes to the Kursor VS Code extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.2.2] - 2026-02-24

### Added

- Add support for Apple's built-in Chinese input methods on macOS (Pinyin - Simplified, Pinyin - Traditional, Wubi, Shuangpin, Zhuyin, Cangjie).

## [0.2.1] - 2026-02-24

### Fixed

- Fix text indicator position on the very last line of a file (empty trailing line).
- Fix keyboard layout detection on Ubuntu X11 sessions (DESKTOP_SESSION=ubuntu-xorg).
- Add keyboard layout detection support for all GNOME-based desktops (Fedora, Pop!_OS, etc.) on both X11 and Wayland via gsettings.

## [0.2.0] - 2026-02-23

### Changed

- Separate cursor color and text indicator color into independent settings (`kursor.cursor.color`, `kursor.textIndicator.color`).
- Remove `changeColorOnNonDefaultLanguage` toggle — leave `cursor.color` empty to disable.
- Add `kursor.textIndicator.backgroundColor` setting for color-block visibility.
- Remove `kursor.textIndicator.horizontalOffset` and `kursor.textIndicator.opacity` settings (now hardcoded).
- Remove `kursor.textIndicator.fontSize` setting — the indicator now inherits the editor's font size automatically.
- Use backward-compatible defaults for text indicator colors (`#FF8C00` text, no background).

### Fixed

- Stabilize text indicator anchoring near the caret when background color is enabled.
- Fix indicator appearing after inline git blame annotations instead of near the cursor.
- Fix indicator position when cursor is at end of line.
- Fix indicator on empty lines (partially clipped due to VS Code rendering limitation).
- Fix inconsistent text indicator style (bold/italic) depending on cursor position.
- Use relative units (em) for indicator positioning to scale with font size.
- Hide the text indicator while the VS Code window is unfocused and restore it when focus returns.

## [0.1.4] - 2026-02-22

### Changed

- Add logo and IDE badges to README.
- Publish to Open VSX Registry (Cursor Marketplace).

## [0.1.3] - 2026-02-21

### Fixed

- Fix indicator position being pushed far right by inline git blame annotations.
- Fix indicator text shifting adjacent characters (now zero-width overlay).
- Fix cursor color staying orange after restart when closed with non-default language active.

## [0.1.0] - 2026-02-21

### Added

- Initial release of Kursor for VS Code.
- Keyboard layout indicator displayed near the cursor.
- Cursor color change for non-default languages.
- Support for macOS, Windows, and Linux.
- Configurable font size, opacity, horizontal offset, and polling interval.
- Command to detect current keyboard layout and set as default.
- Support for Sogou Pinyin and Rime Squirrel input methods on macOS.

[Unreleased]: https://github.com/siropkin/kursor-vscode/compare/v0.2.2...HEAD
[0.2.2]: https://github.com/siropkin/kursor-vscode/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/siropkin/kursor-vscode/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/siropkin/kursor-vscode/compare/v0.1.4...v0.2.0
[0.1.4]: https://github.com/siropkin/kursor-vscode/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/siropkin/kursor-vscode/compare/v0.1.0...v0.1.3
[0.1.0]: https://github.com/siropkin/kursor-vscode/releases/tag/v0.1.0
