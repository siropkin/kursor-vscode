# Changelog

All notable changes to the Kursor VS Code extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

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

[Unreleased]: https://github.com/siropkin/kursor-vscode/compare/v0.1.4...HEAD
[0.1.4]: https://github.com/siropkin/kursor-vscode/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/siropkin/kursor-vscode/compare/v0.1.0...v0.1.3
[0.1.0]: https://github.com/siropkin/kursor-vscode/releases/tag/v0.1.0
