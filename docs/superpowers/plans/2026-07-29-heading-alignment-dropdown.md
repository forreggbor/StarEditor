# Heading & Alignment Dropdown Consolidation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Collapse the 6 heading buttons (`h1`-`h6`) and 4 alignment buttons (`alignLeft`/`alignCenter`/`alignRight`/`justifyFull`) in StarEditor's default toolbar into two single dropdown-trigger icons, reusing the existing `fontSize`/`fontName` dropdown mechanism.

**Architecture:** Add a `groupItems: string[]` field to two new composite `toolbarButtons` entries (`heading`, `alignment`) that reference the existing individual button keys. Generalize the three places that currently special-case `fontSize`/`fontName` (`createDropdownButton`, `handleDropdownSelect`, `updateToolbarState`) to also handle any `groupItems`-based entry generically, so no per-group code is duplicated. The individual entries stay untouched in `toolbarButtons` for backward compatibility with custom `toolbar` config arrays.

**Tech Stack:** Vanilla JS (single file, no build tooling beyond `terser` for the dist minified build), no test framework in this repo — verification is jsdom-based structural checks (run via plain `node`, ad hoc scripts, not a committed test suite) for pure-logic pieces, plus manual browser verification via `0_test/test.html` for interactive/execCommand-dependent behavior (jsdom does not implement real contenteditable/execCommand behavior).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-29-heading-alignment-dropdown-design.md` — follow it exactly; no other toolbar groups (subscript/superscript, ul/ol, indent/outdent) are touched.
- Backward compatible: existing individual keys (`h1`..`h6`, `alignLeft`..`justifyFull`) must keep working unchanged in a custom `toolbar` array.
- No new CSS layout — reuse `.star-dropdown` / `.star-dropdown-item` as-is.
- Version bump is minor: 2.8.1 → 2.9.0 (new functionality, not a bugfix), per CLAUDE.md versioning rules.
- Never commit/push without Gábor's explicit request — each task's commit step should be treated as staged-and-ready, actual `git commit` execution follows this session's normal confirm-first convention. (When executed inline in this same session, committing after each task is fine since the user is actively driving; a fresh subagent picking this up cold should still stage rather than assume push rights beyond `git commit`.)

---

### Task 1: Composite `toolbarButtons` entries + dropdown rendering

**Files:**
- Modify: `StarEditor.js:376` (insert 2 new entries into `static toolbarButtons`, before the `'|'` separator entry)
- Modify: `StarEditor.js:27` and `StarEditor.js:30` (`static defaults.toolbar` array)
- Modify: `StarEditor.js:1288-1307` (`createDropdownButton()` — generalize item population)

**Interfaces:**
- Produces: `StarEditor.toolbarButtons.heading = { icon, title, command: 'heading', custom: true, type: 'dropdown', groupItems: ['h1','h2','h3','h4','h5','h6'] }` and `StarEditor.toolbarButtons.alignment = { icon, title, command: 'alignment', custom: true, type: 'dropdown', groupItems: ['alignLeft','alignCenter','alignRight','justifyFull'] }`. `createDropdownButton(name, def)` renders one `.star-dropdown-item` per `groupItems` entry, `dataset.value` set to the referenced key (e.g. `'h2'`), content copied verbatim from that key's own `toolbarButtons` def (`icon` as `innerHTML`, `title` as `title` attribute).
- Consumes: nothing new from other tasks (this task is foundational).

- [ ] **Step 1: Add the two composite entries to `static toolbarButtons`**

In `StarEditor.js`, insert before the closing `'|': { type: 'separator' }` line (currently line 376):

```javascript
        heading: { icon: 'H<small>&#9662;</small>', title: 'Heading', command: 'heading', custom: true, type: 'dropdown', groupItems: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
        alignment: { icon: '&#8676;<small>&#9662;</small>', title: 'Alignment', command: 'alignment', custom: true, type: 'dropdown', groupItems: ['alignLeft', 'alignCenter', 'alignRight', 'justifyFull'] },
```

- [ ] **Step 2: Update the default toolbar array**

In `static defaults.toolbar` (currently lines 23-35), replace:

```javascript
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', '|',
```

with:

```javascript
            'heading', '|',
```

and replace:

```javascript
            'alignLeft', 'alignCenter', 'alignRight', 'justifyFull', '|',
```

with:

```javascript
            'alignment', '|',
```

- [ ] **Step 3: Generalize `createDropdownButton()`'s item population**

In `createDropdownButton(name, def)` (currently ~line 1270), the "Populate dropdown items based on button type" block currently only branches on `name === 'fontSize'` / `name === 'fontName'`. Add a third branch, checked first (order doesn't matter functionally since the names are mutually exclusive, but check `def.groupItems` before the `name === 'fontSize'` chain for readability):

```javascript
        // Populate dropdown items based on button type
        if (def.groupItems) {
            def.groupItems.forEach(key => {
                const itemDef = StarEditor.toolbarButtons[key];
                const item = document.createElement('div');
                item.className = `${prefix}-dropdown-item`;
                item.dataset.value = key;
                item.title = this.t('toolbar.' + key) || itemDef.title;
                item.innerHTML = itemDef.icon;
                dropdown.appendChild(item);
            });
        } else if (name === 'fontSize') {
            this.config.fontSizes.forEach(size => {
                const item = document.createElement('div');
                item.className = `${prefix}-dropdown-item`;
                item.dataset.value = size;
                item.textContent = size;
                item.style.fontSize = size;
                dropdown.appendChild(item);
            });
        } else if (name === 'fontName') {
            this.config.fontFamilies.forEach(font => {
                const item = document.createElement('div');
                item.className = `${prefix}-dropdown-item`;
                item.dataset.value = font.value;
                item.textContent = font.label;
                item.style.fontFamily = font.value;
                dropdown.appendChild(item);
            });
        }
```

- [ ] **Step 4: Verify structure with jsdom (ad hoc script, not committed)**

This repo has no test framework — write a throwaway script in the scratchpad directory, not under version control. If `jsdom` isn't already installed there, run `npm install jsdom --no-save` in the scratchpad dir first.

```javascript
// scratchpad/verify-task1.js
const { JSDOM } = require('jsdom');
const fs = require('fs');
const vm = require('vm');

const dom = new JSDOM(`<!doctype html><body><textarea id="t"></textarea></body>`, { runScripts: 'outside-only' });
// jsdom does not implement execCommand/queryCommand* at all (not "return false",
// literally undefined) — stub them so StarEditor's init() doesn't throw.
dom.window.document.execCommand = () => true;
dom.window.document.queryCommandValue = () => '';
dom.window.document.queryCommandState = () => false;

const src = fs.readFileSync('/home/gabor/development/StarEditor/StarEditor.js', 'utf8');
vm.runInContext(src, dom.getInternalVMContext());
const StarEditor = dom.window.eval('StarEditor');

const editor = new StarEditor(dom.window.document.getElementById('t'));

const headingTrigger = editor.toolbar.querySelector('[data-dropdown-trigger="heading"]');
const headingItems = editor.toolbar.querySelectorAll('[data-dropdown="heading"] .star-dropdown-item');
console.log('heading trigger found:', !!headingTrigger);
console.log('heading item count (expect 6):', headingItems.length);
console.log('heading item values:', [...headingItems].map(i => i.dataset.value).join(','));

const alignTrigger = editor.toolbar.querySelector('[data-dropdown-trigger="alignment"]');
const alignItems = editor.toolbar.querySelectorAll('[data-dropdown="alignment"] .star-dropdown-item');
console.log('alignment trigger found:', !!alignTrigger);
console.log('alignment item count (expect 4):', alignItems.length);
console.log('alignment item values:', [...alignItems].map(i => i.dataset.value).join(','));
```

Run: `node scratchpad/verify-task1.js`
Expected output: both triggers found, heading item count 6 (values `h1,h2,h3,h4,h5,h6`), alignment item count 4 (values `alignLeft,alignCenter,alignRight,justifyFull`).

- [ ] **Step 5: Commit**

```bash
git add StarEditor.js
git commit -m "feat(editor): add heading and alignment dropdown groups"
```

---

### Task 2: Wire up dropdown selection handling

**Files:**
- Modify: `StarEditor.js:1877-1889` (`handleDropdownSelect()`)

**Interfaces:**
- Consumes: `StarEditor.toolbarButtons[name].groupItems` and `StarEditor.toolbarButtons[value]` from Task 1.
- Produces: clicking a heading or alignment dropdown item applies that item's own `command`/`value` via the existing `exec()` / `handleCustomCommand()` paths.

- [ ] **Step 1: Generalize `handleDropdownSelect()`**

Replace:

```javascript
    handleDropdownSelect(name, value) {
        this.closeAllPopups();
        this.restoreSelection();

        if (name === 'fontSize') {
            this.applyFontSize(value);
        } else if (name === 'fontName') {
            document.execCommand('fontName', false, value);
        }

        this.sync();
        this.updateToolbarState();
    }
```

with:

```javascript
    handleDropdownSelect(name, value) {
        this.closeAllPopups();
        this.restoreSelection();

        const def = StarEditor.toolbarButtons[name];

        if (name === 'fontSize') {
            this.applyFontSize(value);
        } else if (name === 'fontName') {
            document.execCommand('fontName', false, value);
        } else if (def && def.groupItems) {
            const itemDef = StarEditor.toolbarButtons[value];
            if (itemDef.custom) {
                this.handleCustomCommand(itemDef.command);
            } else {
                this.exec(itemDef.command, itemDef.value || null);
            }
        }

        this.sync();
        this.updateToolbarState();
    }
```

- [ ] **Step 2: Manual browser verification (jsdom cannot exercise real `execCommand`/contenteditable behavior)**

Serve the repo root (`python3 -m http.server 8791` from the repo root) and open `http://localhost:8791/0_test/test.html` via chrome-devtools MCP (or manually if the MCP browser is busy with another session).

- Click into the editor, type a line of text, click the heading trigger icon, select "Heading 2" from the popup. Expected: the line becomes an `<h2>`.
- Select some text, click the alignment trigger icon, select the center-align option. Expected: the containing block gets centered.
- Repeat for at least one more heading level and one more alignment option to confirm the generic lookup isn't accidentally hardcoded to the first item.

Expected: all selections apply correctly; no console errors.

- [ ] **Step 3: Commit**

```bash
git add StarEditor.js
git commit -m "feat(editor): apply heading/alignment dropdown selections"
```

---

### Task 3: Active-state parity on the trigger button

**Files:**
- Modify: `StarEditor.js:3993-4036` (`updateToolbarState()`)

**Interfaces:**
- Produces: a new private helper `isCommandStateActive(command, value)` returning `boolean`, extracted from the existing inline if/else chain (same logic, no behavior change for existing individual buttons). `updateToolbarState()` adds the `-btn-active` class to a dropdown trigger button whenever ANY of its `groupItems` values currently matches, via `isCommandStateActive`.
- Consumes: `StarEditor.toolbarButtons[key].groupItems`, `btn.dataset.dropdownTrigger` (already set by `createDropdownButton` for every dropdown-type button, unchanged).

- [ ] **Step 1: Extract `isCommandStateActive()` and generalize `updateToolbarState()`**

Replace the whole method body (currently lines 3993-4036):

```javascript
    updateToolbarState() {
        const buttons = this.toolbar.querySelectorAll('[data-command]');
        const activeClass = `${this.config.classPrefix}-btn-active`;

        buttons.forEach(btn => {
            const command = btn.dataset.command;
            const value = btn.dataset.value;

            btn.classList.remove(activeClass);

            // Check formatBlock for headings, blockquote, pre
            if (command === 'formatBlock' && value) {
                const currentBlock = document.queryCommandValue('formatBlock');
                if (currentBlock.toLowerCase() === value.toLowerCase()) {
                    btn.classList.add(activeClass);
                }
            // DOM-based check for subscript (Firefox queryCommandState unreliable)
            } else if (command === 'subscript') {
                if (this.isInsideTag('sub')) {
                    btn.classList.add(activeClass);
                }
            // DOM-based check for superscript (Firefox queryCommandState unreliable)
            } else if (command === 'superscript') {
                if (this.isInsideTag('sup')) {
                    btn.classList.add(activeClass);
                }
            // CSS-based check for justifyFull (Safari queryCommandState unreliable)
            } else if (command === 'justifyFull') {
                const block = this.getSelectedBlockElement();
                if (block && getComputedStyle(block).textAlign === 'justify') {
                    btn.classList.add(activeClass);
                }
            } else {
                // Check if command is currently active
                try {
                    if (document.queryCommandState(command)) {
                        btn.classList.add(activeClass);
                    }
                } catch (e) {
                    // Some commands don't support queryCommandState
                }
            }
        });
    }
```

with:

```javascript
    /**
     * Determine whether a single command/value pair currently matches the
     * selection's state. Shared by individual toolbar buttons and by group
     * membership checks for dropdown triggers (e.g. heading, alignment).
     *
     * @param {string} command
     * @param {string|undefined} value
     * @returns {boolean}
     * @private
     */
    isCommandStateActive(command, value) {
        // Check formatBlock for headings, blockquote, pre
        if (command === 'formatBlock' && value) {
            const currentBlock = document.queryCommandValue('formatBlock');
            return currentBlock.toLowerCase() === value.toLowerCase();
        // DOM-based check for subscript (Firefox queryCommandState unreliable)
        } else if (command === 'subscript') {
            return this.isInsideTag('sub');
        // DOM-based check for superscript (Firefox queryCommandState unreliable)
        } else if (command === 'superscript') {
            return this.isInsideTag('sup');
        // CSS-based check for justifyFull (Safari queryCommandState unreliable)
        } else if (command === 'justifyFull') {
            const block = this.getSelectedBlockElement();
            return !!(block && getComputedStyle(block).textAlign === 'justify');
        }

        try {
            return document.queryCommandState(command);
        } catch (e) {
            // Some commands don't support queryCommandState
            return false;
        }
    }

    updateToolbarState() {
        const buttons = this.toolbar.querySelectorAll('[data-command]');
        const activeClass = `${this.config.classPrefix}-btn-active`;

        buttons.forEach(btn => {
            btn.classList.remove(activeClass);

            const groupKey = btn.dataset.dropdownTrigger;
            const groupDef = groupKey ? StarEditor.toolbarButtons[groupKey] : null;

            if (groupDef && groupDef.groupItems) {
                const isActive = groupDef.groupItems.some(key => {
                    const itemDef = StarEditor.toolbarButtons[key];
                    return this.isCommandStateActive(itemDef.command, itemDef.value);
                });
                if (isActive) {
                    btn.classList.add(activeClass);
                }
                return;
            }

            if (this.isCommandStateActive(btn.dataset.command, btn.dataset.value)) {
                btn.classList.add(activeClass);
            }
        });
    }
```

- [ ] **Step 2: Verify the pure logic with jsdom (ad hoc script)**

`document.queryCommandValue`/`queryCommandState` are plain assignable properties in jsdom (they exist as stub functions), so they can be overridden directly to fake a state without needing a real contenteditable engine:

```javascript
// scratchpad/verify-task3.js
const { JSDOM } = require('jsdom');
const fs = require('fs');
const vm = require('vm');

const dom = new JSDOM(`<!doctype html><body><textarea id="t"></textarea></body>`, { runScripts: 'outside-only' });
dom.window.document.execCommand = () => true;
dom.window.document.queryCommandValue = () => '';
dom.window.document.queryCommandState = () => false;

const src = fs.readFileSync('/home/gabor/development/StarEditor/StarEditor.js', 'utf8');
vm.runInContext(src, dom.getInternalVMContext());
const StarEditor = dom.window.eval('StarEditor');
const editor = new StarEditor(dom.window.document.getElementById('t'));

// Fake "cursor is in an H2" after construction (construction itself needs the
// neutral stubs above so init() doesn't throw).
dom.window.document.queryCommandValue = (cmd) => cmd === 'formatBlock' ? 'h2' : '';

editor.updateToolbarState();

const headingBtn = editor.toolbar.querySelector('[data-dropdown-trigger="heading"]');
const alignBtn = editor.toolbar.querySelector('[data-dropdown-trigger="alignment"]');
console.log('heading trigger active (expect true):', headingBtn.classList.contains('star-btn-active'));
console.log('alignment trigger active (expect false):', alignBtn.classList.contains('star-btn-active'));
```

Run: `node scratchpad/verify-task3.js`
Expected: `heading trigger active (expect true): true`, `alignment trigger active (expect false): false`.

- [ ] **Step 3: Manual browser re-check**

In the same `test.html` session from Task 2: place the cursor inside an H2 and confirm the heading trigger icon shows the active/highlighted style; center-align a paragraph and confirm the alignment trigger shows active; click elsewhere in plain paragraph text and confirm neither trigger is highlighted.

- [ ] **Step 4: Commit**

```bash
git add StarEditor.js
git commit -m "feat(editor): highlight heading/alignment trigger on matching selection"
```

---

### Task 4: Localization + documentation

**Files:**
- Modify: `StarEditor.js:89-90` (en translations, insert before `'toolbar.h1'`) and `StarEditor.js:102-103` (en, insert before `'toolbar.alignLeft'`)
- Modify: `StarEditor.js:215-216` (hu translations, insert before `'toolbar.h1'`) and `StarEditor.js:228-229` (hu, insert before `'toolbar.alignLeft'`)
- Modify: `doc/CONFIGURATION.md:89-102` (default toolbar sample) and the "Available buttons" table (currently starting line 109)

**Interfaces:**
- Consumes: nothing new.
- Produces: `t('toolbar.heading')` / `t('toolbar.alignment')` resolve correctly in both locales; docs describe the new buttons without removing the individual-key rows (still valid for custom toolbars).

- [ ] **Step 1: Add English translation keys**

In the `en` block, insert immediately before `'toolbar.h1': 'Heading 1',` (currently line 90):

```javascript
            'toolbar.heading': 'Heading',
```

and immediately before `'toolbar.alignLeft': 'Align Left',` (currently line 103):

```javascript
            'toolbar.alignment': 'Alignment',
```

- [ ] **Step 2: Add Hungarian translation keys**

In the `hu` block, immediately before `'toolbar.h1': 'Címsor 1',` (currently line 216):

```javascript
            'toolbar.heading': 'Címsor',
```

and immediately before `'toolbar.alignLeft': 'Balra igazítás',` (currently line 229):

```javascript
            'toolbar.alignment': 'Igazítás',
```

- [ ] **Step 3: Verify both locale blocks have matching keys (grep, not jsdom)**

Run: `grep -c "'toolbar.heading'\|'toolbar.alignment'" StarEditor.js`
Expected: `4` (2 keys × 2 locales).

- [ ] **Step 4: Update `doc/CONFIGURATION.md`**

Replace the default toolbar code sample (currently lines 89-102) heading/alignment lines:

```
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', '|',
```
→
```
    'heading', '|',
```

```
    'alignLeft', 'alignCenter', 'alignRight', 'justifyFull', '|',
```
→
```
    'alignment', '|',
```

In the "Available buttons" table, add two rows directly above the existing `h1`–`h6` / alignment rows:

```
| `heading` | Heading level dropdown (H1–H6) — shown by default instead of 6 separate buttons |
| `h1` – `h6` | Individual heading levels 1–6 (for a custom toolbar not using the `heading` dropdown) |
```

```
| `alignment` | Text alignment dropdown (left/center/right/justify) — shown by default instead of 4 separate buttons |
| `alignLeft` | Align text left (for a custom toolbar not using the `alignment` dropdown) |
```

(Keep `alignCenter`/`alignRight`/`justifyFull` rows as they are, immediately following.)

- [ ] **Step 5: Commit**

```bash
git add StarEditor.js doc/CONFIGURATION.md
git commit -m "docs(editor): document heading and alignment dropdown groups"
```

---

### Task 5: Release finalize + full manual acceptance pass

**Files:**
- Modify: `StarEditor.js:8` (`@version` header)
- Modify: `CHANGELOG.md` (new `[2.9.0]` section)
- Regenerate: `dist/StarEditor.min.js`

**Interfaces:**
- Consumes: everything from Tasks 1-4.
- Produces: a shippable 2.9.0 release, dist rebuilt and verified in sync.

- [ ] **Step 1: Bump the version header**

In `StarEditor.js`, change:

```javascript
 * @version 2.8.1
```
to:
```javascript
 * @version 2.9.0
```

- [ ] **Step 2: Add the CHANGELOG entry**

Insert a new section above `## [2.8.1] - 2026-07-29`:

```markdown
## [2.9.0] - 2026-07-29

### Summary

| Category | Description                                                                 |
|----------|------------------------------------------------------------------------------|
| Added    | Heading levels (H1-H6) now collapse into a single dropdown toolbar button   |
| Added    | Text alignment options now collapse into a single dropdown toolbar button  |

### Added
- The default toolbar now shows one heading dropdown instead of 6 separate H1-H6 buttons, and one alignment dropdown instead of 4 separate alignment buttons, reducing toolbar clutter. The individual buttons remain available for custom `toolbar` configurations that want the old flat layout.
```

(Recompute exact table column padding so header/separator/data rows all align — do not eyeball it; see the `awk`/python column-width check used earlier in this project's history for the 2.8.1 entry.)

- [ ] **Step 3: Regenerate the minified build**

Run: `terser StarEditor.js -c -m -o dist/StarEditor.min.js`
Expected: command exits 0; `grep -c groupItems dist/StarEditor.min.js` returns at least `1` (mangled variable names don't rename object property keys, so `groupItems` survives minification verbatim).

- [ ] **Step 4: Full manual acceptance pass in the browser**

Using the same `test.html` session:
- Toolbar shows exactly one heading icon and one alignment icon where 6+4 used to be.
- Both dropdowns open on click, close on selection and on outside click (existing `closeAllPopups()` behavior, unchanged).
- Applying every one of the 6 heading levels and all 4 alignment options works and highlights the trigger correctly.
- Toggle to code view and back — confirm the toolbar re-renders/behaves identically after the round trip (regression check against the unrelated 2.8.1 code-view fix already shipped).
- Spot-check backward compatibility: temporarily instantiate a second editor on the page with `toolbar: ['h1', 'h2', 'alignLeft', 'alignCenter']` (via the browser console) and confirm the old flat individual buttons still render and function.

- [ ] **Step 5: Commit**

```bash
git add StarEditor.js CHANGELOG.md dist/StarEditor.min.js
git commit -m "chore(editor): bump to 2.9.0 for heading/alignment dropdown groups"
```

---

## Self-Review Notes

- **Spec coverage:** data model (Task 1), rendering (Task 1), selection handling (Task 2), active-state parity (Task 3), localization (Task 4), documentation (Task 4), versioning (Task 5) — every spec section has a task.
- **Placeholder scan:** no TBD/TODO; every step has literal code or an exact literal command.
- **Type consistency:** `groupItems` (array of `toolbarButtons` keys), `isCommandStateActive(command, value)` signature, and `dataset.dropdownTrigger` naming are used identically across Tasks 1, 2, and 3.
- **Scope:** single subsystem (toolbar), no decomposition needed.
