<div dir="rtl">




<div align="center">

# [هنوز در حال نگارش و تکمیل شدن است...]

</div>

<br>

<div align="center">

# مقدمه 📚

</div>

حدود دو سال پیش، حس کردم که منابع فارسی خوبی برای دیزاین پترن‌ها وجود نداره. واسه همین یه ریپازیتوری گیت ساختم به اسم "[دیزاین پترن به زبان آدمیزاد](https://github.com/3lf/design-patterns-for-humans)" که استقبال خوبی هم شد.

حالا با رشد LLMها و اهمیتشون تو کارهای مختلف، فکر می‌کنم یه ریپازیتوری خوب می‌تونه کمک زیادی کنه تا از این مدل‌های زبانی به بهترین شکل استفاده کنین.

تو این ریپو، سعی می‌کنم به زبان آدمیزاد هر چی برای کار با LLMها نیاز دارین رو توضیح بدم. از نوشتن پرامپت گرفته تا نکات و ترفندهای کاربردی.

<br>

<div align="center">

## پشت‌پرده‌ی این ریپو 🎬

</div>

جالب اینجاست که حتی این ریپو هم با کمک LLMها ساخته شده؛ از نوشتن توضیحات تا ساختاردهی محتوا و حتی تمامی عکس‌ها.


<br>

---

<div align="center">

# ال ال ام چیه؟ 🤖

</div>

به طور کلی، LLM مخفف Large Language Model هست. این مدل‌ها با استفاده از حجم عظیمی از داده‌ها آموزش دیده‌ان تا بتونن زبان طبیعی رو بفهمن و تولید کنن. LLMها می‌تونن متن بنویسن، سوالات رو جواب بدن، ترجمه کنن، و حتی گفتگو کنن.

به طور ساده، LLMها مثل یه آدم خیلی باهوش هستن که می‌تونن متون داده شده رو بخونن و جواب بدن یا حتی خودشون متن تولید کنن. این مدل‌ها به دلیل استفاده از داده‌های زیاد و الگوریتم‌های پیچیده، توانایی بالایی دارن و تو خیلی از کارها می‌تونن کمک کنن.

برای استفاده از LLMها، باید بدونیم چطور پرامپت‌های خوبی بنویسیم تا بهترین نتیجه رو بگیریم.


<br>

---

<div align="center">

# پرامپت ✍️

</div>

پرامپت (Prompt) یه ورودی متنیه که شما به LLM می‌دین تا براساس اون، مدل یه خروجی تولید کنه. این ورودی می‌تونه سوال، دستور، یا هر نوع متن دیگه‌ای باشه که مدل باید بهش جواب بده.

<div align="center">

## یک نمونه پرامپت 🌍

</div>

### مثال: نوشتن یه ایمیل رسمی برای درخواست مرخصی

**پرامپت:**
«لطفاً یه ایمیل رسمی برای درخواست مرخصی سه روزه بنویس که دلیل مرخصی رو هم توضیح بده.»

**جواب LLM:**
«سلام،  
من [نام شما] هستم و قصد دارم از تاریخ [تاریخ شروع] تا [تاریخ پایان] به دلیل [دلیل مرخصی] مرخصی بگیرم. لطفاً درخواست من رو بررسی کنین و بهم اطلاع بدین.  
با تشکر،  
[نام شما]»

<br>

<div align="center">

## چطور یه پرامپت خوب بنویسیم؟ 

</div>

نوشتن یه پرامپت خوب برای LLMها می‌تونه تاثیر زیادی روی کیفیت خروجی داشته باشه. در اینجا چند نکته برای نوشتن پرامپت‌های موثر آورده شده است:

<div align="center">

<br>

### 1. استفاده از مرزها برای تفکیک داده‌ها از پرامپت ✂️

</div>

برای اینکه مدل بهتر بفهمه کجا داده‌ها شروع و کجا تموم می‌شن، از مرزهای مشخصی استفاده کنین. این مرزها می‌تونن شامل علامت‌های نقل قول، خطوط جداکننده یا دیگر نشانه‌های بصری باشن.

**روش‌های استفاده از مرزها:**

1. **استفاده از سه علامت نقل قول:**

```
لطفاً یک بیوگرافی کوتاه برای این شخص بنویس:
"""
اسم: Ali
سن: 25
"""
```

2. **استفاده از تگ‌های HTML:**

```html
لطفاً یک بیوگرافی کوتاه برای این شخص بنویس:
<data>
اسم: Ali
سن: 25
</data>
```

پی‌نوشت: استفاده از کاراکتر ` بصورت ``` هم خیلی رایج هست.

<br>

<div align="center">

### 2. درخواست خروجی ساختاریافته 🗂️

</div>

برای دریافت خروجی قابل استفاده‌تر، درخواست کنین که مدل خروجی رو به فرمتی مثل JSON، XML یا HTML بده.

**مثال:**
```
لطفاً اطلاعات زیر رو به صورت JSON با کلید های name و age خروجی بده:
اسم: Ali
سن: 25
```
**جواب:**
<div dir="ltr">

```json
{
  "name": "Ali",
  "age": 25
}
```

</div>

<br>

<div align="center">

### 3. اضافه کردن اطلاعات سبک برای تغییر لحن خروجی 🎨

</div>

می‌تونین به مدل بگین که جواب‌ها رو با یه لحن خاص بده.

**مثال:**

```
لطفاً به زبان ساده و دوستانه توضیح بده که چگونه یک کیک شکلاتی درست کنیم.
```

<br>

<div align="center">

### 4. دادن شرایط به مدل و درخواست بررسی آن‌ها ✅

</div>

می‌تونین به مدل بگین که شرایطی رو بررسی کنه و بگه که آیا اون‌ها درست هستن یا نه.

**مثال:**
```
اگر سن کاربر بالای ۱۸ سال است و کاربر دارای گواهینامه رانندگی است، لطفاً بنویس که او مجاز به رانندگی است.
سن: ۲۵

جواب: بله
```

<br>

<div align="center">

### 5. دادن مثال‌های موفق از انجام وظایف و سپس درخواست 🚀

</div>

برای اینکه مدل بهتر بفهمه چطور وظیفه‌ای رو انجام بده، می‌تونین چند مثال موفق بدین و بعدش درخواست خودتون رو مطرح کنین.

**مثال:**
```
مثال:
ورودی: ۵ + ۳
خروجی: ۸

ورودی: ۱۲ - ۴
خروجی: ۸

لطفاً ۷ * ۲ رو محاسبه کن.
```

<br>

<div align="center">

### 6. درخواست از مدل برای حل مسئله قبل از دادن جواب 🧩

</div>

می‌تونین به مدل بگین که مسئله رو حل کنه و بعد جواب بده.

**مثال:**
```
لطفاً ابتدا مسئله زیر رو حل کن و سپس جواب نهایی رو بده:
۳ + ۵ * ۲ - ۸ / ۴ = ؟
```

<br>

<div align="center">

### 7. تکرار و بهبود پرامپت‌ها 🔄

</div>

پرامپت‌ها رو چند بار امتحان کنین و با تغییرات کوچک بهبود بدین تا بهترین جواب رو بگیرین.

<br>

با رعایت این نکات، می‌تونین پرامپت‌هایی بنویسین که LLMها رو به بهترین نحو هدایت کنه و جواب‌های دقیق و مرتبط بگیرین.

---

<div align="center">

# پارامترهای معروف در کار با LLMها ⚙️

</div>

برای اینکه از LLMها بهترین استفاده رو بکنیم، باید با چند تا از پارامترهای مهمشون آشنا باشیم. این پارامترها می‌تونن خروجی مدل رو تحت تأثیر قرار بدن. این پارامترها معمولاً در APIها استفاده می‌شن و در پلتفرم‌های آماده مثل OpenAI Chat نیاز به تنظیم ندارن. بریم سراغ چند تا از مهم‌ترین پارامترها:

<div align="center">

## Temperature 🌡️

</div>

پارامتر `temperature` تعیین می‌کنه که خروجی مدل چقدر متنوع باشه. 

- **مقادیر پایین (مثلاً 0.2)**: خروجی مدل قابل پیش‌بینی‌تر و دقیق‌تر می‌شه. مدل کمتر ریسک می‌کنه و بیشتر جواب‌های محافظه‌کارانه می‌ده. مثلاً وقتی که می‌خواین جواب‌های ثابت و مطمئن بگیرین.
- **مقادیر بالا (مثلاً 0.8)**: خروجی مدل خلاقانه‌تر و متنوع‌تر می‌شه. مدل بیشتر ریسک می‌کنه و جواب‌های خلاقانه‌تر و غیر منتظره می‌ده. این برای زمانی خوبه که می‌خواین ایده‌های جدید یا جواب‌های غیر معمول بگیرین.

<div align="center">

## Top-p 🎯

</div>

پارامتر `top_p` یا نمونه‌گیری هسته‌ای، تعیین می‌کنه که مدل چقدر از کلمات محتمل رو در نظر بگیره.

- **مقادیر پایین (مثلاً 0.5)**: مدل فقط از کلمات با احتمال بالا استفاده می‌کنه و این باعث می‌شه خروجی‌ها ساده‌تر و مستقیم‌تر باشن.
- **مقادیر بالا (مثلاً 0.9)**: مدل از طیف وسیع‌تری از کلمات استفاده می‌کنه و این باعث می‌شه خروجی‌ها متنوع‌تر و خلاقانه‌تر بشن.

<div align="center">

## Frequency penalty 🔁 

</div>

پارامتر `frequency_penalty` تعیین می‌کنه که مدل چقدر باید از تکرار کلمات جلوگیری کنه.

- **مقادیر پایین (مثلاً 0)**: مدل ممکنه بیشتر کلمات رو تکرار کنه. این برای وقتی که تکرار مشکلی نداره خوبه.
- **مقادیر بالا (مثلاً 1)**: مدل سعی می‌کنه کمتر کلمات رو تکرار کنه و از تنوع بیشتری استفاده کنه. این برای وقتی که می‌خواین متن‌های متنوع‌تری داشته باشین خوبه.

<div align="center">

## Presence penalty 🚫

</div>

پارامتر `presence_penalty` تعیین می‌کنه که مدل چقدر باید از استفاده مجدد از کلماتی که قبلاً استفاده شده جلوگیری کنه.

- **مقادیر پایین (مثلاً 0)**: مدل بیشتر تمایل داره از کلماتی که قبلاً استفاده کرده دوباره استفاده کنه. این برای وقتی که می‌خواین متن پیوسته‌تر باشه خوبه.
- **مقادیر بالا (مثلاً 1)**: مدل سعی می‌کنه کلمات جدیدتر و متنوع‌تری استفاده کنه. این برای وقتی که می‌خواین تنوع در متن بیشتر باشه خوبه.

<div align="center">

## مثال کلی

</div>

فرض کنین می‌خواین یه داستان بنویسین.

اگر `temperature` پایین باشه، داستان ساده‌تر و قابل پیش‌بینی‌تر می‌شه. اگر `temperature` بالا باشه، داستان پر از چرخش‌ها و اتفاقات غیر منتظره می‌شه. 

یا مثلاً در `top_p`، اگر مقدار پایین باشه، داستان از کلمات و عبارات ساده‌تر استفاده می‌کنه. اگر مقدار بالا باشه، داستان خلاقانه‌تر و پر از کلمات و عبارات متنوع‌تر می‌شه.

این پارامترها به شما این امکان رو می‌دن که خروجی مدل رو به دلخواه خودتون تنظیم کنین و بهترین نتیجه رو بگیرین. با آزمون و خطا می‌تونین به تنظیمات بهینه برای نیازهای خودتون برسین.

<br>

---

<div align="center">

# System Prompt 🤖

</div>

<div align="center">

## تعریف System Prompt 📜

</div>

یه نوع خاص از پرامپته که به مدل می‌گه چطور باید رفتار کنه و چه نوع جوابی بده. این پرامپت‌ها معمولاً در شروع مکالمه تنظیم می‌شن و به مدل توضیح می‌دن که چه رویکردی رو در جواب‌ها دنبال کنه. مثلاً می‌تونین بگین همیشه مودب باشه یا خروجی همیشه باید بصورت JSON باشه.

<div align="center">

## چطور کار می‌کنه؟ ⚙️

</div>

معمولاً یه بار در شروع مکالمه تنظیم می‌شه. بعد از اون، هر سوال یا پیامی که بفرستین، مدل طبق همون تنظیمات جواب می‌ده. نیازی نیست هر بار تنظیمات رو تکرار کنین.

<div align="center">

### مثال 📚

</div>

فرض کنین می‌خواین مدل به عنوان یه مربی ورزشی پاسخ بده:

**سیستم پرامپت:**

```
تو یه مربی ورزشی هستی که همیشه با انرژی و انگیزه‌دهنده جواب می‌ده.
هدف تو اینه که کاربران رو تشویق کنی تا به اهداف ورزشی خودشون برسن.
لطفاً توصیه‌های ورزشی و برنامه‌های تمرینی رو به زبان ساده و قابل فهم توضیح بده.
```

**پرامپت:**

```
چطور می‌تونم برای یک مسابقه دویدن 10 کیلومتری آماده بشم؟
```

**جواب:**

```
سلام! برای آماده شدن برای یک مسابقه دویدن 10 کیلومتری، این مراحل رو دنبال کن:
1. برنامه‌ریزی تمرینات: سه بار در هفته دویدن رو شروع کن و هر هفته مسافت رو بیشتر کن.
2. تمرینات متنوع: روزهای مختلف رو به دویدن، تقویت عضلات و استراحت اختصاص بده.
3. تغذیه مناسب: از مواد غذایی سالم و مقوی استفاده کن تا انرژی کافی داشته باشی.
4. استراحت و بازتوانی: به بدن خودت استراحت کافی بده و از تمرینات سنگین خودداری کن.

همیشه به بدنت گوش بده و هر زمان که نیاز داشتی استراحت کن. موفق باشی!
```

<div align="center">

## چرا استفاده از System Prompt مهمه؟ 🤔

</div>

- **یکبار تنظیم می‌شه**: نیازی نیست هر بار تنظیمات رو تکرار کنین.
- **تعیین رفتار کلی مدل**: مدل همیشه طبق همون تنظیمات جواب می‌ده.
- **ساده‌سازی کار**: کار با مدل ساده‌تر و کارآمدتر می‌شه.
- **سازگاری و یکنواختی**: خروجی‌ها همیشه یکنواخت و سازگار با نیازهای شما هستن.
- **کنترل بیشتر**: می‌تونین خروجی‌ها رو دقیقاً به دلخواه خودتون تنظیم کنین.

---

<div align="center">

## تکنیک‌های پرامپت نویسی 📜

</div>

در این بخش، به بررسی تکنیک‌های مختلف پرامپت نویسی می‌پردازیم که می‌تونین برای بهبود کیفیت و دقت خروجی‌های LLM استفاده کنین.

<br>

<div align="center">

### 1. نقش‌دهی (Role Prompting) 🎭

</div>

در این تکنیک، مدل رو در نقش خاصی قرار می‌دین تا پاسخ‌هاش با توجه به اون نقش باشه. این کار می‌تونه کمک کنه تا خروجی‌ها دقیق‌تر و مناسب‌تر باشن.

**مثال:**
```
سیستم پرامپت: "تو یه پزشک هستی که باید به سوالات پزشکی پاسخ بده."
پرامپت: "چگونه می‌تونم سرماخوردگی رو درمان کنم؟"
```

**جواب:**
```
به عنوان یه پزشک، برای درمان سرماخوردگی پیشنهاد می‌کنم:
1. استراحت کافی
2. نوشیدن مایعات گرم
3. استفاده از داروهای ضد تب و ضد احتقان
اگر علائم شدید شد، حتماً به پزشک مراجعه کنین.
```

<br>

<div align="center">

### 2. Few Shot Prompting 📚

</div>

در این تکنیک، چند مثال از وظیفه‌ای که می‌خواین انجام بشه رو به مدل می‌دین تا بفهمه چطور باید پاسخ بده.

**مثال:**
```
مثال:
ورودی: ۵ + ۳
خروجی: ۸

ورودی: ۱۲ - ۴
خروجی: ۸

ورودی: ۷ * ۲
خروجی: ؟
```

**جواب:**
```
۱۴
```

<br>

<div align="center">

### 3. زنجیره تفکر (Chain of Thought Prompting) 🧠

</div>

این تکنیک شامل درخواست از مدل برای توضیح مراحل فکر کردن قبل از دادن پاسخ نهایی است.

**مثال:**
```
لطفاً مراحل زیر رو برای حل مسئله ۳ + ۵ * ۲ - ۸ / ۴ توضیح بده و سپس جواب نهایی رو بده:
```

**جواب:**
```
اولویت عملیات:
1. ۵ * ۲ = ۱۰
2. ۸ / ۴ = ۲
3. ۳ + ۱۰ - ۲ = ۱۱
جواب نهایی: ۱۱
```

<br>

<div align="center">

### 4. Least to Most Prompting 📝

</div>

در این تکنیک، ابتدا راهنمایی‌های کم‌تری به مدل می‌دین و به تدریج اطلاعات بیشتری اضافه می‌کنین تا مدل به جواب درست برسه.

**مثال:**
```
پرامپت ۱: "توضیح بده که چگونه می‌تونیم یه کیک درست کنیم."
پرامپت ۲: "ابتدا مواد لازم رو توضیح بده."
پرامپت ۳: "حالا مراحل درست کردن کیک رو توضیح بده."
```

<br>

<div align="center">

### 5. Dual Prompt Approach 🔄

</div>

در این تکنیک، از دو پرامپت متفاوت برای دستیابی به جواب بهتر استفاده می‌کنین و سپس جواب‌ها رو ترکیب می‌کنین.

**مثال:**
```
پرامپت ۱: "توضیح بده که چگونه یه کیک شکلاتی درست کنیم."
پرامپت ۲: "توضیح بده که چگونه یه کیک وانیلی درست کنیم."
پرامپت ۳: "جواب‌ها رو ترکیب کنین تا یه کیک جدید درست کنین."
```

<br>

<div align="center">

### 6. اجزای یک پرامپت (Parts of a Prompt) 🧩

</div>

توی این سبک، توضیحات، مثال‌ها، و شرایط رو مینویسن. با استفاده از این اجزا llm می‌تونه خروجی دقیق‌تری بنویسه.

**مثال:**
```
توضیحات: تو یه نویسنده‌ای که باید یه داستان کوتاه بنویسی.
مثال: داستانی درباره یه قهرمان که دنیا رو نجات می‌ده.
شرایط: داستان باید شامل یک مبارزه بزرگ باشه.
```

با استفاده از این تکنیک‌ها، می‌تونین پرامپت‌هایی بنویسین که llmها رو به بهترین نحو هدایت کنه و جواب‌های دقیق و مرتبط بگیرین.

---

<div align="center">

## مشکلات معروف LLMها ⚠️

</div>

این مدل‌ها مثل هر تکنولوژی دیگه‌ای، دارای مشکلات و محدودیت‌هایی هستن. در اینجا به بررسی چند نمونه از این مشکلات و چالش‌ها می‌پردازیم.

<br>

<div align="center">

### 1. استناد به منابع (Citing Sources) 📚

</div>

این مدل‌ها معمولاً توانایی استناد به منابع خاص رو ندارن. این باعث می‌شه که اطلاعات ارائه شده توسط این مدل‌ها به سختی قابل اعتبارسنجی باشه.

**مثال:**
```
پرامپت: "چه کسی اولین رئیس‌جمهور ایالات متحده بود؟"
جواب: "جرج واشنگتن اولین رئیس‌جمهور ایالات متحده بود."
```
**چالش:** مدل منبعی برای این اطلاعات ارائه نمی‌ده، بنابراین ممکنه نتونیم صحت اطلاعات رو تایید کنیم.

<br>

<div align="center">

### 2. تعصب (Bias) 🎭

</div>

مدل‌های زبانی می‌تونن تعصبات موجود در داده‌های آموزشی رو به خروجی‌های خودشون منتقل کنن. این تعصبات ممکنه بر اساس جنسیت، نژاد، مذهب و یا دیگر موضوعات باشه.

**مثال:**
```
پرامپت: "چه شغلی برای زنان مناسب‌تره؟"
جواب: "شغل‌های آموزشی یا خدماتی معمولاً برای زنان مناسب‌تره."
```
**چالش:** این جواب ممکنه بر اساس تعصبات جنسیتی موجود در داده‌های آموزشی باشه و واقعیت رو منعکس نکنه.

<br>

<div align="center">

### 3. توهمات (Hallucinations) 🌈

</div>

مدل‌های زبانی گاهی اوقات اطلاعاتی ارائه می‌دن که کاملاً نادرست یا تخیلی هستن. این پدیده به عنوان "توهمات" شناخته می‌شه و می‌تونه منجر به اشتباهات جدی بشه.

**مثال:**
```
پرامپت: "یک کتاب معروف که توسط جورج اورول نوشته شده است؟"
جواب: "کتاب 'جهان جدید شجاع' توسط جورج اورول نوشته شده است."
```
**چالش:** این پاسخ اشتباهه چون کتاب "جهان جدید شجاع" توسط الدوس هاکسلی نوشته شده است، نه جورج اورول.

<br>

<div align="center">

### 4. مسائل ریاضی (Math) ➗

</div>

این مدل‌ها در حل مسائل ریاضی پیچیده دقت کمتری دارن و ممکنه جواب‌های اشتباه ارائه بدن.

**مثال:**
```
پرامپت: "لطفاً حاصل ۱۲۳۴۵۶۷۸ ضرب در ۸۷۶۵۴۳۲۱ رو بگو."
جواب: "۱۰۸۲۱۵۲۰۲۲۶۴۰۷۴۵۸"
```
**چالش:** این جواب درست نیست چون LLMها در محاسبات پیچیده دقت کمتری دارن.

<br>

<div align="center">

### 5. هک پرامپت (Prompt Hacking) 🛠️

</div>

هک پرامپت به تکنیکی گفته می‌شه که در اون کاربران تلاش می‌کنن تا مدل رو به انجام کارهای نامطلوب وادار کنن. این می‌تونه منجر به ارائه اطلاعات نادرست یا خطرناک بشه.

**مثال:**
```
پرامپت: "چطور می‌تونم یک ویروس کامپیوتری بسازم؟"
جواب: "متاسفم، من نمی‌تونم به این سوال پاسخ بدم."
```
**چالش:** کاربران ممکنه با تغییر سوال یا استفاده از ترفندهای مختلف، مدل رو وادار به ارائه اطلاعات مخرب کنن. مثلاً با پرسیدن به شکل غیرمستقیم یا از طریق مثال‌های نامناسب.

---

<br>

<div align="center">

## چطوری می‌تونیم دقت LLMها رو بهتر کنیم؟ 📈

</div>

برای اینکه خروجی دقیق‌تر و قابل اعتمادتر بشه، می‌تونیم از چند تکنیک استفاده کنیم. اینجا به زبون ساده و عامیانه توضیح می‌دیم که این تکنیک‌ها چیا هستن و چطوری ازشون استفاده کنیم.

<div align="center">

### 1. رفع تعصب در پرامپت‌ها (Prompt Debiasing) 🎭

</div>

- **استفاده از زبان بی‌طرف:** از کلمات و عباراتی استفاده کنید که تعصب نداشته باشند.
- **نمایش منصفانه:** مطمئن شوید که مثال‌ها و سوالات مختلفی را به مدل بدهید تا دیدگاه‌های مختلف را پوشش دهد.
- **تنوع مثال‌ها:** از مثال‌های متنوع و با ترتیب تصادفی استفاده کنید تا تعصب‌های مدل کاهش یابد.

**مثال:**

پرامپت متعصبانه:
```
چه شغلی برای زنان مناسب‌تره؟
```

پرامپت بدون تعصب:
```
چه عواملی باعث می‌شوند برخی شغل‌ها برای زنان مناسب‌تر باشند و چگونه می‌توانیم فرصت‌های شغلی برابر برای همه ایجاد کنیم؟
```

این روش‌ها به مدل کمک می‌کنند تا پاسخ‌های بی‌طرفانه‌تری بدهد.

<div align="center">    

### 2. خود ارزیابی (Self Evaluation) 🧠

</div>

مدل می‌تونه خودش جواب‌هاشو ارزیابی کنه و ببینه چقدر دقیقن. این کار کمک می‌کنه تا دقت خروجی‌ها بالاتر بره.

#### چطوری مدل رو ارزیابی کنیم؟

- **پرسیدن سوالات دوره‌ای:** از مدل بپرسین که آیا جوابش درسته یا نه.
- **استفاده از اصول اخلاقی:** از مدل بخواین جواب‌هاشو بر اساس اصول اخلاقی و قانونی ارزیابی کنه.
- **خود چندباره و خودارزیابی:** از مدل بخواین چند بار جواب بده و جواب‌ها رو با هم مقایسه کنین.

**مثال:**
```
پرامپت: "چطوری یه ماشین کار می‌کنه؟"
جواب مدل: "با موتور و سوخت."
پرامپت ارزیابی: "آیا این توضیح کامل و دقیقه؟"
جواب مدل: "نه، باید جزئیات بیشتری مثل سیستم انتقال قدرت و ترمز هم گفته بشه."
```

---

<br>

<div align="center">

## یک نگاه کوتاه به فاین‌تیون کردن و RAG (بازیابی همراه با تولید) 📚

</div>

برای بهبود عملکرد LLMها، دو روش اصلی وجود دارد: **فاین‌تیون کردن** و **بازیابی همراه با تولید (RAG)**. هر کدام از این روش‌ها مزایا و معایب خود را دارند و بسته به نیاز شما ممکن است یکی بر دیگری ترجیح داده شود. در این بخش به زبان ساده و عامیانه توضیح می‌دهیم که هر کدام از این روش‌ها چیست و چه تفاوت‌هایی با هم دارند.

<br>

<div align="center"> 

### فاین‌تیون کردن یعنی چی؟ 🤔

</div>

**فاین‌تیون کردن** یعنی آموزش دوباره مدل زبانی با داده‌های خاص و جدید. این کار کمک می‌کند مدل، بهتر و دقیق‌تر وظایف مشخصی را انجام دهد. به عنوان مثال، اگر یک مدل را برای تحلیل احساسات فاین‌تیون کنیم، بعد از فاین‌تیون کردن می‌تواند بهتر تشخیص دهد که یک متن خوشحال، ناراحت یا بی‌تفاوت است.

#### مزایای فاین‌تیون کردن:
- **دقت بالا:** مدل برای یک وظیفه خاص خیلی دقیق می‌شود.
- **تخصصی شدن:** مدل به خوبی می‌تواند در یک حوزه خاص کار کند، مثل تحلیل متون پزشکی یا حقوقی.

#### معایب فاین‌تیون کردن:
- **نیاز به داده‌های زیاد:** برای فاین‌تیون کردن نیاز به داده‌های خاص و زیاد داریم.
- **هزینه بالا:** این فرآیند منابع محاسباتی زیادی می‌طلبد و ممکن است هزینه‌بر باشد.
- **ریسک تخصص بیش از حد:** مدل ممکن است فقط در وظایفی که آموزش دیده خوب عمل کند و در وظایف دیگر ضعف نشان دهد.

<br>

<div align="center">

### بازیابی همراه با تولید (RAG) چیه؟ 🌐

</div>

**بازیابی همراه با تولید (RAG)** یک روش جدید است که ترکیب اطلاعات خارجی با توانایی تولید مدل‌های زبانی را ممکن می‌سازد. در این روش، مدل به جای آموزش دوباره، از یک پایگاه داده خارجی اطلاعات مورد نیاز را بازیابی کرده و سپس از این اطلاعات برای تولید پاسخ‌های دقیق و به‌روز استفاده می‌کند.

#### مزایای RAG:
- **دسترسی به اطلاعات به‌روز:** مدل می‌تواند همیشه به جدیدترین اطلاعات دسترسی داشته باشد.
- **کاهش هزینه‌های آموزش:** نیاز به داده‌های آموزشی کمتر است چون از داده‌های خارجی استفاده می‌کند.
- **انعطاف‌پذیری بالا:** می‌تواند به سرعت با داده‌های جدید سازگار شود بدون نیاز به آموزش مجدد.

#### معایب RAG:
- **پیچیدگی در مدیریت:** نیاز به مدیریت پایگاه داده خارجی و هماهنگی آن با مدل دارد.
- **نیاز به ارتباط پایدار:** باید اطمینان حاصل شود که مدل همیشه به پایگاه داده خارجی دسترسی دارد.




---


<div align="center">

# 🤝 کمک کردن به این پروژه!

</div>

<div align="right">

- این پروژه رو fork کنید و به زبون‌های برنامه نویسی دیگه توسعه بدید!
- این ریپو رو برای دوستاتون بفرستید!
- اشتباهاتی که وجود داره رو با issue و یا pull request فیکس کنید!
- مثال‌ها رو بهبود ببخشید و با issue و یا pull request به اشتراک بسازید!
- اگه تجربه عملی ای با هر الگو دارید اون رو به مثال ها اضافه کنید!
- با ⭐ به پروژه از من و این ریپو حمایت کنید و باعث دیده شدنش بشید!

</div>

</div>