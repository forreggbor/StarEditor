# StarEditor

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A lightweight, zero-dependency WYSIWYG rich text editor for textarea elements, built with native browser APIs.

## Features

- Zero dependencies — pure vanilla JavaScript
- Transforms any `<textarea>` into a rich text editor
- Complete, consistent toolbar — every feature is always available
- Font size, font family, text and background color
- Tables — insert, edit properties, add/remove rows and columns
- Images — server gallery, local upload (base64), URL; resize by dragging; alt text editing
- Gallery picker — browse and insert server-side galleries
- Code view — toggle between WYSIWYG and raw HTML
- Keyboard shortcuts (Ctrl/Cmd + B, I, U, K, Z, Y)
- Paste as plain text option
- HTML sanitization on paste
- Localization — English and Hungarian, with auto-detection
- Content transform hooks for custom storage formats (e.g. shortcodes)
- CSS auto-injection — no separate stylesheet needed
- Clean API with `destroy()`

## Requirements

- Modern browser (Chrome, Firefox, Safari, Edge)
- No external dependencies
- Compatible with Bootstrap modals (focus trap aware)

## Installation

Copy `StarEditor.js` to your project and include it:

```html
<script src="path/to/StarEditor.js"></script>
```

For production, use the minified build:

```html
<script src="path/to/dist/StarEditor.min.js"></script>
```

## Quick Start

```html
<form method="post">
    <textarea id="content" name="content"></textarea>
    <button type="submit">Save</button>
</form>

<script src="StarEditor.js"></script>
<script>
    const editor = new StarEditor(document.getElementById('content'));
</script>
```

The editor automatically syncs its HTML content to the textarea on form submission.

## Documentation

| Document | Contents |
|----------|----------|
| [Configuration](doc/CONFIGURATION.md) | All options, toolbar reference, styling, localization, examples |
| [Images & Galleries](doc/IMAGES-AND-GALLERIES.md) | Server image gallery, gallery picker, image insert hook, content transform hooks |
| [API Reference](doc/API.md) | Constructor, instance methods, static methods, keyboard shortcuts |

## License

[MIT](LICENSE) — © 2026 PatrikMol Solutions Kft.
