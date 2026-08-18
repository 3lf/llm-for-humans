# README hero variants implementation plan

1. Generate one wide preview for each approved direction using the exact cover as the visual reference.
2. Save the previews as separate versioned PNG files without changing the active README image.
3. Normalize each preview to a 1400×600 canvas and optimize it for repository use.
4. Inspect subject fidelity, composition, visible text, artifacts, and narrow-width readability.
5. Present all three options together for selection.
6. After selection, replace generated text/content with exact source artwork, update the active hero, run repository QA, and push the final follow-up commit.

## Selected-direction refinement

1. Use the reading-desk preview as the edit target and the exact cover render as a supporting reference.
2. Replace only the malformed book with a fully closed, physically coherent matte book.
3. Preserve the desk, window, lighting, pen, glasses, notebook, camera angle, and crop.
4. Inspect cover planarity, page-block thickness, spine alignment, contact shadow, object intersections, and text fidelity.
5. Normalize the approved result to 1400×600, replace `images/book-preview.png`, and verify desktop and narrow GitHub rendering.
