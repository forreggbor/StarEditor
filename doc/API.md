# API Reference

- [Constructor](#constructor)
- [Instance methods](#instance-methods)
- [Static methods](#static-methods)
- [Keyboard shortcuts](#keyboard-shortcuts)
- [Form submission](#form-submission)
- [Security](#security)
- [Browser support](#browser-support)

---

## Constructor

```javascript
new StarEditor(textarea, options)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `textarea` | `HTMLTextAreaElement` \| `String` | Textarea element or CSS selector |
| `options` | `Object` | Configuration options — see [Configuration](CONFIGURATION.md) |

---

## Instance methods

| Method | Returns | Description |
|--------|---------|-------------|
| `getContent()` | `String` | Current HTML content |
| `setContent(html)` | `void` | Set editor HTML content |
| `getText()` | `String` | Current plain text content (no HTML tags) |
| `focus()` | `void` | Focus the editor |
| `blur()` | `void` | Blur the editor |
| `isEmpty()` | `Boolean` | `true` if the editor has no content |
| `sync()` | `void` | Manually sync content to the underlying textarea |
| `toggleCodeView()` | `void` | Toggle between WYSIWYG and HTML source view |
| `insertTable(rows, cols)` | `void` | Insert a table with the given dimensions |
| `selectTable(table, cell)` | `void` | Select a table for editing |
| `deselectTable()` | `void` | Deselect the currently selected table |
| `insertTableRow(table, cell, pos)` | `void` | Insert a row above or below `cell` (`pos`: `'before'` \| `'after'`) |
| `insertTableColumn(table, cell, pos)` | `void` | Insert a column left or right of `cell` (`pos`: `'before'` \| `'after'`) |
| `deleteTableRow(table, cell)` | `void` | Delete the row containing `cell` |
| `deleteTableColumn(table, cell)` | `void` | Delete the column containing `cell` |
| `deleteTable(table)` | `void` | Delete the entire table |
| `insertImageFromUrl(url, alt, options?)` | `void` | Insert an image programmatically. `options.source` and `options.serverItem` are forwarded to `onImageInsert`. |
| `selectImage(img)` | `void` | Select an image for editing |
| `deselectImage()` | `void` | Deselect the currently selected image |
| `editImageAlt(img)` | `void` | Open the alt text editor for an image |
| `deleteImage(img)` | `void` | Delete the specified image |
| `destroy()` | `void` | Remove the editor and restore the original textarea |

---

## Static methods

| Method | Returns | Description |
|--------|---------|-------------|
| `StarEditor.init(selector, options)` | `StarEditor` \| `Array<StarEditor>` | Create one or more editors from a CSS selector. Returns a single instance when one element matches, an array when multiple match. |

---

## Keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl/Cmd + B | Bold |
| Ctrl/Cmd + I | Italic |
| Ctrl/Cmd + U | Underline |
| Ctrl/Cmd + K | Insert link |
| Ctrl/Cmd + Z | Undo |
| Ctrl/Cmd + Y | Redo |
| Ctrl/Cmd + Shift + Z | Redo (alternative) |

Shortcuts can be disabled with `shortcuts: false`.

---

## Form submission

The editor keeps the underlying textarea in sync at all times. On form submission the textarea value contains the full HTML content — no extra JavaScript needed.

```html
<form method="post" action="/save">
    <textarea id="content" name="content"></textarea>
    <button type="submit">Save</button>
</form>

<script>
    new StarEditor('#content');
</script>
```

---

## Security

The editor sanitizes HTML by removing `<script>`, `<style>`, `<iframe>`, `<object>`, and `<embed>` elements, stripping all `on*` event handler attributes, and escaping URLs in inserted links. This runs on paste, on initial load, on `setContent()`, and when leaving code view — any point where HTML enters the live editor from outside the toolbar.

This sanitization is tag/attribute-level only. It does **not** filter `style=""` attribute values (needed for legitimate font size/color/alignment formatting) — CSS `url()`/`import` directives inside inline styles (a known exfiltration vector) are not stripped client-side.

**Client-side sanitization is for display only.** Always run a server-side HTML sanitizer (e.g. HTMLPurifier) before storing or rendering editor output — including `style=""` attribute-level CSS filtering, which is the server-side sanitizer's responsibility.
