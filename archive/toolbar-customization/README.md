# Archive: host-side toolbar customization

**Removed in:** v3.0.0 (2026-07-30)
**Last shipped in:** v2.9.0
**Reason:** [PatrikMol/StarEditor#5](https://gitea.patrikmol.com/PatrikMol/StarEditor/issues/5) —
the toolbar is now always complete, showing every feature, regardless of the embedding host. Prior
to this change, hosts could pass a `toolbar: [...]` option to `new StarEditor(el, options)` to pick
which buttons/groups appeared and in what order. This let every embedding (JupitERP, TrafficJournal,
UniCMS, LicenseManager, ...) ship a different, potentially incomplete editor, and typos in a button
name were silently dropped with no warning. The `'all'` shorthand was also broken: it replaced the
array with `StarEditor.defaults.toolbar`, which never included the `gallery` button — so `'all'`
never actually meant "all".

This folder preserves the removed code and documentation verbatim, for historical reference only.
None of it is loaded or executed by the current editor.

## Removed code (from `StarEditor.js`, v2.9.0)

### 1. `toolbar` key in `static defaults` (lines 23-35)

```javascript
    static defaults = {
        toolbar: [
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
        ],
        // ...other defaults unaffected...
    };
```

### 2. The `'all'` shorthand resolution (constructor, lines 1094-1097)

```javascript
        // Resolve 'all' shorthand in toolbar to include all available buttons
        if (this.config.toolbar.includes('all')) {
            this.config.toolbar = [...StarEditor.defaults.toolbar];
        }
```

Note the bug: this copies `defaults.toolbar`, which never contained `gallery` — so
`toolbar: ['all']` could never produce the gallery button.

### 3. Config-driven iteration in `buildToolbar()` (lines 1177-1219, relevant excerpt)

```javascript
    buildToolbar() {
        this.toolbar = document.createElement('div');
        this.toolbar.className = `${this.config.classPrefix}-toolbar`;

        this.config.toolbar.forEach(item => {
            const def = StarEditor.toolbarButtons[item];
            if (!def) return; // unknown button names were silently dropped, no warning

            // ...separator / dropdown / colorPicker / plain-button branches...
        });

        this.wrapper.appendChild(this.toolbar);
    }
```

Replaced in v3.0.0 by iterating a fixed `static toolbarLayout` array instead of
`this.config.toolbar`. The `static toolbarButtons` registry itself (button definitions, icons,
commands, `groupItems`) was **not** removed — it still backs the fixed toolbar.

## Removed documentation

See `CONFIGURATION.md` in this folder for the verbatim removed sections of
`doc/CONFIGURATION.md` (the `toolbar` option row, the whole "Toolbar" reference section, and the
"All buttons" / "Minimal toolbar" examples).

### `doc/IMAGES-AND-GALLERIES.md` — gallery picker example (pre-v3.0.0)

Before v3.0.0, enabling the gallery picker required adding `'gallery'` to a custom `toolbar` array:

```javascript
new StarEditor('#content', {
    toolbar: ['bold', 'italic', '|', 'image', 'gallery', '|', 'codeView'],
    serverGalleries: '/admin/galleries/api',
    serverGalleriesPageSize: 12,
    onGalleryInsert: function({ gallery }) { /* ... */ }
});
```

From v3.0.0 on, the `gallery` button appears automatically whenever `serverGalleries` is set —
no `toolbar` option needed or accepted.

### `doc/IMAGES-AND-GALLERIES.md` — "Full CMS example" custom toolbar (pre-v3.0.0)

```javascript
toolbar: [
    'bold', 'italic', 'underline', 'strikethrough', '|',
    'h2', 'h3', 'h4', '|',
    'ul', 'ol', 'blockquote', '|',
    'link', 'unlink', 'image', 'gallery', '|',
    'alignLeft', 'alignCenter', 'alignRight', '|',
    'table', 'hr', '|',
    'undo', 'redo', '|',
    'clearFormat', 'codeView'
],
```

This example used the pre-2.9.0 flat heading/alignment buttons (`h2`, `h3`, `h4`, `alignLeft`,
`alignCenter`, `alignRight`) instead of the `heading`/`alignment` dropdowns, and omitted several
buttons (e.g. `subscript`, `superscript`, `fontSize`, `fontName`, `textColor`, `bgColor`,
`indent`, `outdent`, `codeView` duplication aside) that a real embedding could have been missing
entirely. This is exactly the kind of inconsistent-per-host editor that v3.0.0 eliminates.

### `README.md` (pre-v3.0.0)

- Features bullet: "Fully customizable toolbar" (line 11).

### `0_test/test.html` (untracked/gitignored, pre-v3.0.0)

Eight editors in the test page passed custom `toolbar` arrays to exercise different subsets:
minimal formatting, flat `h1`/`h2` backward-compat, `shortcuts:false` combos, and gallery-only
toolbars. Superseded in v3.0.0 by a single fixed toolbar shown on every editor instance (one
editor is kept passing a legacy `toolbar` array on purpose, as a regression case for the
deprecation warning).
