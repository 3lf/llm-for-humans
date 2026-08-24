<div dir="rtl">

# راهنمای ساخت نسخه PDF کتاب 📚

نسخه اصلی کتاب همون `README.md` ریشه پروژه‌ست. پوشه `book/` فقط تنظیمات مخصوص این کتاب و بررسی‌های محتوایی اون رو نگه می‌داره؛ خود موتور ساخت PDF توی ریپوی [README Press](https://github.com/3lf/readme-press) توسعه پیدا می‌کنه.

اگه فقط می‌خوای کتاب رو بخونی، لازم نیست هیچ‌کدوم از این مراحل رو انجام بدی. این راهنما برای وقتیه که می‌خوای بعد از تغییر محتوا، نسخه PDF تازه بسازی یا انتشار جدیدی آماده کنی.

## داخل این پوشه چه خبره؟ 🧭

- **تنظیمات کتاب:** فایل `readme-press.config.mjs` ساختار فصل‌ها، نام خروجی‌ها و قواعد صفحه‌بندی رو مشخص می‌کنه.
- **بررسی‌های مخصوص پروژه:** فایل `qa.mjs` چیزهایی مثل تعداد فصل‌ها، تصاویر، ترجمه‌های تاییدشده و ایرادهای رایج RTL رو چک می‌کنه.
- **خروجی‌های محلی:** فایل‌های ساخته‌شده موقتاً توی `book/dist/` قرار می‌گیرن و نباید وارد commit بشن.

## قبل از شروع 🧰

این ابزارها باید روی سیستمت نصب باشن:

- **نسخه Node.js:** نسخه ۲۲ یا جدیدتر
- **ابزار qpdf:** برای بررسی و بهینه‌سازی ساختار PDF
- **ابزارهای Poppler:** شامل `pdfinfo`، `pdffonts`، `pdftotext`، `pdfimages` و `pdftoppm`

روی macOS می‌تونی ابزارهای PDF رو با این فرمان بگیری:

```bash
brew install poppler qpdf
```

## موتور رو آماده کن 🛠️

برای اینکه نتیجه سیستم تو با GitHub Actions یکی باشه، دقیقاً همون نسخه‌ای از README Press رو بگیر که workflow پروژه استفاده می‌کنه:

```bash
git clone --branch v0.2.0 --depth 1 https://github.com/3lf/readme-press.git .readme-press
npm ci --prefix .readme-press
npm ci --prefix book
```

فرمان آخر کتابخانه تبدیل دقیق تاریخ جلالی رو نصب می‌کنه. هر وقت نسخه README Press در workflow عوض شد، تگ همین فرمان هم باید با اون هماهنگ بشه.

## خروجی دلخواهت رو بساز 🏗️

برای ساخت نسخه عادی و کم‌حجم‌تر این فرمان رو اجرا کن:

```bash
node .readme-press/bin/readme-press.mjs build \
  --config book/readme-press.config.mjs \
  --quality normal
```

برای ساخت نسخه مناسب چاپ با پس‌زمینه سفید و تصاویر رنگی بدون افت، این فرمان رو اجرا کن:

```bash
node .readme-press/bin/readme-press.mjs build \
  --config book/readme-press.config.mjs \
  --quality print
```

برای ساخت نسخه تمام‌رنگی و باکیفیت این فرمان رو اجرا کن:

```bash
node .readme-press/bin/readme-press.mjs build \
  --config book/readme-press.config.mjs \
  --quality high
```

برای ساخت هر سه نسخه با یک فرمان از حالت `all` استفاده کن:

```bash
node .readme-press/bin/readme-press.mjs build \
  --config book/readme-press.config.mjs \
  --quality all
```

در پایان این سه فایل داخل `book/dist/` ساخته می‌شن:

- **نسخه عادی:** فایل `llm-for-humans-book.pdf` برای دانلود و اشتراک‌گذاری روزمره
- **نسخه مناسب چاپ:** فایل `llm-for-humans-book-print.pdf` با پس‌زمینه سفید و تصاویر رنگی PNG بدون افت
- **نسخه باکیفیت:** فایل `llm-for-humans-book-high-quality.pdf` با طراحی تمام‌رنگی و تصاویر PNG بدون افت برای نمایش و آرشیو

## همه‌چیز رو کامل بررسی کن ✅

ساخته‌شدن PDF به‌تنهایی کافی نیست. قبل از انتشار باید هر سه نسخه، همه صفحه‌ها و قواعد مخصوص کتاب بررسی بشن:

```bash
node .readme-press/bin/readme-press.mjs qa \
  --config book/readme-press.config.mjs \
  --quality all \
  --render-all
```

این فرمان ساختار PDF، فونت‌ها، لینک‌ها، مقصدهای داخلی، تصاویر، سفیدی پس‌زمینه نسخه چاپی، برابری سه نسخه و رندر تک‌تک صفحه‌ها رو بررسی می‌کنه. بعدش هم `book/qa.mjs` سراغ قواعد مخصوص همین پروژه می‌ره.

گردش‌کار `README QA` روی هر PR، متن فارسی، اطلاعات انتشار، ساختار workflow و خروجی کامل هر سه نسخه PDF رو بررسی می‌کنه. همین بررسی بلوکی رو هم می‌گیره که اولین نویسه قوی اون لاتینه؛ فرقی نمی‌کنه خط مستقیم با متن لاتین شروع شده باشه یا بعد از ایموجی. ایموجی قبل از متن فارسی مشکلی نداره. این گردش‌کار فقط فایل‌ها رو می‌سازه و بررسی می‌کنه و هیچ Release تازه‌ای منتشر نمی‌کنه.

برای ساخت، بررسی کامل و آماده‌کردن فایل‌های انتشار با یک فرمان می‌تونی از پایپلاین استفاده کنی:

```bash
release_version=v1.0.1
release_date="$(TZ=Asia/Tehran date +%F)"
README_PRESS_RELEASE_VERSION="$release_version" \
README_PRESS_RELEASE_DATE="$release_date" \
node .readme-press/bin/readme-press.mjs pipeline \
  --config book/readme-press.config.mjs \
  --release-version "$release_version" \
  --commit FULL_GIT_COMMIT \
  --render-all
```

پایپلاین GitHub همین تاریخ رو یک بار با منطقه زمانی `Asia/Tehran` ثبت می‌کنه. بعد `jalaali-js` اون رو به تاریخ شمسی تبدیل می‌کنه و نسخه انتشار و هر دو تاریخ شمسی و میلادی رو روی جلد و صفحه شناسنامه می‌نویسه. اگه نسخه یا تاریخ ناقص یا نامعتبر باشه، ساخت PDF متوقف می‌شه.

## نسخه جدید رو منتشر کن 🚀

انتشار کتاب عمداً خودکار نیست. بعد از اینکه تغییرات روی `main` قرار گرفت:

- **قدم اول:** وارد بخش Actions ریپو شو.
- **قدم دوم:** گردش‌کار `Release book` رو باز کن.
- **قدم سوم:** برای انتشار پایدار شماره‌ای مثل `v1.0.1` و برای نسخه آزمایشی شماره‌ای مثل `v1.1.0-rc.1` وارد کن؛ نوع انتشار از روی همین پسوند تشخیص داده می‌شه.
- **قدم چهارم:** صبر کن تا ساخت و QA کامل هر سه نسخه سبز بشه.
- **قدم پنجم:** نسخه Draft ساخته‌شده رو بازبینی کن و فقط وقتی مطمئنی، منتشرش کن.

به این ترتیب هر تغییر کوچیک README بی‌دلیل نسخه تازه‌ای از کتاب منتشر نمی‌کنه و تصمیم نهایی همیشه دست خودته.

### بعد از انتشار عمومی دوباره بررسی کن 🔎

بعد از انتشار یک نسخه پایدار، فقط سبز بودن گردش‌کار کافی نیست. چهار فایل مسیر `latest` رو دانلود کن و هش هر سه PDF رو با فایل منتشرشده بسنج:

```bash
verification_dir="$(mktemp -d)"
curl --fail --location --output "$verification_dir/llm-for-humans-book.pdf" \
  https://github.com/3lf/llm-for-humans/releases/latest/download/llm-for-humans-book.pdf
curl --fail --location --output "$verification_dir/llm-for-humans-book-print.pdf" \
  https://github.com/3lf/llm-for-humans/releases/latest/download/llm-for-humans-book-print.pdf
curl --fail --location --output "$verification_dir/llm-for-humans-book-high-quality.pdf" \
  https://github.com/3lf/llm-for-humans/releases/latest/download/llm-for-humans-book-high-quality.pdf
curl --fail --location --output "$verification_dir/SHA256SUMS.txt" \
  https://github.com/3lf/llm-for-humans/releases/latest/download/SHA256SUMS.txt
(cd "$verification_dir" && sha256sum --check SHA256SUMS.txt)
```

اگه Draft خراب بود، همون Draft رو پاک کن، ایراد رو برطرف کن و از نو بسازش. اگه نسخه عمومی ایراد داشت، راه عادی اینه که اصلاح رو با یک patch release تازه منتشر کنی. پاک‌کردن نسخه عمومی و tag اون و استفاده دوباره از همون شماره، یک مسیر استثنایی و تخریبیه: فقط با تأیید صریح مالک انجامش بده و قبلش کپی همه assetهای نسخه اصلی رو در یک جای امن نگه دار.

## حواست به فایل‌های محلی باشه 🧹

پوشه `.readme-press/`، پوشه `book/node_modules/`، خروجی‌های `book/dist/`، فایل‌های PDF و کش‌های ساخت عمداً نباید وارد commit بشن. این مسیرها برای حفظ تاریخ قدیمی `.gitignore` به اون فایل اضافه نمی‌شن؛ پس قبل از هر commit حتماً وضعیت Git رو ببین و فقط فایل‌های لازم رو با اسم دقیق stage کن.

```bash
git status --short
git add -- book/README.md
git diff --cached --name-status
```

خط `git add` فقط یک نمونه‌ست. اسمش رو با مسیر دقیق فایل‌هایی عوض کن که واقعاً در همون تغییر دست زده‌ای و برای هر مسیر لازم تکرارش کن. از `git add .` و `git add -A` استفاده نکن. اگه خروجی یا فایل آزمایشی دیدی، اون رو بیرون از ریپو آرشیو کن یا بعد از اطمینان از بی‌استفاده‌بودنش پاک کن.

</div>
