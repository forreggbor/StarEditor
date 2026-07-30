# Configuration

- [Options](#options)
- [Toolbar](#toolbar)
- [Styling](#styling)
- [Localization](#localization)
- [Examples](#examples)

---

## Options

```javascript
const editor = new StarEditor(document.getElementById('content'), {
    placeholder: 'Start typing...',
    pasteAsPlainText: false,
    minHeight: '200px',
    maxHeight: '500px',
    shortcuts: true,
    classPrefix: 'star',
    linkTargetBlank: true,
    fontSizes: ['12px', '14px', '16px', '18px', '20px', '24px', '32px', '48px'],
    fontFamilies: [
        { label: 'Arial',            value: 'Arial, sans-serif' },
        { label: 'Times New Roman',  value: '"Times New Roman", serif' },
        { label: 'Georgia',          value: 'Georgia, serif' }
    ],
    colorPalette: ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00'],
    tableDefaults: { rows: 3, cols: 3 },
    imageUpload: true,
    maxImageSize: 5242880,
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    serverImages: null,
    serverImagesPageSize: 16,
    serverGalleries: null,
    serverGalleriesPageSize: 12,
    locale: 'auto',
    onChange: function(html) { /* … */ },
    onFocus: function() { /* … */ },
    onBlur: function() { /* … */ },
    onImageUpload: function(file, alt, done) { done('/uploads/image.jpg'); },
    onImageInsert: function({ url, alt, source, serverItem }) { /* … */ },
    onGalleryInsert: function({ gallery, source }) { /* … */ },
    onContentIn: function(html) { return html; },
    onContentOut: function(html) { return html; }
});
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `placeholder` | String | `''` | Placeholder text when editor is empty |
| `pasteAsPlainText` | Boolean | `false` | Strip formatting when pasting |
| `minHeight` | String | `'200px'` | Minimum editor height |
| `maxHeight` | String | `null` | Maximum editor height (`null` for unlimited) |
| `shortcuts` | Boolean | `true` | Enable keyboard shortcuts |
| `classPrefix` | String | `'star'` | CSS class prefix for all editor elements |
| `linkTargetBlank` | Boolean | `true` | Add `target="_blank"` to inserted links |
| `fontSizes` | Array | `['12px', '14px', ...]` | Available font sizes for the dropdown |
| `fontFamilies` | Array | See above | Available fonts as `[{label, value}]` |
| `colorPalette` | Array | 24 colors | Hex colors for the color pickers |
| `tableDefaults` | Object | `{rows: 3, cols: 3}` | Default table dimensions |
| `imageUpload` | Boolean | `true` | Enable local file upload (base64) |
| `maxImageSize` | Number | `5242880` | Max upload size in bytes (5 MB) |
| `allowedImageTypes` | Array | `['image/jpeg', ...]` | Allowed MIME types for upload |
| `serverImages` | String\|Array\|null | `null` | Server image gallery. String: URL endpoint. Array: pre-built list. See [Images & Galleries](IMAGES-AND-GALLERIES.md). |
| `serverImagesPageSize` | Number | `16` | Images per page in the server gallery |
| `serverGalleries` | String\|Array\|null | `null` | Gallery picker. String: URL endpoint. Array: pre-built list. See [Images & Galleries](IMAGES-AND-GALLERIES.md). |
| `serverGalleriesPageSize` | Number | `12` | Galleries per page in the picker |
| `locale` | String | `'auto'` | UI language: `'auto'`, `'en'`, or `'hu'` |
| `onChange` | Function | `null` | Called with the current HTML whenever content changes |
| `onFocus` | Function | `null` | Called when the editor gains focus |
| `onBlur` | Function | `null` | Called when the editor loses focus |
| `onImageUpload` | Function | `null` | Hook called when the user selects a file to upload. Receives `(file, alt, done)` — call `done(url, serverItem?)` to insert the image. Falls back to base64 when not set. |
| `onImageInsert` | Function | `null` | Hook called before every image insertion. See [Images & Galleries](IMAGES-AND-GALLERIES.md). |
| `onGalleryInsert` | Function | `null` | Hook called when the user picks a gallery. See [Images & Galleries](IMAGES-AND-GALLERIES.md). |
| `onContentIn` | Function | `null` | Transform applied on load: host storage → editor DOM. Register as a pair with `onContentOut`. |
| `onContentOut` | Function | `null` | Transform applied on save: editor DOM → host storage. Register as a pair with `onContentIn`. |

---

## Toolbar

The toolbar is fixed and always shown in full — every embedding gets the identical, complete set
of buttons, in this order:

| Button | Description |
|--------|-------------|
| `bold` | Bold text |
| `italic` | Italic text |
| `underline` | Underlined text |
| `strikethrough` | Strikethrough text |
| `subscript` | Subscript text |
| `superscript` | Superscript text |
| `fontSize` | Font size dropdown |
| `fontName` | Font family dropdown |
| `textColor` | Text color picker |
| `bgColor` | Background/highlight color picker |
| `heading` | Heading level dropdown, containing H1–H6 |
| `blockquote` | Block quote |
| `pre` | Preformatted code block |
| `ul` | Unordered (bullet) list |
| `ol` | Ordered (numbered) list |
| `link` | Insert hyperlink |
| `unlink` | Remove hyperlink |
| `alignment` | Text alignment dropdown, containing left/center/right/justify |
| `indent` | Increase indentation |
| `outdent` | Decrease indentation |
| `hr` | Horizontal rule |
| `table` | Insert table |
| `image` | Insert image |
| `gallery` | Open gallery picker — shown only when `serverGalleries` is configured |
| `undo` | Undo last action |
| `redo` | Redo last action |
| `clearFormat` | Remove all formatting |
| `codeView` | Toggle HTML source view |

The toolbar can no longer be customized from the host — there is no `toolbar` option. See
[archive/toolbar-customization](../archive/toolbar-customization/README.md) for the removed
per-host configuration this replaced.

---

## Styling

The editor injects its own CSS — no separate stylesheet is needed. To override styles, target the class prefix:

```css
.star-wrapper  { border-color: #007bff; }
.star-toolbar  { background: #f8f9fa; }
.star-editor   { font-family: Georgia, serif; }
```

To use a custom prefix and avoid conflicts with other elements:

```javascript
new StarEditor('#content', { classPrefix: 'my-editor' });
```

Then style `.my-editor-wrapper`, `.my-editor-toolbar`, `.my-editor-editor`, etc.

---

## Localization

| Locale | Language |
|--------|----------|
| `'auto'` | Auto-detect from browser language (default) |
| `'en'` | English |
| `'hu'` | Hungarian |

All tooltips, modal labels, button texts, prompts, and error messages are translated.

---

## Examples

### Multiple editors

```javascript
const editors = StarEditor.init('.star-textarea', {
    minHeight: '150px'
});
```

### onChange callback

```javascript
new StarEditor('#content', {
    onChange: function(html) {
        document.getElementById('preview').innerHTML = html;
        document.getElementById('char-count').textContent = html.length;
    }
});
```

### Paste as plain text

```javascript
new StarEditor('#content', { pasteAsPlainText: true });
```

### Custom height

```javascript
new StarEditor('#content', {
    minHeight: '300px',
    maxHeight: '600px'
});
```

### Hungarian locale

```javascript
new StarEditor('#content', { locale: 'hu' });
```

### Destroy and restore

```javascript
const editor = new StarEditor('#content');
// Restore the original textarea
editor.destroy();
```
