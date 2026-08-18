# README book download header design

## Goal

Make the book immediately visible at the top of the Persian README and let readers choose the right PDF edition without decoding technical quality labels.

## Visual hierarchy

The header starts with a rebuilt 1400×600 editorial hero made from the real book cover and real rendered pages. The cover remains central and becomes larger, while two representative pages frame it with restrained depth and shadow. The navy, cream, and gold book palette stays intact. No generated or fabricated page text is introduced.

The hero links to the latest GitHub Release. Under it, a short Persian heading and one explanatory sentence establish that all editions contain the same book.

Three equal-width image buttons follow in this order:

1. compact edition;
2. high-quality edition;
3. print edition.

Each button is a separate accessible SVG with a distinct icon and treatment. The compact and high-quality buttons use progressively richer navy and gold treatments. The print button uses a white surface with a navy outline so its ink-efficient purpose is visually obvious. Each image link points directly to its stable `/releases/latest/download/` asset.

## Approved copy

Section heading:

> کتاب رو چطور می‌خوای بخونی؟ 📥

Shared explanation:

> محتوای هر سه نسخه یکیه؛ فقط حجم فایل، کیفیت تصویرها و رنگ پس‌زمینه فرق می‌کنه.

Compact edition:

> دانلود نسخه کم‌حجم
>
> همون کتاب کامل، با حجم کمتر؛ برای خوندن روزمره و فرستادن برای بقیه.

High-quality edition:

> دانلود نسخه باکیفیت
>
> تصویرها با کیفیت اصلی؛ برای نمایش روی صفحه‌های بزرگ و نگه‌داشتن نسخه باکیفیت.

Print edition:

> دانلود نسخه مناسب چاپ
>
> صفحه‌های سفید و تصویرهای رنگی؛ برای چاپ راحت‌تر و مصرف کمتر جوهر.

The previous one-click sentence and single large download button are removed.

## Responsive and accessibility behavior

GitHub renders the three image links inside equal table cells on desktop. On narrow layouts, every SVG remains readable at its intrinsic aspect ratio and the Persian explanation stays as HTML text rather than being baked into a large composite image.

Every image has descriptive Persian alternative text. Button labels remain legible without relying on color, and the print control uses both a printer icon and explicit wording.

## Compact download icon correction

The compact-edition button uses a conventional download symbol inside its gold circle. The icon contains only a centered vertical arrow and a separate lower tray. The previous decorative upper bar is removed because it intersects the arrow stem and reads as a rendering defect. Arrow and tray spacing are optically balanced inside the circle, with rounded strokes matching the other two button icons.

## Side-page alignment correction

The two real interior pages remain at their current size, height, position, and distance from the central cover, but both use zero rotation. Their borders and drop shadows are also axis-aligned. The cover, background, ornament, page content, and overall hierarchy remain unchanged. This removes the distracting inward tilt without introducing generated or resampled page text.

## Verification

- render the README with GitHub's Markdown API;
- inspect the hero and buttons at desktop and narrow widths;
- validate all SVGs as XML;
- confirm the three stable download filenames and edition order;
- run Persian source QA and workflow syntax checks;
- run the book tests and the complete three-edition PDF workflow through README Press v0.2.0.
