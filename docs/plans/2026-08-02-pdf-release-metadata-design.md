# PDF release metadata design

## Goal

Make every release PDF show trustworthy release metadata without manual edits:

- an absolute repository URL in the footer
- the release version on the cover
- one pipeline-generated release date on both the cover and colophon
- a correctly converted Persian calendar date based on `Asia/Tehran`

## Selected approach

Keep the implementation in this repository so the fix can ship in one pull request without waiting for a separate README Press release.

The release workflow records one Gregorian date in `Asia/Tehran` at the start of the build. It passes that value to the book configuration. A small metadata helper validates the input, converts it with `jalaali-js`, and returns the exact strings used by the cover and colophon. Both PDF quality variants therefore receive identical metadata.

Local non-release builds keep the existing edition metadata so contributors can build without release-only environment variables. A pipeline build fails when its release date or version is absent or invalid.

## Output contract

The cover shows:

- the Persian release date
- the release version and Gregorian release date

The colophon shows:

- the edition with the same Persian and Gregorian dates
- the existing dedicated release-version row

Every body-page footer displays the complete `https://github.com/3lf/llm-for-humans` URL so PDF viewers cannot interpret it as a local relative path.

## Validation

Unit tests cover known Persian New Year boundaries, Persian-digit formatting, release-version validation, invalid dates, and non-release fallbacks. Project QA verifies that release builds carry the expected cover and colophon strings and that the stamped footer equals the canonical absolute repository URL.

The final release-like PDF is checked through its manifest, extracted text, link annotations, and rendered cover, colophon, and body footer pages.
