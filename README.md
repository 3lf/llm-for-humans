<div dir="rtl">

<div align="center">

# این ریپو همیشه در حال آپدیت شدنه؛ اگه دوست دارید از تغییرات باخبر بشید، دکمه Watch رو بزنید!

</div>

<br>

<div align="center">

# مقدمه 📚

</div>

حدود دو سال پیش حس کردم منابع فارسی زیادی برای یادگیری دیزاین پترن‌ها وجود نداره. برای همین یه ریپو ساختم به اسم [دیزاین پترن به زبان آدمیزاد](https://github.com/3lf/design-patterns-for-humans) که خداروشکر استقبال خوبی هم ازش شد.

حالا با رشد LLMها و تاثیر زیادی که روی کارهای مختلف گذاشتن، فکر کردم وقتش رسیده یه ریپوی دیگه درست کنم تا روش‌های استفاده از این مدل‌های زبانی رو ساده و روشن توضیح بدم. از نحوه‌ی نوشتن پرامپت گرفته تا کلی نکته و ترفند جذاب که میتونه حسابی بهتون کمک کنه.

---

<div align="center">

# مدل‌های زبانی بزرگ (LLM) 🤖

</div>

مدل‌های زبانی بزرگ، که بهشون **LLM** (مخفف **Large Language Model**) گفته می‌شه، سیستم‌های هوشمندی هستن که با حجم زیادی از داده‌ها آموزش دیدن تا بتونن متن، تصویر و صدا رو پردازش کنن، بفهمن و تولید کنن.

**چی کار می‌تونن بکنن؟**  
این مدل‌ها می‌تونن:
- متن بنویسن و خلاصه کنن ✅  
- به سوالات جواب بدن ✅  
- ترجمه کنن ✅  
- گفتگو کنن ✅  
- تحلیل داده انجام بدن ✅  
- کدنویسی کنن ✅  
- و حتی تصویر و صدا بسازن! ✅  

به طور خلاصه، **LLM یه مدل هوشمنده که می‌تونه اطلاعات رو پردازش کنه و خروجی متناسب تولید کنه**.  

هرچقدر ورودی (پرامپت) دقیق‌تر باشه، خروجی هم بهتر می‌شه. برای همین، اگه بخوای نتیجه‌ی خوبی بگیری، باید **پرامپت‌نویسی** بلد باشی و بدونی چطور درخواستت رو به مدل بگی.  

---

<div align="center">

# پرامپت‌نویسی ✍️

</div>

پرامپت همون متنیه که شما به یه **LLM** می‌دین تا بر اساسش خروجی تولید کنه. این متن می‌تونه یه سؤال، دستور، توضیح یا هر نوع درخواست دیگه باشه که مدل باید بهش پاسخ بده. **هرچی پرامپت واضح‌تر و دقیق‌تر باشه، جواب بهتری هم می‌گیرین.**  

---

<div align="center">

## چطور یه پرامپت خوب بنویسیم؟ 🏗

</div>

برای گرفتن یه **پاسخ دقیق و کاربردی**، بهتره پرامپت شما این ویژگی‌ها رو داشته باشه:  

✅ **مشخص و شفاف باشه** (از کلی‌گویی پرهیز کن)  
✅ **زمینه و محدودیت‌ها رو مشخص کنه** (مثل لحن، فرمت خروجی یا طول جواب)  
✅ **مثال یا جزئیات بیشتری داشته باشه** (برای درک بهتر مدل)  
✅ **از جملات ساده و مستقیم استفاده کن تا مدل گیج نشه**  

---

<div align="center">

## نمونه‌ای از یک پرامپت خوب 🌍

</div>

### 🎯 مثال: نوشتن یه ایمیل رسمی برای درخواست مرخصی  

**📝 پرامپت:**  
«یه ایمیل رسمی برای درخواست مرخصی سه روزه بنویس که دلیل مرخصی رو هم توضیح بده. ایمیل مودبانه و حرفه‌ای باشه.»  

**💡 جواب LLM:**  

```
موضوع: درخواست مرخصی  

سلام [نام مدیر] عزیز،  
امیدوارم حالتون خوب باشه. من قصد دارم از تاریخ [تاریخ شروع] تا [تاریخ پایان] به دلیل [دلیل مرخصی] مرخصی بگیرم.  
ممنون می‌شم اگه درخواست من رو بررسی کنین و اطلاع بدین.  

با احترام،  
[نام شما]
```

---

<br>

<div align="center">

# چطور یه پرامپت قوی‌تر بنویسیم؟ 🚀

</div>

وقتی با یه **LLM** کار می‌کنیم، **وضوح** و **دقت** پرامپت خیلی مهمه. توی این متن، چند نکته‌ی کلیدی آورده شده که می‌تونه بهت کمک کنه **جواب‌های بهتر** و **دقیق‌تری** بگیری.

---

<br>

<div align="center">

## 1. استفاده از مرزها برای تفکیک داده‌ها از پرامپت ✂️

</div>

گاهی لازمه **داده‌ها و دستورات** رو از هم جدا کنیم تا مدل بهتر متوجه بشه. روش‌های مختلفی وجود داره:

**الف) استفاده از بلاک‌کد (` ``` `) برای مشخص کردن داده‌ها**  
````markdown
لطفاً یک بیوگرافی کوتاه برای این شخص بنویس:

```
اسم: Ali
سن: 25
```
````

**ب) استفاده از تگ‌های HTML**  
```html
لطفاً یک بیوگرافی کوتاه برای این شخص بنویس:
<data>
    اسم: Ali
    سن: 25
</data>
```


**چرا مهمه؟**  
- مدل می‌فهمه کدوم بخش «داده» و کدوم بخش «درخواست» یا «دستور»ه.  
- باعث می‌شه جواب دقیق‌تر و منسجم‌تری بگیری.

---

<br>

<div align="center">

## 2. درخواست خروجی ساختاریافته 🗂️

</div>

وقتی می‌خوای جواب مدل رو بعداً پردازش کنی یا به فرمی مشخص نیاز داری، **ساختار خروجی** رو دقیق تعیین کن.  

**مثال: دریافت JSON**  
````markdown
لطفاً اطلاعات زیر رو به صورت JSON با کلیدهای `name` و `age` خروجی بده:

```
اسم: Ali
سن: 25
```
````

**پاسخ احتمالی مدل:**  
<div dir="ltr">

```json
{
  "name": "Ali",
  "age": 25
}
```
</div>

**چرا مفیده؟**  
- خروجی **یکنواخت و استاندارد** داری.  
- داده‌ها رو می‌تونی راحت توی برنامه، دیتابیس یا هر جای دیگه پردازش کنی.

---

<br>

<div align="center">

## 3. اضافه کردن اطلاعات سبک برای تغییر لحن خروجی 🎨

</div>

اگه مدل باید **با لحن خاصی** جواب بده—مثلاً دوستانه، رسمی یا طنزآمیز—حتماً توی پرامپت ذکر کن.  

**مثال:**  
```
با لحنی ساده و دوستانه توضیح بده که چطور یه کیک شکلاتی درست کنیم.
```

**نتیجه؟**  
- مدل از کلماتی استفاده می‌کنه که **حس و حال دوستانه** رو منتقل می‌کنن.  
- می‌تونی حتی بگی «مثل یه سرآشپز حرفه‌ای توضیح بده» یا «مثل یه معلم مدرسه بیان کن».  

---

<br>

<div align="center">

## 4. دادن شرایط به مدل و درخواست بررسی آن‌ها ✅

</div>

اگه نیاز داری مدل **چک کنه که فلان شرط درسته یا نه**، حتماً توی پرامپت این شرط‌ها رو روشن کن.  

**مثال:**  
```
اگر سن کاربر بالای ۱۸ سال است و کاربر دارای گواهینامه رانندگی است، لطفاً بنویس که او مجاز به رانندگی است.

سن: ۲۵
گواهینامه: بله
```

**جواب:**  
```
بله، کاربر مجاز به رانندگی است.
```

**فواید؟**  
- مدل **منطق ساده** رو به‌خوبی اجرا می‌کنه.  
- خروجی بهتر و هدفمندتر می‌شه.

---

<br>

<div align="center">

## 5. دادن مثال‌های موفق از انجام وظایف و سپس درخواست 🚀

</div>

اگه مدل **الگوی چند جواب خوب** رو ببینه، می‌تونه **بهتر** از عهده‌ی وظیفه بربیاد. این روش رو مخصوصاً توی مسائل محاسباتی یا طبقه‌بندی امتحان کن.

**مثال:**  
```
مثال:
ورودی: ۵ + ۳
خروجی: ۸

ورودی: ۱۲ - ۴
خروجی: ۸

لطفاً ۷ * ۲ رو محاسبه کن.
```
- مدل می‌بینه که چطور ورودی و خروجی رو تطبیق دادی و **جواب به‌همین شکل** می‌ده.

---

<br>

<div align="center">

## 6. درخواست از مدل برای حل مسئله قبل از دادن جواب 🧩

</div>

گاهی می‌خوای بدونی **فرآیند حل** چیه، نه صرفاً جواب نهایی. از مدل بخواه اول مسئله رو **مرحله‌به‌مرحله** حل کنه.

**مثال:**  
```
لطفاً ابتدا مسئله زیر رو قدم‌به‌قدم حل کن و سپس جواب نهایی رو بنویس:
۳ + ۵ * ۲ - ۸ / ۴ = ؟
```

**چرا خوبه؟**  
- اگه مدل اشتباه کنه، می‌تونی **از روی مراحل بفهمی** مشکل کجاست.  
- گاهی هم می‌خوای خروجی نهایی رو به شکل کاملاً مستدل تحویل بگیری.

---

<br>

<div align="center">

## 7. تکرار و بهبود پرامپت‌ها 🔄

</div>

حتی **بهترین پرامپت‌ها** هم ممکنه **بار اول** نتیجه ایدئال ندن. پس:

1. **پرامپت اولیه** رو بنویس و امتحان کن.  
2. **جواب رو بررسی کن:**  
   - اگه ناقصه یا گیج‌کننده، پرامپت رو واضح‌تر کن.  
   - اگه زیادی تخصصی شده، لحنش رو ساده کن.  
3. **چند بار تست و تغییرش بده** تا مدل بهترین جواب رو بده.

---

<br>

<div align="center">

### جمع‌بندی نهایی ✨

</div>

با رعایت این نکات، می‌تونی پرامپت‌هایی بسازی که **مدل رو به بهترین نحو هدایت** کنه و جواب‌های **دقیق، مرتبط و قابل‌استفاده** بگیری:

- **مرزبندی داده‌ها** (مثل بلاک‌کد و نشانه‌های واضح)  
- **درخواست خروجی ساختاریافته** (JSON یا HTML)  
- **تعیین لحن و سبک** (دوستانه، رسمی و غیره)  
- **ارائه شرایط** برای جواب‌های مشروط  
- **دادن مثال‌های موفق** پیش از درخواست اصلی  
- **درخواست حل مرحله‌به‌مرحله** برای شفافیت در جواب  
- **تست و تکرار** برای بهبود پرامپت‌ها  



---

<br>

<div align="center">

# پارامترهای مهم در کار با LLMها ⚙️

</div>

وقتی از مدل‌های زبانی (**LLM**) استفاده می‌کنین، چندتا پارامتر هست که اگه درست تنظیم بشن، خروجی خیلی بهتر می‌شه. اینجا خیلی ساده و کوتاه این پارامترها رو معرفی کردم:

---

<div align="center">

### ۱. Temperature (خلاقیت) 🌡️

</div>

پارامتر `temperature` تعیین می‌کنه خروجی چقدر خلاق یا تصادفی باشه:

- **عدد کم** (`0.2`): جواب‌ها دقیق، ساده و قابل پیش‌بینی
- **عدد زیاد** (`0.8`): جواب‌ها خلاق، متنوع و غیرمنتظره

> **پیش‌فرض:** معمولاً روی `1` تنظیم شده.

**مثال:**

```
یه اسم خلاقانه برای کافی‌شاپ پیشنهاد بده. (temperature=0.8)
```

---

<div align="center">

### ۲. Top-p (تنوع کلمات) 🎲

</div>

پارامتر `top_p` (یا Nucleus Sampling) تعیین می‌کنه مدل چند درصد از محتمل‌ترین کلمات رو در نظر بگیره:

- **عدد کم** (`0.3`): فقط کلمات رایج‌تر استفاده می‌شن.
- **عدد زیاد** (`0.9`): کلمات متنوع‌تر و کمتر قابل پیش‌بینی استفاده می‌شن.

> **پیش‌فرض:** معمولاً `1` هست.

**مثال:**

```
سه جمله مختلف برای شروع ایمیل بنویس. (top_p=0.9)
```

---

<div align="center">

### ۳. Frequency Penalty (جلوگیری از تکرار کلمه) 🔄

</div>

پارامتر `frequency_penalty` تعیین می‌کنه مدل چقدر از تکرار یه کلمه خاص دوری کنه:

- **عدد کم** (`0`): مدل آزادانه کلمات رو تکرار می‌کنه.
- **عدد زیاد** (`1`): مدل سعی می‌کنه از کلمات متنوع‌تر استفاده کنه.

> **پیش‌فرض:** معمولاً `0` هست.

**مثال:**

```
یه توضیح کوتاه بنویس که کمتر از کلمات تکراری استفاده کنه. (frequency_penalty=0.7)
```

---

<div align="center">

### ۴. Presence Penalty (جلوگیری از تکرار موضوع) 🚫

</div>

پارامتر `presence_penalty` باعث می‌شه مدل از تکرار موضوعات یا مفاهیم جلوگیری کنه:

- **عدد کم** (`0`): مدل می‌تونه موضوعات رو تکرار کنه.
- **عدد زیاد** (`1`): مدل موضوعات جدیدتر و متنوع‌تر انتخاب می‌کنه.

> **پیش‌فرض:** معمولاً `0` هست.

**مثال:**

```
یه متن کوتاه بنویس که درباره موضوعات متنوعی صحبت کنه. (presence_penalty=0.8)
```

---

<div align="center">

### 🤔 فرق این پارامترها چیه؟

</div>

- مقدار **Temperature:** خلاقیت یا سادگیِ خروجی رو کنترل می‌کنه.
- مقدار **Top-p:** تنوع کلماتی که مدل می‌تونه انتخاب کنه رو مشخص می‌کنه.
- مقدار **Frequency Penalty:** تکرارِ خود کلمات رو کاهش می‌ده.
- مقدار **Presence Penalty:** باعث می‌شه مدل سراغ ایده‌ها و موضوعات جدیدتری بره.

---

<div align="center">

### مثال کلی 📌

</div>

فرض کن می‌خوای یه داستان کوتاه بنویسی:

```
لطفاً یه داستان کوتاه بنویس که:
- خلاق باشه. (temperature=0.8)
- از کلمات متنوع استفاده کنه. (top_p=0.9)
- از تکرار کلمه‌ها دوری کنه. (frequency_penalty=0.5)
- از ایده‌های جدید استفاده کنه. (presence_penalty=0.5)
```

> با تغییر این مقادیر می‌تونی خروجی مدل رو بهتر کنی.

---

<div align="center">

## 🔄 آزمون و خطا یادت نره!

</div>

بهترین تنظیمات، تنظیماتیه که با چند بار امتحان کردن بهشون می‌رسی. پس نگران نباش و تست کن تا بهترین نتیجه رو بگیری.

---

<div align="center">

# System Prompt 🤖

</div>

<div align="center">

## تعریف System Prompt 📜

</div>

یه نوع خاص از پرامپته که به مدل می‌گه چطور باید رفتار کنه و چه نوع جوابی بده. این پرامپت‌ها معمولاً در شروع مکالمه تنظیم
می‌شن و به مدل توضیح می‌دن که چه رویکردی رو در جواب‌ها دنبال کنه. مثلاً می‌تونین بگین همیشه مودب باشه یا خروجی همیشه
باید بصورت JSON باشه.

<div align="center">

## چطور کار می‌کنه؟ ⚙️

</div>

معمولاً یه بار در شروع مکالمه تنظیم می‌شه. بعد از اون، هر سوال یا پیامی که بفرستین، مدل طبق همون تنظیمات جواب می‌ده.
نیازی نیست هر بار تنظیمات رو تکرار کنین.

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

در این بخش، به بررسی تکنیک‌های مختلف پرامپت نویسی می‌پردازیم که می‌تونین برای بهبود کیفیت و دقت خروجی‌های LLM استفاده
کنین.

<br>

<div align="center">

### 1. نقش‌دهی (Role Prompting) 🎭

</div>

در این تکنیک، مدل رو در نقش خاصی قرار می‌دین تا پاسخ‌هاش با توجه به اون نقش باشه. این کار می‌تونه کمک کنه تا خروجی‌ها
دقیق‌تر و مناسب‌تر باشن.

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

با استفاده از این تکنیک‌ها، می‌تونین پرامپت‌هایی بنویسین که llmها رو به بهترین نحو هدایت کنه و جواب‌های دقیق و مرتبط
بگیرین.

---

<div align="center">

## مشکلات معروف LLMها ⚠️

</div>

این مدل‌ها مثل هر تکنولوژی دیگه‌ای، دارای مشکلات و محدودیت‌هایی هستن. در اینجا به بررسی چند نمونه از این مشکلات و
چالش‌ها می‌پردازیم.

<br>

<div align="center">

### 1. استناد به منابع (Citing Sources) 📚

</div>

این مدل‌ها معمولاً توانایی استناد به منابع خاص رو ندارن. این باعث می‌شه که اطلاعات ارائه شده توسط این مدل‌ها به سختی
قابل اعتبارسنجی باشه.

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

مدل‌های زبانی می‌تونن تعصبات موجود در داده‌های آموزشی رو به خروجی‌های خودشون منتقل کنن. این تعصبات ممکنه بر اساس جنسیت،
نژاد، مذهب و یا دیگر موضوعات باشه.

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

مدل‌های زبانی گاهی اوقات اطلاعاتی ارائه می‌دن که کاملاً نادرست یا تخیلی هستن. این پدیده به عنوان "توهمات" شناخته می‌شه و
می‌تونه منجر به اشتباهات جدی بشه.

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

هک پرامپت به تکنیکی گفته می‌شه که در اون کاربران تلاش می‌کنن تا مدل رو به انجام کارهای نامطلوب وادار کنن. این می‌تونه
منجر به ارائه اطلاعات نادرست یا خطرناک بشه.

**مثال:**

```
پرامپت: "چطور می‌تونم یک ویروس کامپیوتری بسازم؟"
جواب: "متاسفم، من نمی‌تونم به این سوال پاسخ بدم."
```

**چالش:** کاربران ممکنه با تغییر سوال یا استفاده از ترفندهای مختلف، مدل رو وادار به ارائه اطلاعات مخرب کنن. مثلاً با
پرسیدن به شکل غیرمستقیم یا از طریق مثال‌های نامناسب.

---

<br>

<div align="center">

## چطوری می‌تونیم دقت LLMها رو بهتر کنیم؟ 📈

</div>

برای اینکه خروجی دقیق‌تر و قابل اعتمادتر بشه، می‌تونیم از چند تکنیک استفاده کنیم. اینجا به زبون ساده و عامیانه توضیح
می‌دیم که این تکنیک‌ها چیا هستن و چطوری ازشون استفاده کنیم.

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

برای بهبود عملکرد LLMها، دو روش اصلی وجود دارد: **فاین‌تیون کردن** و **بازیابی همراه با تولید (RAG)**. هر کدام از این
روش‌ها مزایا و معایب خود را دارند و بسته به نیاز شما ممکن است یکی بر دیگری ترجیح داده شود. در این بخش به زبان ساده و
عامیانه توضیح می‌دهیم که هر کدام از این روش‌ها چیست و چه تفاوت‌هایی با هم دارند.

<br>

<div align="center"> 

### فاین‌تیون کردن یعنی چی؟ 🤔

</div>

**فاین‌تیون کردن** یعنی آموزش دوباره مدل زبانی با داده‌های خاص و جدید. این کار کمک می‌کند مدل، بهتر و دقیق‌تر وظایف
مشخصی را انجام دهد. به عنوان مثال، اگر یک مدل را برای تحلیل احساسات فاین‌تیون کنیم، بعد از فاین‌تیون کردن می‌تواند بهتر
تشخیص دهد که یک متن خوشحال، ناراحت یا بی‌تفاوت است.

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

**بازیابی همراه با تولید (RAG)** یک روش جدید است که ترکیب اطلاعات خارجی با توانایی تولید مدل‌های زبانی را ممکن می‌سازد.
در این روش، مدل به جای آموزش دوباره، از یک پایگاه داده خارجی اطلاعات مورد نیاز را بازیابی کرده و سپس از این اطلاعات برای
تولید پاسخ‌های دقیق و به‌روز استفاده می‌کند.

#### مزایای RAG:

- **دسترسی به اطلاعات به‌روز:** مدل می‌تواند همیشه به جدیدترین اطلاعات دسترسی داشته باشد.
- **کاهش هزینه‌های آموزش:** نیاز به داده‌های آموزشی کمتر است چون از داده‌های خارجی استفاده می‌کند.
- **انعطاف‌پذیری بالا:** می‌تواند به سرعت با داده‌های جدید سازگار شود بدون نیاز به آموزش مجدد.

#### معایب RAG:

- **پیچیدگی در مدیریت:** نیاز به مدیریت پایگاه داده خارجی و هماهنگی آن با مدل دارد.
- **نیاز به ارتباط پایدار:** باید اطمینان حاصل شود که مدل همیشه به پایگاه داده خارجی دسترسی دارد.

---


<div align="center">

## دو روش ساخت پرامپت (با کمک ابزار ها) 🚀

</div>

در این بخش می‌خوایم دو تا از تجربه‌های شخصی رو با شما به اشتراک بذاریم که ممکنه وقتی این پیامو می‌خونید خیلی کاربردی
نباشه، ولی الان جواب می‌ده و خیلی خوبه.

<br>

### 1. استفاده از پرامپت‌های پرامپت‌ساز 🛠️

یکی از روش‌های کاربردی، استفاده از پرامپت‌هایی است که به خود مدل کمک می‌کنه تا پرامپت‌های بهتری بنویسه. به عبارت دیگه،
مدل رو به عنوان یک "پرامپت اینجینیر" به کار می‌گیریم تا بهترین پرامپت‌ها رو برای ما بسازه.

#### مثال:

```markdown
Your task is to function as a prompt engineer, which involves crafting detailed and clear prompts for a large language
model (LLM) such as ChatGPT. The aim is to enhance comprehension and interaction with the model. To do this effectively,
provide a well-structured and insightful prompt that guides the LLM in understanding the task at hand about TOPIC below.

This includes specifying the context, defining any technical terms, setting clear expectations for the output, and
including examples if necessary. Your goal is to ensure that the prompt is both informative and accessible, allowing the
LLM to generate responses that are accurate, relevant, and valuable to users. Consider the user's perspective and how
the prompt can facilitate a meaningful and efficient dialogue between the user and the LLM.
```

**چطوری کار می‌کنه؟**

1. کاربر این پرامپت رو به مدل می‌ده و بعد موضوعی که نیاز داره رو توضیح می‌ده.
2. مدل سعی می‌کنه یک پرامپت مناسب برای همون موضوع بنویسه.
3. کاربر می‌تونه با درخواست‌های بعدی، پرامپت رو بهبود بده و نتیجه بهتری بگیره.

این روش به شما کمک می‌کنه تا پرامپت‌های دقیق‌تر و کاربردی‌تری بنویسین و از توانایی‌های مدل به بهترین شکل استفاده کنین.

<br>

### 2. استفاده از وبسایت‌های پرامپت‌ساز و بهبوددهنده پرامپت 🌐

یکی دیگه از روش‌های کاربردی استفاده از وبسایت‌هایی است که به شما کمک می‌کنن تا پرامپت‌های بهتری بسازید و بهبود بدید. یکی
از این وبسایت‌ها، [promptsroyale.com](https://www.promptsroyale.com)  هست که اتفاقا یک پروژه رایگان و اپن سورس هست.

**چطوری کار می‌کنه؟**

1. شما توکن OpenAI خودتون رو وارد می‌کنید.
2. وبسایت از توضیحات شما استفاده می‌کنه و با کمک ChatGPT-4 (که الان قوی‌ترین مدل هست)، مثلا ده تا پرامپت مختلف می‌سازه (
   پیشنهاد سازنده ۱۰ تاست).
3. بعد با کمک همون ChatGPT-4، مثلا ۱۰ تا تست کیس (مثال‌هایی که بتونه کیفیت پرامپت رو بررسی کنه) می‌نویسه.
4. سپس یک سری بتل (جنگ) بین هر دو پرامپت برگزار می‌کنه و خروجی ها رو می‌گیره.
5. در نهایت، با کمک امتیازدهی (دوباره با کمک ChatGPT-4)، بهترین پرامپت‌ها رو به ترتیب کیفیت به شما تحویل می‌ده.

این روش کمک می‌کنه تا بدون نیاز به تلاش زیاد (ولی با یک هزینه معقول)، بهترین پرامپت‌ها رو برای نیازهای خودتون داشته
باشید و از خروجی‌های دقیق‌تر و کاربردی‌تری داشته باشین.


---

<div align="center">

## دسترسی رایگان به API برای استفاده از LLM ها 🌐

</div>

اگه به API رسمی مدل‌های زبانی بزرگ مثل OpenAI دسترسی نداری یا دنبال روش‌های رایگان هستی، اینجا دو تا روش ساده و کاربردی
رو معرفی می‌کنم که بهت کمک می‌کنه به راحتی از این مدل‌ها استفاده کنی. در فصل‌های بعدی می‌گم چطوری باید از این روش‌ها
استفاده کنی.

<br>


<div align="center">

### ۱. استفاده از API‌های آماده 🌍

</div>


خیلی از شرکت‌ها API‌های آماده دارن که می‌تونی راحت ازشون استفاده کنی. یکی از این
سایت‌ها [DeepInfra](https://deepinfra.com/) هست. فقط کافیه یه حساب رایگان بسازی و بعدش می‌تونی از API‌های اونا استفاده
کنی.


#### مراحل استفاده:

1. **ثبت‌نام:** برو به سایت DeepInfra و یه حساب کاربری بساز.
2. **دریافت API Key:** بعد از ثبت‌نام، API Key رو دریافت کن.
3. **استفاده از API:** حالا می‌تونی از مدل‌های زبانی مثل Qwen2 و Llama3 استفاده کنی. لینک مربوط به هر مدل رو از صفحه
   همون مدل در سایت بگیر.

<br>

<div align="center">

### ۲. استفاده از نرم‌افزارهایی مثل Ollama 🖥️

</div>


اگه دوست داری مدل‌ها رو به صورت محلی روی سیستم خودت اجرا کنی، می‌تونی از نرم‌افزارهایی مثل [Ollama](https://ollama.com/)
استفاده کنی. این نرم‌افزارها بهت اجازه می‌دن مدل‌های کوچیک‌تر رو روی سیستم خودت اجرا کنی.



#### مراحل استفاده از Ollama:


1. **دانلود و نصب:** نرم‌افزار Ollama رو دانلود و نصب کن.
2. **نصب و اجرا:** با دستور زیر مدل‌های مورد نظر رو نصب و اجرا کن:

<div align="left">

```
ollama pull gemma:2b ollama run gemma:2b
```

</div>


این دستورات مدل Gemma 2B رو دانلود و اجرا می‌کنن. می‌تونی مدل‌های دیگه‌ای رو هم به همین شکل نصب و اجرا کنی.

3. **استفاده از مدل:** حالا می‌تونی مدل‌ها رو به صورت محلی اجرا کنی و درخواست‌هات رو بهشون بفرستی.

برای استفاده از Ollama، می‌تونی به [مدل‌های پشتیبانی شده](https://ollama.com/models) سر بزنی و مدل مورد نظرت رو انتخاب و
دانلود کنی.

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
