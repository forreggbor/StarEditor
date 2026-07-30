# Image Wrap Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Left/Center/Right/None alignment buttons to the existing per-image floating toolbar so an inserted image can float with text wrapping around it (left/right) or sit centered as a standalone block (center), with a way to clear it back to today's plain inline image (none).

**Architecture:** 4 new SunEditor icons in the existing `StarEditor.icons` registry; 4 new buttons in the existing `showImageToolbar()` template (same `data-action` delegated-click pattern the toolbar already uses for `edit-alt`/`resize-50`/`resize-100`/`delete`); 4 new `case` branches in the existing `handleImageAction()` switch that set inline `float`/`display`/`clear`/`margin` styles directly on the selected `<img>` — the exact same "just set `img.style.*`" pattern the existing resize-50/resize-100 cases already use. No new CSS class, no wrapper element. Text reflow around a floated image is native browser layout — nothing to build for it. A new small helper toggles the existing `-btn-active` class among the 4 alignment buttons based on the image's current inline style.

**Tech Stack:** Vanilla JS (single file, no build tooling beyond `terser` for the dist minified build), no test framework in this repo. jsdom (ad hoc scratchpad scripts, not committed) can verify DOM structure and pure logic, but **cannot** verify real float/text-wrap layout or `execCommand` — those steps require a manual pass in a real browser via `0_test/test.html`.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-30-image-wrap-alignment-design.md` — follow it exactly.
- Margin is fixed at `12px`, not configurable.
- Center alignment is block-level with no text wrap (confirmed with Gábor) — not a two-sided float.
- No self-toggle-off on the 3 alignment buttons — only the explicit `None` button clears alignment (confirmed with Gábor).
- No new CSS class added to `static styles` — alignment is inline styles on the `<img>` only, for portability outside the editor.
- `.star-image-toolbar` must keep its current no-width-constraint layout (`display:flex`, default `nowrap`, no explicit `width`) so all 8 buttons always render in one row regardless of the image's resized width — do not add any width/wrap CSS to it.
- Version bump is minor: 3.1.0 → 3.2.0 (new functionality), per CLAUDE.md versioning rules.
- Never commit/push without Gábor's explicit request beyond this session's normal confirm-first convention — each task's commit step stages the work; treat `git commit` itself as expected in this actively-driven session, but never `git push`.

---

### Task 1: Icon registry, translations, toolbar buttons, active-state helper

**Files:**
- Modify: `StarEditor.js:400` (`static icons` — insert 4 new entries after `delete:`)
- Modify: `StarEditor.js:167-170` (en `imageToolbar.*` translations)
- Modify: `StarEditor.js:297-300` (hu `imageToolbar.*` translations)
- Modify: `StarEditor.js:3390-3417` (`showImageToolbar()` — add 4 buttons + call new helper)
- Modify: `StarEditor.js` (new method `updateImageAlignButtons(img)`, placed directly after `showImageToolbar()`)

**Interfaces:**
- Produces: `StarEditor.icons.format_float_left` / `format_float_center` / `format_float_right` / `format_float_none` (SVG strings). `showImageToolbar()` renders 8 buttons total, the 4 new ones with `data-action="align-left"` / `"align-center"` / `"align-right"` / `"align-none"`. New method `updateImageAlignButtons(img)` — no return value, toggles `${prefix}-btn-active` on whichever of the 4 alignment buttons matches `img`'s current inline style.
- Consumes: nothing new from other tasks (this task is foundational). Task 2 will call `updateImageAlignButtons()` after applying a new alignment.

- [ ] **Step 1: Add the 4 new icons to `static icons`**

In `StarEditor.js`, in the `static icons = { ... }` block, insert immediately before the closing `};` (currently line 401), right after the `delete:` entry (currently line 400 — note it has no trailing comma since it's currently the last entry; add one):

```javascript
        delete: '<svg class="se-ci" viewBox="0 0 15.73 15.74"><g><path d="M19.16,6.71a.94.94,0,0,0,.69-.28.91.91,0,0,0,.29-.68A1,1,0,0,0,19.85,5a.93.93,0,0,0-.69-.3H14.24A.94.94,0,0,0,14,4.06a.92.92,0,0,0-.7-.3h-2a1,1,0,0,0-.7.3.93.93,0,0,0-.28.68H5.39A.92.92,0,0,0,4.7,5a1,1,0,0,0-.29.71.91.91,0,0,0,.29.68,1,1,0,0,0,.69.28H19.16Zm-12.79,1a1,1,0,0,0-.7.3.94.94,0,0,0-.28.69v8.85A1.88,1.88,0,0,0,6,18.93a1.9,1.9,0,0,0,1.39.57H17.2a1.87,1.87,0,0,0,1.39-.58,1.91,1.91,0,0,0,.58-1.39V8.68A1,1,0,0,0,18.88,8a.89.89,0,0,0-.7-.29,1,1,0,0,0-.69.29.92.92,0,0,0-.29.68v7.87a1,1,0,0,1-1,1H8.34a.94.94,0,0,1-.69-.28,1,1,0,0,1-.29-.71V8.68a1,1,0,0,0-1-1Z" transform="translate(-4.41 -3.76)"/></g></svg>',
        format_float_left: '<svg viewBox="0 0 24 24"><path d="M3,7H9V13H3V7M3,3H21V5H3V3M21,7V9H11V7H21M21,11V13H11V11H21M3,15H17V17H3V15M3,19H21V21H3V19Z" /></svg>',
        format_float_center: '<svg viewBox="0 0 24 24"><path d="M9,7H15V13H9V7M3,3H21V5H3V3M3,15H21V17H3V15M3,19H17V21H3V19Z" /></svg>',
        format_float_right: '<svg viewBox="0 0 24 24"><path d="M15,7H21V13H15V7M3,3H21V5H3V3M13,7V9H3V7H13M9,11V13H3V11H9M3,15H17V17H3V15M3,19H21V21H3V19Z" /></svg>',
        format_float_none: '<svg viewBox="0 0 24 24"><path d="M3,7H9V13H3V7M3,3H21V5H3V3M21,11V13H11V11H21M3,15H17V17H3V15M3,19H21V21H3V19Z" /></svg>'
```

(These 4 SVGs are sourced from SunEditor's `defaultIcons.js`, same MIT-attributed source as the rest of `StarEditor.icons` — no new attribution comment needed, the existing one above `static icons` already covers the whole registry.)

- [ ] **Step 2: Add English translation keys**

In the `en` block, immediately after `'imageToolbar.editAlt': 'Edit alt text',` (currently line 167):

```javascript
            'imageToolbar.alignLeft': 'Align left, wrap text',
            'imageToolbar.alignCenter': 'Center, no wrap',
            'imageToolbar.alignRight': 'Align right, wrap text',
            'imageToolbar.alignNone': 'Remove alignment',
```

- [ ] **Step 3: Add Hungarian translation keys**

In the `hu` block, immediately after `'imageToolbar.editAlt': 'Alt szöveg szerkesztése',` (currently line 297):

```javascript
            'imageToolbar.alignLeft': 'Balra, szöveg körbefutással',
            'imageToolbar.alignCenter': 'Középre, körbefutás nélkül',
            'imageToolbar.alignRight': 'Jobbra, szöveg körbefutással',
            'imageToolbar.alignNone': 'Igazítás eltávolítása',
```

- [ ] **Step 4: Add the 4 buttons to `showImageToolbar()` and call the new helper**

Replace the whole method body (currently lines 3390-3417):

```javascript
    showImageToolbar(img) {
        const prefix = this.config.classPrefix;

        this.imageToolbar = document.createElement('div');
        this.imageToolbar.className = `${prefix}-image-toolbar`;
        this.imageToolbar.innerHTML = `
            <button type="button" class="${prefix}-image-toolbar-btn" data-action="edit-alt" title="${this.t('imageToolbar.editAlt')}">Alt</button>
            <button type="button" class="${prefix}-image-toolbar-btn" data-action="resize-50" title="${this.t('imageToolbar.resize50')}">50%</button>
            <button type="button" class="${prefix}-image-toolbar-btn" data-action="resize-100" title="${this.t('imageToolbar.resize100')}">100%</button>
            <button type="button" class="${prefix}-image-toolbar-btn" data-action="delete" title="${this.t('imageToolbar.delete')}">${StarEditor.icons.delete}</button>
        `;

        // Position toolbar above the image
        this.wrapper.appendChild(this.imageToolbar);
        this.updateToolbarPosition(img);

        // Handle toolbar button clicks
        this.imageToolbar.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;

            e.preventDefault();
            e.stopPropagation();

            const action = btn.dataset.action;
            this.handleImageAction(action);
        });
    }
```

with:

```javascript
    showImageToolbar(img) {
        const prefix = this.config.classPrefix;

        this.imageToolbar = document.createElement('div');
        this.imageToolbar.className = `${prefix}-image-toolbar`;
        this.imageToolbar.innerHTML = `
            <button type="button" class="${prefix}-image-toolbar-btn" data-action="edit-alt" title="${this.t('imageToolbar.editAlt')}">Alt</button>
            <button type="button" class="${prefix}-image-toolbar-btn" data-action="align-left" title="${this.t('imageToolbar.alignLeft')}">${StarEditor.icons.format_float_left}</button>
            <button type="button" class="${prefix}-image-toolbar-btn" data-action="align-center" title="${this.t('imageToolbar.alignCenter')}">${StarEditor.icons.format_float_center}</button>
            <button type="button" class="${prefix}-image-toolbar-btn" data-action="align-right" title="${this.t('imageToolbar.alignRight')}">${StarEditor.icons.format_float_right}</button>
            <button type="button" class="${prefix}-image-toolbar-btn" data-action="align-none" title="${this.t('imageToolbar.alignNone')}">${StarEditor.icons.format_float_none}</button>
            <button type="button" class="${prefix}-image-toolbar-btn" data-action="resize-50" title="${this.t('imageToolbar.resize50')}">50%</button>
            <button type="button" class="${prefix}-image-toolbar-btn" data-action="resize-100" title="${this.t('imageToolbar.resize100')}">100%</button>
            <button type="button" class="${prefix}-image-toolbar-btn" data-action="delete" title="${this.t('imageToolbar.delete')}">${StarEditor.icons.delete}</button>
        `;

        // Position toolbar above the image
        this.wrapper.appendChild(this.imageToolbar);
        this.updateToolbarPosition(img);
        this.updateImageAlignButtons(img);

        // Handle toolbar button clicks
        this.imageToolbar.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;

            e.preventDefault();
            e.stopPropagation();

            const action = btn.dataset.action;
            this.handleImageAction(action);
        });
    }

    /**
     * Highlight whichever image-toolbar alignment button matches the image's
     * current inline alignment style. Read directly from the inline style we
     * set ourselves (no getComputedStyle needed — nothing else sets these).
     *
     * @param {HTMLImageElement} img - The image element
     * @private
     */
    updateImageAlignButtons(img) {
        if (!this.imageToolbar) return;

        const activeClass = `${this.config.classPrefix}-btn-active`;
        let activeAction = 'align-none';
        if (img.style.float === 'left') {
            activeAction = 'align-left';
        } else if (img.style.float === 'right') {
            activeAction = 'align-right';
        } else if (img.style.display === 'block') {
            activeAction = 'align-center';
        }

        this.imageToolbar.querySelectorAll('[data-action^="align-"]').forEach(btn => {
            btn.classList.toggle(activeClass, btn.dataset.action === activeAction);
        });
    }
```

- [ ] **Step 5: Verify structure with jsdom (ad hoc script, not committed)**

This repo has no test framework — write a throwaway script in the scratchpad directory, not under version control. If `jsdom` isn't already installed there, run `npm install jsdom --no-save` in the scratchpad dir first.

```javascript
// scratchpad/verify-task1.js
const { JSDOM } = require('jsdom');
const fs = require('fs');

const dom = new JSDOM('<!doctype html><body><textarea id="t"></textarea></body>', { url: 'http://localhost/', pretendToBeVisual: true });
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.getComputedStyle = dom.window.getComputedStyle;
global.Node = dom.window.Node;
document.execCommand = () => true;
document.queryCommandState = () => false;
document.queryCommandValue = () => '';

const src = fs.readFileSync('/home/gabor/development/StarEditor/StarEditor.js', 'utf8');
const mod = { exports: {} };
new Function('module', 'exports', 'document', 'window', 'navigator', 'getComputedStyle', 'Node', src + '\nmodule.exports = StarEditor;')
    (mod, mod.exports, document, window, navigator, getComputedStyle, Node);
const StarEditor = mod.exports;

console.log('4 new icons present:', ['format_float_left', 'format_float_center', 'format_float_right', 'format_float_none'].every(k => typeof StarEditor.icons[k] === 'string'));

const editor = new StarEditor(document.getElementById('t'));
const img = document.createElement('img');
editor.editor.appendChild(img);
editor.selectImage(img);

const actions = [...editor.imageToolbar.querySelectorAll('[data-action]')].map(b => b.dataset.action);
console.log('button actions (expect 8, in order):', actions.join(','));

const activeClass = 'star-btn-active';
console.log('align-none active by default:', editor.imageToolbar.querySelector('[data-action="align-none"]').classList.contains(activeClass));

img.style.float = 'left';
editor.updateImageAlignButtons(img);
console.log('align-left active after float:left:', editor.imageToolbar.querySelector('[data-action="align-left"]').classList.contains(activeClass));
console.log('align-none NOT active after float:left:', !editor.imageToolbar.querySelector('[data-action="align-none"]').classList.contains(activeClass));

img.style.float = '';
img.style.display = 'block';
editor.updateImageAlignButtons(img);
console.log('align-center active after display:block:', editor.imageToolbar.querySelector('[data-action="align-center"]').classList.contains(activeClass));
```

Run: `node scratchpad/verify-task1.js`
Expected output: all lines print `true`; button actions line is `edit-alt,align-left,align-center,align-right,align-none,resize-50,resize-100,delete`.

- [ ] **Step 6: Commit**

```bash
git add StarEditor.js
git commit -m "feat(editor): add image alignment icons and toolbar buttons"
```

---

### Task 2: Apply/clear alignment styles on click

**Files:**
- Modify: `StarEditor.js:3574-3601` (`handleImageAction()`)

**Interfaces:**
- Consumes: `StarEditor.updateImageAlignButtons(img)` from Task 1.
- Produces: clicking `align-left` / `align-center` / `align-right` / `align-none` sets/clears `img.style.float`, `img.style.display`, `img.style.clear`, `img.style.margin` per the spec's exact values, repositions the resizer/toolbar overlays, and refreshes the active-button highlight.

- [ ] **Step 1: Add the 4 new `case` branches to `handleImageAction()`**

Replace the whole method body (currently lines 3574-3601):

```javascript
    handleImageAction(action) {
        if (!this.selectedImage) return;

        const img = this.selectedImage;

        switch (action) {
            case 'edit-alt':
                this.editImageAlt(img);
                break;
            case 'resize-50':
                img.style.width = '50%';
                img.style.height = 'auto';
                this.updateResizerPosition(img);
                this.updateToolbarPosition(img);
                this.sync();
                break;
            case 'resize-100':
                img.style.width = '';
                img.style.height = '';
                this.updateResizerPosition(img);
                this.updateToolbarPosition(img);
                this.sync();
                break;
            case 'delete':
                this.deleteImage(img);
                break;
        }
    }
```

with:

```javascript
    handleImageAction(action) {
        if (!this.selectedImage) return;

        const img = this.selectedImage;

        switch (action) {
            case 'edit-alt':
                this.editImageAlt(img);
                break;
            case 'align-left':
                img.style.float = 'left';
                img.style.display = '';
                img.style.clear = '';
                img.style.margin = '12px 12px 12px 0';
                this.updateResizerPosition(img);
                this.updateToolbarPosition(img);
                this.updateImageAlignButtons(img);
                this.sync();
                break;
            case 'align-center':
                img.style.float = '';
                img.style.display = 'block';
                img.style.clear = 'both';
                img.style.margin = '12px auto';
                this.updateResizerPosition(img);
                this.updateToolbarPosition(img);
                this.updateImageAlignButtons(img);
                this.sync();
                break;
            case 'align-right':
                img.style.float = 'right';
                img.style.display = '';
                img.style.clear = '';
                img.style.margin = '12px 0 12px 12px';
                this.updateResizerPosition(img);
                this.updateToolbarPosition(img);
                this.updateImageAlignButtons(img);
                this.sync();
                break;
            case 'align-none':
                img.style.float = '';
                img.style.display = '';
                img.style.clear = '';
                img.style.margin = '';
                this.updateResizerPosition(img);
                this.updateToolbarPosition(img);
                this.updateImageAlignButtons(img);
                this.sync();
                break;
            case 'resize-50':
                img.style.width = '50%';
                img.style.height = 'auto';
                this.updateResizerPosition(img);
                this.updateToolbarPosition(img);
                this.sync();
                break;
            case 'resize-100':
                img.style.width = '';
                img.style.height = '';
                this.updateResizerPosition(img);
                this.updateToolbarPosition(img);
                this.sync();
                break;
            case 'delete':
                this.deleteImage(img);
                break;
        }
    }
```

- [ ] **Step 2: Verify style application with jsdom (structure only — no real layout)**

jsdom doesn't lay out `float`/`display`, but it does store and echo back inline style properties, so the state-machine logic itself (which properties get set/cleared per action, and that the active button updates) is verifiable without a real browser:

```javascript
// scratchpad/verify-task2.js
const { JSDOM } = require('jsdom');
const fs = require('fs');

const dom = new JSDOM('<!doctype html><body><textarea id="t"></textarea></body>', { url: 'http://localhost/', pretendToBeVisual: true });
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.getComputedStyle = dom.window.getComputedStyle;
global.Node = dom.window.Node;
document.execCommand = () => true;
document.queryCommandState = () => false;
document.queryCommandValue = () => '';

const src = fs.readFileSync('/home/gabor/development/StarEditor/StarEditor.js', 'utf8');
const mod = { exports: {} };
new Function('module', 'exports', 'document', 'window', 'navigator', 'getComputedStyle', 'Node', src + '\nmodule.exports = StarEditor;')
    (mod, mod.exports, document, window, navigator, getComputedStyle, Node);
const StarEditor = mod.exports;

const editor = new StarEditor(document.getElementById('t'));
const img = document.createElement('img');
editor.editor.appendChild(img);
editor.selectImage(img);

editor.handleImageAction('align-left');
console.log('left: float/display/clear/margin:', img.style.float, '|', img.style.display, '|', img.style.clear, '|', img.style.margin);

editor.handleImageAction('align-center');
console.log('center: float/display/clear/margin:', img.style.float, '|', img.style.display, '|', img.style.clear, '|', img.style.margin);

editor.handleImageAction('align-right');
console.log('right: float/display/clear/margin:', img.style.float, '|', img.style.display, '|', img.style.clear, '|', img.style.margin);

editor.handleImageAction('align-none');
console.log('none: float/display/clear/margin (expect all empty):', JSON.stringify(img.style.float), JSON.stringify(img.style.display), JSON.stringify(img.style.clear), JSON.stringify(img.style.margin));
console.log('align-none button active after clearing:', editor.imageToolbar.querySelector('[data-action="align-none"]').classList.contains('star-btn-active'));

// resize-50/100 unaffected by the new cases (regression check)
editor.handleImageAction('resize-50');
console.log('resize-50 still sets width:', img.style.width);
editor.handleImageAction('resize-100');
console.log('resize-100 still clears width (expect empty):', JSON.stringify(img.style.width));
```

Run: `node scratchpad/verify-task2.js`
Expected: left → `left |  |  | 12px 12px 12px 0px`; center → ` | block | both | 12px auto`; right → `right |  |  | 12px 0px 12px 12px`; none → all 4 empty strings, `align-none` active is `true`; `resize-50`/`resize-100` lines unchanged from before this task. (Note: the browser's CSSOM normalizes a bare `0` to `0px` when the shorthand `margin` is read back via `img.style.margin` — this is expected, not a bug; verified live against jsdom during plan authoring.)

- [ ] **Step 3: Manual browser verification (jsdom has no real CSS layout)**

Serve the repo root (`python3 -m http.server 8791` from the repo root, or reuse whatever port is already free) and open `http://localhost:8791/0_test/test.html` via chrome-devtools MCP (or manually if the MCP browser is busy with another session — check `pgrep -af chrome-profile` first, see the icon-set task's session history for the exact recovery steps if the profile lock is stale).

- Insert an image next to a paragraph of several sentences of text. Select it, click **Left**. Expected: image floats left, text wraps down its right side, margin visible on top/right/bottom, none on the left edge.
- Click **Right**. Expected: image jumps to float right, text wraps its left side, margin on top/left/bottom, none on the right edge.
- Click **Center**. Expected: image becomes its own centered block, text above/below only (no wrap on either side), margin above/below.
- Click **None**. Expected: back to today's plain inline image with no wrap.
- With the image floated **Left**, drag a resize handle to shrink it. Expected: the wrapped text reflows to follow the new, smaller box in real time as you drag — no jump/lag, no manual refresh needed. The floating toolbar and resize handles stay correctly positioned on the image throughout the drag (regression check against the existing resizer code, now running against a floated element for the first time).
- With the image floated, resize it very small (well under the 8-button toolbar's natural width) — confirm the floating toolbar still shows all 8 buttons in one row, not clipped or wrapped, and is not visually constrained to the image's own (now much smaller) width.
- Click through Left → Center → Right → None → Left again, confirming the active-button highlight always matches the current state and never shows two buttons (or zero, once an alignment is set) highlighted at once.
- Switch to code view and back — confirm the inline `style` attribute round-trips correctly (still shows the float/margin values after toggling views).

Expected: all of the above behave as described; no console errors.

- [ ] **Step 4: Commit**

```bash
git add StarEditor.js
git commit -m "feat(editor): apply image wrap alignment on toolbar click"
```

---

### Task 3: Documentation

**Files:**
- Modify: `doc/IMAGES-AND-GALLERIES.md` (new `## Image toolbar` section + table-of-contents entry)

**Interfaces:**
- Consumes: nothing new (documents behavior from Tasks 1-2).
- Produces: a documented reference for the per-image floating toolbar's 8 buttons — previously undocumented entirely, not just the 4 new ones.

- [ ] **Step 1: Add a table-of-contents entry**

The TOC list (currently lines 5-11) doesn't list the existing "Image modal — tab behaviour" section either — it only starts from "Server image gallery" onward. Insert the new bullet as the new first entry, immediately before `- [Server image gallery](#server-image-gallery) (`serverImages`, `serverImagesPageSize`)` (currently line 5):

```markdown
- [Image toolbar](#image-toolbar) — align, resize, alt text, delete
```

- [ ] **Step 2: Add the new section**

Insert immediately after the `## Image modal — tab behaviour` section's closing `---` (currently line 31), before `## Server image gallery` (currently line 33):

```markdown
## Image toolbar

Clicking an inserted image selects it and shows a small floating toolbar above it, with 8 actions:

| Button | Action |
|--------|--------|
| `Alt` | Edit the image's alt text |
| Align left | Float the image left; surrounding text wraps around its right side |
| Align center | Center the image as its own block; no text wrap (a browser cannot wrap text on both sides of one floated element, so centering is block-level, same as every other rich text editor) |
| Align right | Float the image right; surrounding text wraps around its left side |
| Remove alignment | Clear alignment, back to a plain inline image |
| `50%` | Resize to 50% width |
| `100%` | Resize to original width |
| Delete | Remove the image |

Alignment is applied as inline `style` on the `<img>` itself (`float`/`display`/`clear`/`margin`, `12px` spacing) — no separate CSS class, so it renders correctly wherever the saved HTML ends up, even outside a page that loads StarEditor's own stylesheet.

The image can also be resized by dragging its corner handles while selected; this works identically whether or not the image is aligned — a floated image's surrounding text reflows continuously as you drag, same as an unaligned one's box just changes size.

---
```

- [ ] **Step 3: Commit**

```bash
git add doc/IMAGES-AND-GALLERIES.md
git commit -m "docs(editor): document the image toolbar, including wrap alignment"
```

---

### Task 4: Release finalize

**Files:**
- Modify: `StarEditor.js:8` (`@version` header)
- Modify: `CHANGELOG.md` (new `[3.2.0]` section)
- Regenerate: `dist/StarEditor.min.js`

**Interfaces:**
- Consumes: everything from Tasks 1-3.
- Produces: a shippable 3.2.0 release, dist rebuilt and verified in sync.

- [ ] **Step 1: Bump the version header**

In `StarEditor.js`, change:

```javascript
 * @version 3.1.0
```
to:
```javascript
 * @version 3.2.0
```

- [ ] **Step 2: Add the CHANGELOG entry**

Insert a new section above the current top `## [3.1.0] - 2026-07-30` entry. Compute the table's column padding from the actual longest cell in this block — do not copy widths from a different version's table.

```markdown
## [3.2.0] - 2026-07-30

### Summary

| Category | Description                                                         |
|----------|----------------------------------------------------------------------|
| Added    | Images can now be aligned left/center/right with text wrapping       |

### Added
- Inserted images can now be aligned left, center, or right from the image toolbar. Left and right wrap the surrounding paragraph text around the image; center displays it as its own centered block. A fourth button removes the alignment.
```

- [ ] **Step 3: Regenerate the minified build**

Run: `terser StarEditor.js --compress --mangle --comments "/@license/" -o dist/StarEditor.min.js`
Expected: command exits 0; `grep -c "@version 3.2.0" dist/StarEditor.min.js` returns `1`.

- [ ] **Step 4: Full manual acceptance pass in the browser**

Using the same `test.html` session as Task 2 Step 3:
- Re-run the Task 2 Step 3 checklist once more end-to-end against the freshly rebuilt state, to catch anything a partial per-task check might have missed.
- Point `test.html` at `dist/StarEditor.min.js` instead of `StarEditor.js` (temporarily edit the `<script src>` in a local copy or via dev tools) and repeat the align-left/center/right/none + resize-while-wrapped check once against the minified build specifically — minification must not have altered behavior.
- Confirm the main toolbar and all previously-existing features (bold/italic/tables/etc.) still work — quick regression sanity check, not a full re-test of unrelated prior work.

- [ ] **Step 5: Commit**

```bash
git add StarEditor.js CHANGELOG.md dist/StarEditor.min.js
git commit -m "chore(editor): bump to 3.2.0 for image wrap alignment"
```

---

## Self-Review Notes

- **Spec coverage:** mechanism/inline-styles (Task 1-2), states/margins (Task 2), toolbar UI + active-state (Task 1), resize interaction — verified not requiring new code (Task 2 manual pass), scope/all-sources (inherent — alignment applies to `this.selectedImage` regardless of how it was inserted, no source-specific code exists to touch), documentation (Task 3), versioning (Task 4). Every spec section has a task.
- **Placeholder scan:** no TBD/TODO; every step has literal code, an exact literal command, or a concrete manual-check script.
- **Type consistency:** `data-action` values (`align-left`/`align-center`/`align-right`/`align-none`), the `updateImageAlignButtons(img)` method name and signature, and the `${prefix}-btn-active` class name are used identically across Tasks 1 and 2.
- **Scope:** single subsystem (the per-image floating toolbar), no decomposition needed.
- **Live dry-run:** Tasks 1-2's exact code (icons, translations, `showImageToolbar()`, `updateImageAlignButtons()`, `handleImageAction()`) was applied to a scratch copy of `StarEditor.js` and both verification scripts were actually executed against it (not just asserted) before finalizing this plan. Two real issues surfaced and were fixed in-place: (1) the Task 2 verify script's expected margin string didn't account for the browser/jsdom CSSOM normalizing a bare `0` to `0px` on readback — expected values corrected; (2) Task 3 Step 1 referenced a TOC bullet (`Image modal — tab behaviour`) that doesn't actually exist in the current TOC list — instruction corrected to insert before the real first bullet instead.
