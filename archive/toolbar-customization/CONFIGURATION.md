# Archive: removed sections of `doc/CONFIGURATION.md`

Verbatim copy of the toolbar-customization documentation removed from `doc/CONFIGURATION.md` in
v3.0.0. Preserved for historical reference only — none of this reflects current behavior.

## Options sample (removed line)

```javascript
const editor = new StarEditor(document.getElementById('content'), {
    toolbar: ['bold', 'italic', '|', 'link', 'image', '|', 'codeView'],
    // ...other options unaffected...
});
```

## Options table (removed row)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `toolbar` | Array | See [Default toolbar](#default-toolbar) | Toolbar buttons to display |

## `## Toolbar` section (removed in full)

### Default toolbar

```javascript
[
    'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', '|',
    'fontSize', 'fontName', '|',
    'textColor', 'bgColor', '|',
    'heading', '|',
    'ul', 'ol', 'blockquote', 'pre', '|',
    'link', 'unlink', '|',
    'alignment', '|',
    'indent', 'outdent', '|',
    'hr', 'table', 'image', '|',
    'undo', 'redo', '|',
    'clearFormat', 'codeView'
]
```

Use `'all'` as a shorthand to include every button in the default order.

### Available buttons

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
| `heading` | Heading level dropdown (H1–H6) — shown by default instead of 6 separate buttons |
| `h1` – `h6` | Individual heading levels 1–6 (for a custom toolbar not using the `heading` dropdown) |
| `blockquote` | Block quote |
| `pre` | Preformatted code block |
| `ul` | Unordered (bullet) list |
| `ol` | Ordered (numbered) list |
| `hr` | Horizontal rule |
| `link` | Insert hyperlink |
| `unlink` | Remove hyperlink |
| `alignment` | Text alignment dropdown (left/center/right/justify) — shown by default instead of 4 separate buttons |
| `alignLeft` | Align text left (for a custom toolbar not using the `alignment` dropdown) |
| `alignCenter` | Align text center |
| `alignRight` | Align text right |
| `justifyFull` | Justify text |
| `indent` | Increase indentation |
| `outdent` | Decrease indentation |
| `table` | Insert table |
| `image` | Insert image |
| `gallery` | Open gallery picker (requires `serverGalleries`) |
| `undo` | Undo last action |
| `redo` | Redo last action |
| `clearFormat` | Remove all formatting |
| `codeView` | Toggle HTML source view |
| `all` | Include all buttons (shorthand) |
| `\|` | Separator (vertical line) |

## Examples (removed)

### All buttons

```javascript
new StarEditor('#content', {
    toolbar: ['all']
});
```

### Minimal toolbar

```javascript
new StarEditor('#content', {
    toolbar: ['bold', 'italic', '|', 'link']
});
```
