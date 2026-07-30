# Image wrap alignment — design

Status: approved

## Problem

Inserted images (`<img>`) have no alignment control beyond the existing
50%/100% width resize. There is no way to float an image left or right so
surrounding paragraph text wraps around it, nor to center it as a standalone
block. (Gitea #8)

## Design

### Mechanism: inline styles on the `<img>`, no new CSS class

The existing per-image floating toolbar (`showImageToolbar`) gains 4 new
buttons — Left, Center, Right, None — alongside the existing Alt/50%/100%/
Delete buttons. Clicking one sets inline styles directly on the selected
`<img>`, the same pattern the existing 50%/100% resize buttons already use
(`img.style.width = '50%'`).

No new CSS class is added to `static styles`. This keeps alignment fully
inline and portable: the saved HTML renders correctly wherever it ends up
(a blog post, an email, a host page that never loads StarEditor's own
stylesheet), instead of depending on a `.star-img-align-*` rule that only
exists while StarEditor's injected `<style>` is present.

### States

A margin of `12px` is used throughout (matches `.star-editor`'s own `12px`
padding).

- **Left**: `float: left; margin: 12px 12px 12px 0;` — top/right/bottom
  margin, none on the left (image sits at the text's left edge).
- **Right**: `float: right; margin: 12px 0 12px 12px;` — top/left/bottom
  margin, none on the right.
- **Center**: `display: block; margin: 12px auto; clear: both;` — no wrap
  (confirmed with Gábor: centering a float so text wraps both sides isn't
  achievable in normal CSS flow, so Center matches every other editor's
  convention — a standalone centered block). `clear: both` prevents it from
  landing beside a still-floating previous image.
- **None**: clears `float`, `margin`, `display`, `clear` back to unset —
  returns to today's plain inline `<img>` with `max-width: 100%; height:
  auto;` from the existing `.star-editor img` rule.

### Toolbar UI

4 new buttons inserted into `showImageToolbar()`'s template, between `Alt`
and the resize buttons: `align-left`, `align-center`, `align-right`,
`align-none`. Icons: SunEditor's `format_float_left` / `format_float_center`
/ `format_float_right` / `format_float_none` (added to `StarEditor.icons`,
same registry and attribution pattern as the rest of the icon set).

Whichever alignment currently applies gets the existing `-btn-active`
highlight (same visual language as the main toolbar's active states),
refreshed whenever the toolbar is (re)shown (`selectImage`) and after every
alignment click. Detected directly from the inline style we set — no
`getComputedStyle` needed: `img.style.float === 'left'` → left active;
`float === 'right'` → right active; `img.style.display === 'block'` →
center active; none of those → None active.

The 4 alignment buttons don't self-toggle-off on a second click (confirmed
with Gábor) — removing alignment is only through the explicit `None` button.

No width constraint is added to `.star-image-toolbar` — it already has none
today (its `left`/`top` follow the image, but its own box just sizes to fit
its buttons via `display: flex` with default `nowrap`). So the toolbar
already always shows all 8 buttons in one row regardless of how narrow the
image has been resized to; nothing new needs to be built for this.

### Resize interaction

No new code needed. `float` reflow is native browser layout — text wrapping
already re-flows continuously as the image's rendered box changes size
during a drag-resize, with zero StarEditor involvement. The existing
`updateResizerPosition()` / `updateToolbarPosition()` calls (already invoked
on every `mousemove` during resize, and on the 50%/100% resize actions) keep
the floating resizer handles and toolbar correctly positioned against the
now-floated image exactly as they do today against a static one — the
`offsetLeft`/`offsetTop`/`offsetWidth`/`offsetHeight` walk they use reports a
floated element's real box the same way it reports a static one's.

### Scope

Applies uniformly to every image regardless of insertion source (URL,
upload, server gallery) — alignment is a property of the selected `<img>`
element itself, applied after the fact via the same per-image toolbar that
already handles Alt/resize/delete for all of them.

### Documentation

`doc/CONFIGURATION.md`: note the 4 new image-toolbar actions near wherever
Alt/resize/delete are already documented (if at all — check current
coverage of the image toolbar during implementation).

### Versioning

New functionality → minor bump.

## Out of scope

- No wrapper element (`<figure>` etc.) around the image — alignment is
  purely `<img>`-level inline style.
- No user-configurable margin value — fixed at `12px`.
- No "wrap both sides" center mode — explicitly rejected per the CSS
  limitation discussed above.
- No changes to the existing 50%/100% resize buttons or the drag-resize
  handles beyond them continuing to work unchanged against a floated image.
