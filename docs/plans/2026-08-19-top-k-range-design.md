# Clarify the practical Top-k range

## Goal

Resolve issue #15 by making the existing Top-k guidance explicit without presenting one provider-specific limit as a universal rule.

## Design

Keep the current low and high examples. Add one short subsection explaining that `top_k=1` is the smallest meaningful sampling set and produces greedy selection, while common values such as `40` or `50` are examples rather than a shared maximum. Tell readers to check the selected model or inference runtime for its default, valid range, and support.

Do not add a provider comparison table. Those limits change independently and would make a plain-language teaching section need frequent maintenance.

## Implementation and verification

Add the clarification immediately after the existing Top-k availability note so readers see the portability caveat before the examples. Preserve the current heading and anchor structure. Run the README source QA, diff checks, and the repository's relevant automated tests before publishing a draft pull request that closes issue #15 and thanks `@alifzl` for the report.
