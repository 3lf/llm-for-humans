# README hero redesign variants

## Goal

Replace the current floating-page composition with three genuinely different visual directions. The variants are selection previews only: they are saved beside the active hero and do not change `README.md` until one direction is approved.

## Shared constraints

- Keep the real book identity, navy/cream/gold palette, and wide README-hero framing.
- Do not reuse two detached PDF pages around the cover.
- Make the book the clear focal point at desktop and narrow GitHub widths.
- Avoid invented UI, marketing copy, logos, watermarks, and visual clutter.
- Treat generated Persian text as non-final. After selection, reinsert the exact source cover and any visible interior content before replacing the active hero.

## Variant A: open book

A premium editorial product composition. One naturally open physical book occupies the foreground, with believable page curvature, paper thickness, binding, contact shadows, and restrained depth. The recognizable closed cover appears as a supporting object rather than a flat central poster. The result should feel photographed as one scene, not assembled from floating screenshots.

## Variant B: graphic editorial

A deliberately two-dimensional editorial composition with no physical-book illusion. The real cover is the main anchor, while a single large abstract crop inspired by the book's diagrams, grid, and Persian typography creates rhythm and depth. Crisp geometric structure, strong negative space, and the existing palette make the art feel native to the repository.

## Variant C: reading desk

A natural overhead reading scene on a warm, understated desk. The book is open or partly open in active use, supported by only a pen, reading glasses, and a restrained edge of a laptop or notebook. Soft daylight, real material texture, and small imperfections should avoid a glossy stock-photo look.

## Selection and finalization

The three previews are compared at 1400×600 and at a 375-pixel GitHub viewport. After the user selects a direction, only that direction is finalized, the exact source cover/content is restored where needed, and `images/book-preview.png` is replaced in a separate commit.
