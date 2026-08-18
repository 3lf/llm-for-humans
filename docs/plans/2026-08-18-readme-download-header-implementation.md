# README book download header implementation plan

## 1. Prepare truthful source renders

Build the book with README Press v0.2.0 or reuse the already verified build from the same source revision. Render the cover and two representative pages at sufficient resolution. Confirm that every visible page is an unmodified real book page.

## 2. Rebuild the editorial hero

Compose a 1400×600 PNG using the cover as the primary object and the two page renders as supporting objects. Preserve the navy, cream, and gold visual system, improve scale and spacing, and keep the composition readable when GitHub scales it down. Replace `images/book-preview.png` only after visual inspection.

## 3. Build three download controls

Create three equal-size SVG controls under `images/`:

- `download-compact-book.svg`;
- `download-high-quality-book.svg`;
- `download-print-book.svg`.

Give each control a unique icon and treatment while preserving one shared component system. Validate every SVG with `xmllint` and render PNG previews for visual inspection.

## 4. Rewrite the README header

Remove the single large download button and its one-click caption. Insert the approved heading, shared explanation, three image links in compact/high/print order, and the approved Persian description below each button. Keep the hero linked to the latest Release and point each control at its exact stable asset filename.

## 5. Verify source and rendering

Run:

- `node book/source-qa.mjs README.md`;
- `npm test --prefix book`;
- actionlint for both workflows;
- `xmllint --noout` for all SVG controls;
- `git diff --check`.

Render the changed header through GitHub's Markdown API and inspect desktop and narrow-width screenshots. Confirm that all three direct links, alternative texts, labels, and descriptions are present.

## 6. Publish the PR update

Stage only the README, the four approved image assets, and the two plan documents if needed. Verify the staged file list, commit with an English message, push the existing `feat/print-book-download` branch, and update PR #17 so it describes the released README Press v0.2.0 dependency and redesigned download header.

## 7. Correct the compact download icon

Replace the compact button's icon paths with a centered standard download arrow and lower tray. Remove the intersecting decorative upper bar, validate the SVG as XML, rasterize it at its intrinsic size for visual inspection, and recheck the complete three-button row at desktop and narrow widths.

## 8. Straighten the side pages

Regenerate the hero from the original cover and rendered page sources. Set both side-page rotations and their shadow rotations to zero while preserving every other source, dimension, position, and visual treatment. Confirm the output remains 1400×600 and inspect the rendered GitHub README at desktop and narrow widths.
