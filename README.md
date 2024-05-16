<div dir="rtl">


<div align="center">

# مقدمه 📚

</div>

حدود دو سال پیش، حس کردم که منابع فارسی خوبی برای دیزاین پترن‌ها وجود نداره. پس یه ریپازیتوری گیت ساختم به اسم "دیزاین پترن به زبان آدمیزاد" که استقبال خوبی هم شد.

حالا با رشد LLMها و اهمیتشون در کارهای مختلف، فکر می‌کنم یه ریپازیتوری خوب می‌تونه کمک زیادی کنه تا از این مدل‌های زبانی به بهترین شکل استفاده کنین.

تو این ریپو، سعی می‌کنم به زبان آدمیزاد هر چی برای کار با LLMها نیاز دارین رو توضیح بدم. از نوشتن پرامپت گرفته تا نکات و ترفندهای کاربردی.

<br>

<div align="center">

## پشت‌پرده‌ی این ریپو 🎬

</div>

جالب اینجاست که حتی این ریپو هم با کمک LLMها ساخته شده. از نوشتن توضیحات تا ساختاردهی محتوا.


<br>

---

<div align="center">

# ال ال ام چیه؟ 🤖

</div>

بطور کلی LLM مخفف Large Language Model هست. این مدل‌ها با استفاده از حجم عظیمی از داده‌ها آموزش دیده می‌شن تا بتونن زبان طبیعی رو بفهمن و تولید کنن. LLMها می‌تونن متن بنویسن، سوالات رو جواب بدن، ترجمه کنن، و حتی گفتگو کنن.

به طور ساده، LLMها مثل یه آدم خیلی باهوش هستن که می‌تونن متن‌هایی که بهشون می‌دین رو بخونن و جواب بدن یا حتی خودشون متن تولید کنن. این مدل‌ها به دلیل استفاده از داده‌های زیاد و الگوریتم‌های پیچیده، توانایی بالایی دارن و تو خیلی از کارها می‌تونن کمک کنن.

برای استفاده از LLMها، باید بدونیم چطور پرامپت‌های خوبی بنویسیم تا بهترین نتیجه رو بگیریم. تو این ریپو یاد می‌گیرین چطور این کار رو انجام بدین.


<br>

---


<div align="center">

# پرامپت ✍️

</div>


پرامپت (Prompt) یه ورودی متنیه که شما به LLM می‌دین تا براساس اون، مدل یه خروجی تولید کنه. این ورودی می‌تونه سوال، دستور، یا هر نوع متن دیگه‌ای باشه که مدل باید بهش جواب بده.



<div align="center">

## چطور یه پرامپت خوب بنویسیم؟ 

</div>

یه پرامپت خوب باید واضح، دقیق و شامل اطلاعات کافی باشه. ابهام نداشته باشه و مدل رو به سمت جواب درست هدایت کنه. پس:

1. **واضح باشین**: دقیق بگین چی می‌خواین.
2. **زمینه بدین**: اطلاعات لازم رو تو پرامپت بیارین.
3. **هدف رو مشخص کنین**: بگین چه نوع جوابی می‌خواین، مثلاً «یه توضیح کوتاه بده».
4. **نمونه بدین**: اگر جواب درست نیست، چند تا مثال بیارین.
5. **سوال روشن بپرسین**: سوالات رو واضح بپرسین تا مدل گیج نشه.



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

---

<div align="center">

# پارامترهای معروف در کار با LLMها ⚙️

</div>

برای اینکه از LLMها بهترین استفاده رو بکنیم، باید با چند تا از پارامترهای مهمشون آشنا باشیم. این پارامترها می‌تونن خروجی مدل رو تحت تأثیر قرار بدن. این پارامترها معمولاً در APIها استفاده می‌شن و در پلتفرم‌های آماده مثل OpenAI Chat نیاز به تنظیم ندارن. بریم سراغ چند تا از مهم‌ترین پارامترها:


<div align="center">

## Temperature 🌡️

</div>

`temperature` تعیین می‌کنه که خروجی مدل چقدر متنوع باشه. 

- **مقادیر پایین (مثلاً 0.2)**: خروجی مدل قابل پیش‌بینی‌تر و دقیق‌تر می‌شه. مدل کمتر ریسک می‌کنه و بیشتر جواب‌های محافظه‌کارانه می‌ده. مثلاً وقتی که می‌خواین جواب‌های ثابت و مطمئن بگیرین.
- **مقادیر بالا (مثلاً 0.8)**: خروجی مدل خلاقانه‌تر و متنوع‌تر می‌شه. مدل بیشتر ریسک می‌کنه و جواب‌های خلاقانه‌تر و غیر منتظره می‌ده. این برای زمانی خوبه که می‌خواین ایده‌های جدید یا جواب‌های غیر معمول بگیرین.


<div align="center">

## Top-p 🎯

</div>

`top_p` یا نمونه‌گیری هسته‌ای، تعیین می‌کنه که مدل چقدر از کلمات محتمل رو در نظر بگیره.

- **مقادیر پایین (مثلاً 0.5)**: مدل فقط از کلمات با احتمال بالا استفاده می‌کنه و این باعث می‌شه خروجی‌ها ساده‌تر و مستقیم‌تر باشن.
- **مقادیر بالا (مثلاً 0.9)**: مدل از طیف وسیع‌تری از کلمات استفاده می‌کنه و این باعث می‌شه خروجی‌ها متنوع‌تر و خلاقانه‌تر بشن.


<div align="center">

## Frequency penalty 🔁 

</div>

`frequency_penalty` تعیین می‌کنه که مدل چقدر باید از تکرار کلمات جلوگیری کنه.

- **مقادیر پایین (مثلاً 0)**: مدل ممکنه بیشتر کلمات رو تکرار کنه. این برای وقتی که تکرار مشکلی نداره خوبه.
- **مقادیر بالا (مثلاً 1)**: مدل سعی می‌کنه کمتر کلمات رو تکرار کنه و از تنوع بیشتری استفاده کنه. این برای وقتی که می‌خواین متن‌های متنوع‌تری داشته باشین خوبه.


<div align="center">

## Presence penalty 🚫

</div>


`presence_penalty` تعیین می‌کنه که مدل چقدر باید از استفاده مجدد از کلماتی که قبلاً استفاده شده جلوگیری کنه.

- **مقادیر پایین (مثلاً 0)**: مدل بیشتر تمایل داره از کلماتی که قبلاً استفاده کرده دوباره استفاده کنه. این برای وقتی که می‌خواین متن پیوسته‌تر باشه خوبه.
- **مقادیر بالا (مثلاً 1)**: مدل سعی می‌کنه کلمات جدیدتر و متنوع‌تری استفاده کنه. این برای وقتی که می‌خواین تنوع در متن بیشتر باشه خوبه.


<div align="center">

## مثال کلی

</div>


فرض کنین می‌خواین یه داستان بنویسین. اگر `temperature` پایین باشه، داستان ساده‌تر و قابل پیش‌بینی‌تر می‌شه. اگر `temperature` بالا باشه، داستان پر از چرخش‌ها و اتفاقات غیر منتظره می‌شه. 

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


یه نوع خاص از پرامپته که به مدل می‌گه چطور باید رفتار کنه و چه نوع جوابی بده. این پرامپت‌ها معمولاً در شروع مکالمه تنظیم می‌شن و به مدل توضیح می‌دن که چه رویکردی رو در جواب‌ها دنبال کنه. مثلاً می‌تونین بگین همیشه مودب باشه یا جواب‌ها رو ساده بده.

<div align="center">

## چطور کار می‌کنه؟ ⚙️

</div>


 معمولاً یه بار در شروع مکالمه تنظیم می‌شه. بعد از اون، هر سوال یا پیامی که بفرستین، مدل طبق همون تنظیمات جواب می‌ده. نیازی نیست هر بار تنظیمات رو تکرار کنین.

<div align="center">

### مثال 📚

</div>


فرض کنین می‌خواین مدل به عنوان یه مربی ورزشی پاسخ بده:

**System Prompt:**

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

## چرا مهمه؟ 🤔

</div>

استفاده از System Prompt مهمه چون:
- **یکبار تنظیم می‌شه**: نیازی نیست هر بار تنظیمات رو تکرار کنین.
- **تعیین رفتار کلی مدل**: مدل همیشه طبق همون تنظیمات جواب می‌ده.
- **ساده‌سازی کار**: کار با مدل ساده‌تر و کارآمدتر می‌شه.
- **سازگاری و یکنواختی**: خروجی‌ها همیشه یکنواخت و سازگار با نیازهای شما هستن.
- **کنترل بیشتر**: می‌تونین خروجی‌ها رو دقیقاً به دلخواه خودتون تنظیم کنین.


<div align="center">

## چطور استفاده کنیم؟ 🛠️

</div>

استفاده از System Prompt خیلی ساده‌ست. کافیه در شروع مکالمه براش سیستم پرامپت رو مشخص کنید. بعد از اون، هر تعداد پیام که بفرستین، مدل طبق همون تنظیمات جواب می‌ده.

جلوتر مثال های عملی از این موضوع میبینیم.


</div>