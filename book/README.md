# ساخت نسخه PDF کتاب

مولد عمومی کتاب در ریپوی [README Press](https://github.com/3lf/readme-press) نگهداری می‌شود. این ریپو فقط محتوای کتاب، تنظیمات مخصوص پروژه و QA محتوایی را نگه می‌دارد.

## پیش‌نیازها

- Node.js 22 یا جدیدتر
- `qpdf`
- ابزارهای Poppler شامل `pdfinfo`، `pdffonts`، `pdftotext`، `pdfimages` و `pdftoppm`

## آماده‌سازی محلی

نسخه موتور را دقیقاً روی tag استفاده‌شده در CI بگیر:

```bash
git clone --branch v0.1.0 --depth 1 https://github.com/3lf/readme-press.git .readme-press
npm ci --prefix .readme-press
```

## ساخت خروجی

نسخه عادی:

```bash
node .readme-press/bin/readme-press.mjs build \
  --config book/readme-press.config.mjs \
  --quality normal
```

نسخه باکیفیت:

```bash
node .readme-press/bin/readme-press.mjs build \
  --config book/readme-press.config.mjs \
  --quality high
```

هر دو نسخه:

```bash
node .readme-press/bin/readme-press.mjs build \
  --config book/readme-press.config.mjs \
  --quality all
```

خروجی‌ها در `book/dist/` ساخته می‌شوند:

- `llm-for-humans-book.pdf`، نسخه عادی و مناسب دانلود و اشتراک‌گذاری
- `llm-for-humans-book-high-quality.pdf`، نسخه با تصاویر PNG بدون افت برای چاپ و آرشیو

## QA کامل محلی

بعد از ساخت هر دو نسخه:

```bash
node .readme-press/bin/readme-press.mjs qa \
  --config book/readme-press.config.mjs \
  --quality all \
  --render-all
```

این فرمان علاوه بر QA عمومی PDF، قواعد محتوایی `book/qa.mjs` را هم اجرا می‌کند.

## انتشار نسخه جدید

انتشار فقط به‌صورت دستی از workflow با نام `Release book` و فقط روی برنچ `main` انجام می‌شود. workflow هر دو کیفیت را از همان commit می‌سازد، تمام صفحه‌ها را رندر و بررسی می‌کند، checksum می‌سازد و در پایان یک Draft Release تحویل می‌دهد. انتشار عمومی Draft همچنان یک تصمیم دستی باقی می‌ماند.
