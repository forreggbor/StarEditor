# Heading & alignment toolbar consolidation — design

Status: approved

## Problem

The default toolbar shows 6 separate heading buttons (`h1`–`h6`) and 4 separate
alignment buttons (`alignLeft`, `alignCenter`, `alignRight`, `justifyFull`) as
individual icons. Both groups are mutually-exclusive single-choice sets and are
candidates for collapsing into a single dropdown-trigger icon each, matching
the existing `fontSize`/`fontName` dropdown pattern.

## Design

### Data model

Two new composite entries in `static toolbarButtons`:

- `heading` — `type: 'dropdown'`, `groupItems: ['h1','h2','h3','h4','h5','h6']`
- `alignment` — `type: 'dropdown'`, `groupItems: ['alignLeft','alignCenter','alignRight','justifyFull']`

The existing individual entries (`h1`..`h6`, `alignLeft`..`justifyFull`) stay
in `toolbarButtons` unchanged, so a custom `toolbar` config array can still
reference them directly — backward compatible, nothing removed.

### Default toolbar

`static defaults.toolbar` replaces the 6 heading keys with `'heading'` and the
4 alignment keys with `'alignment'`. The `'all'` shorthand resolves by copying
`defaults.toolbar` verbatim, so it picks this up automatically — no separate
handling needed.

### Rendering (`createDropdownButton`)

Generalized to branch on `def.groupItems` (in addition to the existing
hardcoded `fontSize`/`fontName` branches): when present, each dropdown item is
built from the referenced key's existing `toolbarButtons` definition
(`icon`/`title`/`command`/`value`) — no duplicated icon or label content.

- Heading items: text label (icon field, e.g. `H1`), sized to that heading's
  own font size — same visual pattern as the `fontSize` dropdown's live-preview
  items.
- Alignment items: icon-only (reuse the existing arrow glyphs) — consistent
  with the rest of the toolbar's icon-only convention for these commands.

### Selection handling (`handleDropdownSelect`)

Generalized: for a `groupItems`-based dropdown, the selected item's own
`command`/`value` (and `custom` flag, if set) is executed via the same path
regular toolbar buttons use (`exec()` or `handleCustomCommand()`) — no new
per-group special case.

### Active-state parity (`updateToolbarState`)

The trigger button (`heading` / `alignment`) gets the existing
`-btn-active` class whenever the current selection matches ANY of its
`groupItems` values, reusing the existing `formatBlock`/`queryCommandState`
checks. This preserves today's visual feedback (e.g. "cursor is in an H2",
"text is centered") on the collapsed icon instead of on 6+4 separate buttons.

### Localization

New keys `toolbar.heading` and `toolbar.alignment` in both the `en` and `hu`
translation blocks, for the trigger button tooltips.

### Documentation

`doc/CONFIGURATION.md`: update the default toolbar code sample, and add
`heading` / `alignment` rows to the "Available buttons" table. Existing
individual button rows stay (still valid for custom toolbars).

### Versioning

New functionality (not a bugfix) → minor bump: 2.8.1 → 2.9.0. Dist rebuild
(`terser -c -m`) and CHANGELOG entry included.

## Out of scope

- No new CSS layout (dropdown items keep the existing vertical list style,
  even for the icon-only alignment group).
- No dynamic icon swapping on the trigger button — the trigger keeps a
  static icon; only the `-btn-active` highlight reflects current state.
- No other toolbar groups (subscript/superscript, ul/ol, indent/outdent) are
  touched — only heading and alignment, per explicit scope.
