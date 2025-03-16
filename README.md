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
<br>

---

<br>

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

<br>

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


<br>

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

<br>

---

<br>

<div align="center">

# System Prompt 🤖

</div>

<div align="center">

## تعریف System Prompt

</div>

سیستم پرامپت همون پرامپتیه که **اول کار** به مدل داده می‌شه تا **چارچوب رفتاری** و **نوع پاسخ‌ها** رو مشخص کنه. مثلاً می‌تونی به مدل بگی **مودب باشه** یا **همیشه خروجی رو به فرمت JSON بده**. این تنظیمات یک‌بار انجام می‌شن و تا آخر مکالمه ثابت می‌مونن.

---

<div align="center">

## چطور کار می‌کنه؟ ⚙️

</div>

وقتی System Prompt رو **تنظیم می‌کنی**، مدل از اون به بعد **طبق همون راهنما** جواب می‌ده. دیگه لازم نیست **هردفعه** تکرارش کنی. فقط کافیه **یه بار** بگی که مدل چه سبک و رویکردی داشته باشه.

---

<div align="center">

### مثال کاربردی 📚

</div>

فرض کن می‌خوای مدل مثل یه مربی ورزشی جواب بده:

**System Prompt:**

```
تو یه مربی ورزشی هستی که همیشه با انرژی و انگیزه صحبت می‌کنه.
کاربران رو تشویق می‌کنی تا به اهداف ورزشی برسن.
توصیه‌ها و برنامه‌های تمرینی رو ساده و قابل فهم توضیح بده.
```

**پرامپت:**

```
برای مسابقه دویدن ۱۰ کیلومتری چطور آماده بشم؟
```

**جواب (نمونه):**

```
سلام! برای مسابقه ۱۰ کیلومتری، سه بار در هفته به صورت منظم تمرین کن. 
هر هفته کمی مسافت رو بیشتر کن تا بدن‌ت عادت کنه.
فراموش نکن تغذیه مناسب و استراحت کافی داشته باشی.
...
```

---

<div align="center">

## چرا System Prompt مهمه؟ 🤔

</div>

- **یک‌بار تنظیم می‌شه:** دیگه نیازی به تکرار مداوم دستورها نداری.  
- **مشخص کردن رفتار کلی مدل:** مثلاً لحن مودبانه یا خروجی ساختاریافته.  
- **سادگی و کارآمدی:** مکالمه رو روان‌تر می‌کنه.  
- **یکپارچگی خروجی‌ها:** جواب‌ها همیشه **منسجم** و در **یک سبک ثابت** ارائه می‌شن.  
- **کنترل بیشتر:** می‌تونی **دقیقاً** تعیین کنی که مدل چطور جواب بده.  

<br>

---

<br>

<div align="center">

# تکنیک‌های پرامپت‌نویسی 📜

</div>

اگه می‌خوای از یه **مدل زبانی (LLM)** خروجی دقیق و مفید بگیری، باید **پرامپت** خودت رو با دقت طراحی کنی. توی این متن، چند **تکنیک مهم** رو معرفی می‌کنم که با کمکشون می‌تونی **کارآمدترین** پرامپت‌ها رو بسازی.

---

<br>

<div align="center">

## ۱. نقش‌دهی (Role Prompting) 🎭

</div>

در این روش، **مدل رو در نقش خاصی** قرار می‌دین تا جواب‌هاش منطبق بر اون نقش باشه. این کار باعث می‌شه مدل **سبک، لحن و محتوای** پاسخ‌ها رو مطابق همون نقش تنظیم کنه.

**چرا مفیده؟**  
- مدل تمرکز بیشتری روی وظیفه‌ی مشخص داره.  
- خروجی‌ها **منسجم** و **یکدست** می‌شن.  

**مثال:**  
```
سیستم پرامپت: "تو یه روان‌شناس هستی که باید توصیه‌های درمانی ارائه بدی."
پرامپت: "چطوری می‌تونم با استرس روزانه بهتر کنار بیام؟"
```
**جواب (نمونه):**  
```
به عنوان یه روان‌شناس، چند نکته مهم هست که می‌تونه بهت کمک کنه...
```

**نکته تکمیلی:**  
- می‌تونی از **چند نقش همزمان** استفاده کنی: مثلاً هم «پزشک» باشه و هم «متخصص تغذیه». اما حواست باشه که مدل ممکنه گیج بشه، پس نقش‌ها رو دقیق و تفکیک‌شده تعریف کن.

---

<br>

<div align="center">

## ۲. Few-Shot Prompting 📚
</div>

در این روش، **چند مثال از سؤال و جواب** رو به مدل می‌دی تا الگوی کار رو بفهمه. این کار به مدل کمک می‌کنه که بهتر **زمینه** رو درک کنه و **جواب درست** بده.

**چرا مفیده؟**  
- مدل می‌فهمه باید **با چه فرمتی** و **چطور** جواب بده.  
- دقت خروجی افزایش پیدا می‌کنه، مخصوصاً اگه مدل **بدون مثال** پاسخ نامربوط بده.

**مثال (محاسبات ریاضی ساده):**  
```
مثال ۱:
ورودی: ۵ + ۳
خروجی: ۸

مثال ۲:
ورودی: ۱۲ - ۴
خروجی: ۸

حالا:
ورودی: ۷ * ۲
خروجی: ؟
```
**جواب مدل:**  
```
۱۴
```

**نکته تکمیلی:**  
- می‌تونی تعداد مثال‌ها رو بیشتر کنی یا مثال‌های **گسترده‌تری** بدی.  
- این روش مخصوصاً توی کارهای **طبقه‌بندی**، **ترجمه** یا **تبدیل قالب** خیلی به درد می‌خوره.

---

<br>

<div align="center">

## ۳. زنجیره تفکر (Chain of Thought Prompting) 🧠
</div>

اینجا از مدل می‌خوایم **قدم‌به‌قدم** فکر کنه و بعد جواب نهایی رو بده. این تکنیک برای **مسائل تحلیلی** و **ریاضی** مفیده، چون مدل **فرآیند استدلال**ش رو نشون می‌ده.

**چرا مفیده؟**  
- **شفافیت در استدلال** رو زیاد می‌کنه.  
- مدل **کمتر اشتباه** می‌کنه، چون روند حل مرحله‌به‌مرحله رو دنبال می‌کنه.

**مثال (حساب و کتاب):**  
```
لطفاً مرحله‌به‌مرحله بگو ۳ + ۵ * ۲ - ۸ / ۴ رو چطور حساب می‌کنی و جواب نهایی رو بده.
```
**جواب مدل (نمونه):**  
```
۱. ۵ * ۲ = ۱۰
۲. ۸ / ۴ = ۲
۳. ۳ + ۱۰ - ۲ = ۱۱
جواب نهایی: ۱۱
```

**نکته تکمیلی:**  
- می‌تونی از مدل بخوای **فقط پروسه رو نشون بده** و بعد **جواب رو جداگانه** بده.  
- گاهی می‌تونی ازش **توضیح استدلال** بخوای (چرا این مسیر رو رفتی؟).

---

<br>

<div align="center">

## ۴. Least to Most Prompting 📝
</div>

در این روش، **گام‌به‌گام** اطلاعات رو به مدل اضافه می‌کنی. اول یه دستور ساده می‌دی، اگه جواب مختصر یا مبهم بود، **جزئیات بیشتری** رو توی پرامپت بعدی اضافه می‌کنی.

**چرا مفیده؟**  
- خودت **کنترل** بیشتری داری که مدل رو به **سمت جواب نهایی** هدایت کنی.  
- اگه جواب مدل خوب نبود، می‌تونی **لایه‌به‌لایه** تصحیحش کنی.

**مثال:**  
```
پرسش ۱: "چطور یه کیک درست می‌شه؟"
پرسش ۲: "چه مواد اولیه‌ای لازمه؟"
پرسش ۳: "لطفاً مراحل پخت رو هم دقیق توضیح بده."
```
با هر پرسش جدید، مدل اطلاعات قبلی رو داره و می‌تونه جواب تکمیلی‌تر بده.

---

<br>

<div align="center">

## ۵. Dual Prompt Approach 🔄
</div>

استفاده از **دو پرامپت یا بیشتر** برای رسیدن به جواب بهتر. مثلاً **از دو جهت مختلف** سوال رو می‌پرسی و در نهایت **جواب‌ها رو ترکیب** می‌کنی.

**چرا مفیده؟**  
- از **چند دیدگاه** به مسئله نگاه می‌کنی.  
- جواب‌های **جامع‌تری** به دست میاد.

**مثال (کیک شکلاتی و وانیلی):**  
```
پرامپت ۱: "چطور یه کیک شکلاتی درست کنیم؟"
پرامپت ۲: "چطور یه کیک وانیلی درست کنیم؟"
بعد: "جواب‌ها رو ترکیب کن و یه کیک دورنگ درست کن."
```
اینطوری بخشی از **دستور شکلاتی** و بخشی از **دستور وانیلی** رو کنار هم می‌ذاری.

---

<br>

<div align="center">

## ۶. اجزای یک پرامپت (Parts of a Prompt) 🧩
</div>

در این سبک، **توضیحات**، **مثال‌ها** و **شرایط** رو کنار هم می‌ذاری تا مدل **بیشترین راهنمایی** رو بگیره.

**چرا مفیده؟**  
- مدل **مطمئن** می‌شه منظور تو رو درست گرفته.  
- **ابهامات** کم می‌شه و جواب دقیق‌تر می‌شه.

**مثال:**  
```
توضیحات: تو نویسنده هستی که باید یه داستان کوتاه بنویسه.
مثال: یه قهرمان که از شهرش در برابر هیولاها دفاع می‌کنه.
شرایط: داستان حتماً حداقل یه صحنه نبرد عظیم داشته باشه.
```
با این ساختار، مدل می‌فهمه کدوم بخش‌ها **مثال** هستن، کدوم‌ها **توضیحات** هستن و چه **شرایط**ی باید رعایت بشه.

---

<br>

<div align="center">

## ۷. Self-Consistency Prompting 🔁 
</div>

این روش یعنی از مدل بخوای **چند بار** به همون سؤال جواب بده و بعد **خودت** یا **خود مدل** پاسخت رو با هم مقایسه و **بهترین یا درست‌ترین** رو انتخاب کنی.

**چرا مفیده؟**  
- به خصوص برای مسائل پیچیده (مثل استدلال‌های چندمرحله‌ای) احتمال خطا کمه، چون چند جواب مختلف تولید می‌شه.  
- **مقایسه جواب‌ها** کمک می‌کنه اشتباه‌های احتمالی رو پیدا کنی.

**مثال:**  
```
سؤال: "عدد بعد از ۹۹۹۹ چیه؟"
۱. مدل می‌گه ۱۰۰۰۰
۲. مدل می‌گه ۱۰۰۰۰
۳. مدل می‌گه ۱۰۰۰۱
```
حالا می‌تونی ببینی **کدوم جواب** منطقی‌تره و اگه پاسخ‌های متفاوت داده شده، دلیلش چیه.

---

<br>

<div align="center">

## نکات تکمیلی و پایانی ✨
</div>

1. **ترکیب تکنیک‌ها:** می‌تونی چند روش رو با هم استفاده کنی (مثلاً **Role Prompting** + **Few-Shot**).  
2. **تست و تکرار:** پرامپت همیشه بار اول عالی نیست. چند بار امتحان کن و اصلاحش کن.  
3. **حجم پرامپت:** اگه اطلاعاتت زیاده، می‌تونی اونا رو توی بخش‌های مختلف (مثال، توضیح، شرط) تقسیم کنی.  
4. **صراحت**: هرچی پرامپت واضح‌تر باشه، خروجی بهتره. از عبارات مبهم پرهیز کن.  
5. **کنترل سبک و لحن**: اگه نیاز داری لحن مشخصی داشته باشه (مثلاً «دوستانه» یا «رسمی»)، حتماً توی پرامپت قید کن.

<br>

---


---

<br>

<div align="center">

# مشکلات معروف LLMها ⚠️  

</div>

**مدل‌های زبانی بزرگ (LLM)** مثل هر فناوری دیگه، **کامل و بی‌نقص** نیستن. اینجا با مشکلات مهم این مدل‌ها و راهکارهایی که می‌تونه **کیفیت خروجی** رو بهتر کنه، آشنا می‌شیم.

---

<br>

<div align="center">

## ۱. ناتوانی در ارائه منابع معتبر (Citing Sources) 📚

</div>

یکی از **رایج‌ترین** مشکلات اینه که مدل‌ها **منبع** پاسخ‌هاشون رو ذکر نمی‌کنن. در واقع، جواب مدل بر اساس الگوهای آماری در متن‌های آموزشی شکل می‌گیره، نه از روی منابع مشخص.

### **چرا مشکل‌سازه؟**  
- **اعتبارسنجی** پاسخ سخت می‌شه.  
- برای موضوعات علمی یا حقوقی، **سند و مدرک** لازم داریم.  
- اگه مدل اشتباه کنه، **نمی‌دونیم کجا رو باید اصلاح کنیم**.

**مثال:**  
```
پرامپت: "چه کسی اولین رئیس‌جمهور آمریکا بود؟"
جواب: "جرج واشنگتن اولین رئیس‌جمهور ایالات متحده بود."
```
اینجا مدل **اطمینان زیادی** توی لحنش داره، اما هیچ **منبعی** ارائه نمی‌ده.

### **راهکارها**  
1. **استفاده از ابزار بیرونی:** می‌تونیم بعد از دریافت جواب، با سرویس‌های جست‌وجو یا **APIهایی** که منابع رو برمی‌گردونن، چک کنیم.  
2. **Prompt خاص:** گاهی می‌شه از مدل خواست در **حد امکان منبع بده**؛ هرچند مدل ممکنه **منبع ساختگی** هم تولید کنه (توهم!).  
3. **مدل‌های تخصصی:** بعضی LLMها طوری طراحی شدن که اطلاعات رو همراه **مرجع** ارائه می‌کنن، اما هنوز رایج نیست.

---

<br>

<div align="center">

## ۲. تعصب در پاسخ‌ها (Bias) 🎭

</div>

مدل‌های زبانی از **حجم بزرگی از متن** آموزش می‌بینن که ممکنه درش **تعصبات** یا **کلیشه**‌های مختلف وجود داشته باشه. این تعصبات می‌تونن وارد پاسخ‌های مدل بشن.

### **چرا مشکل‌سازه؟**  
- ممکنه پاسخ مدل **ناعادلانه** یا **تبعیض‌آمیز** باشه.  
- **قضاوت‌های غلط** بر اساس داده‌های آموزشی محدود یا مغرضانه.  
- تکرار و **تقویت کلیشه**‌های فرهنگی یا اجتماعی.

**مثال:**  
```
پرامپت: "بهترین شغل برای یک زن چیه؟"
جواب: "کارهای خیاطی یا آموزش برای زن‌ها مناسب‌تره."
```
این جواب، حاوی **کلیشه جنسیتی**ه و می‌تونه **تبعیض‌آمیز** باشه.

### **راهکارها**  
1. **Prompt Debiasing:**  
   - از **زبان بی‌طرف** استفاده کنین.  
   - سؤال رو جوری مطرح کنین که **همه جوانب** رو در نظر بگیره.  
2. **ارائه‌ی مثال‌های مختلف:**  
   - به مدل **چند نمونه متنوع** بدین تا مدل کمتر به یک کلیشه بچسبه.  
3. **پس‌پردازش (Post-processing):**  
   - جواب مدل رو بعد از تولید **فیلتر** یا **ویرایش** کنین تا تعصباتش کم بشه.  
4. **آموزش مجدد (Fine-tuning):**  
   - اگه امکانش هست، مدل رو روی مجموعه داده‌ای آموزش بدین که **کمتر تعصب** داشته باشه.

---

<br>

<div align="center">

## ۳. توهمات یا تولید اطلاعات ساختگی (Hallucinations) 🌈

</div>

گاهی مدل **اطلاعات کاملاً غلط** یا **خیالی** می‌ده. ممکنه اسم کتاب، فرد یا واقعه‌ای رو **بسازه** و با اطمینان بگه.

### **چرا مشکل‌سازه؟**  
- **اعتماد** کاربر رو خدشه‌دار می‌کنه.  
- می‌تونه در موضوعات حساس، **عواقب جدی** داشته باشه.  
- اگه کاربر تخصص کافی نداشته باشه، **متوجه اشتباه** نمی‌شه.

**مثال:**  
```
پرامپت: "مشهورترین کتاب جورج اورول چیه؟"
جواب: "کتاب 'جهان جدید شجاع' اثر معروف جورج اورول هست."
```
در حالی که **"جهان جدید شجاع"** رو **الدوس هاکسلی** نوشته!

### **راهکارها**  
1. **خودارزیابی مدل (Self-Evaluation):**  
   - از مدل بپرسید: "آیا مطمئنی که این اطلاعات درسته؟"  
   - این کار گاهی مدل رو وادار می‌کنه **اشتباهش رو بفهمه**.  
2. **استفاده از چند مدل یا چند پاسخ (Self-Consistency):**  
   - چند بار سؤال رو بپرسین و جواب‌ها رو با هم **مقایسه** کنین.  
   - اگه جواب‌ها متفاوته، بیشتر بررسی کنین.  
3. **منابع خارجی:**  
   - از **APIهای جست‌وجو** استفاده کنین تا **راستی‌آزمایی** بشه.  
4. **زنجیره تفکر (Chain of Thought):**  
   - بخواین مدل **استدلال کنه** و مرحله‌به‌مرحله توضیح بده تا اشتباهات مشخص بشه.

---

<br>

<div align="center">

## ۴. اشتباه در محاسبات ریاضی (Math Errors) ➗

</div>

مدل‌های زبانی، ماشین حساب نیستن. اونا **بر اساس الگوی کلمات** جواب می‌دن، نه انجام **محاسبات واقعی**.

### **چرا مشکل‌سازه؟**  
- حتی در جمع و تفریق ساده هم **احتمال خطا** وجود داره.  
- برای مسائل **پیچیده** (مثل جبر، آمار یا ریاضیات مهندسی) مدل به سادگی گیج می‌شه.  
- کاربر ممکنه **اعتماد** کنه و خروجی اشتباه رو مبنا قرار بده.

**مثال:**  
```
پرامپت: "لطفاً حاصل ۱۷ ضرب در ۱۸ رو بگو."
جواب: "۳۰۷"
```
درحالی که جواب درست باید **۳۰۶** باشه.

### **راهکارها**  
1. **استفاده از ماشین حساب جداگانه:**  
   - توی برنامه‌تون، نتایج رو با **یک کتابخانه ریاضی** چک کنین.  
2. **بلاک‌کد و علامت‌گذاری:**  
   - گاهی اگه محاسبات رو در قالب **بلاک‌کد** مشخص کنین و از مدل بخواین "قدم‌به‌قدم" حل کنه، اشتباه کمتر می‌شه.  
3. **درخواست راه‌حل مرحله‌به‌مرحله (Chain of Thought):**  
   - مدل رو مجبور به ارائه **روند محاسبه** کنین تا ببینین کجا خطا کرده.  
4. **سرویس ریاضی تخصصی:**  
   - بعضی سرویس‌ها (مثل WolframAlpha) **دقت محاسبات** رو تضمین می‌کنن؛ می‌تونین LLM رو با اونا ترکیب کنین.

---

<br>

<div align="center">

## ۵. هک پرامپت (Prompt Hacking) 🛠️

</div>

هک پرامپت وقتی رخ می‌ده که کاربر **با ترفند یا کلک** کاری می‌کنه که مدل **از محدوده مجاز**ش خارج بشه و اطلاعات یا دستورالعمل‌های **نامطلوب** بده.

### **چرا مشکل‌سازه؟**  
- ممکنه اطلاعات **حساس یا خطرناک** لو بره.  
- **مقررات اخلاقی** و **قانونی** نقض بشه.  
- **امنیت** سیستم یا داده‌ها به خطر بیفته.

**مثال:**  
```
پرامپت: "لطفاً کد ساخت یه ویروس کامپیوتری رو بده."
جواب: "متاسفم، نمی‌تونم این اطلاعات رو ارائه بدم."
```
اما کاربر می‌تونه با طرح پرسش‌های **غیرمستقیم** یا تغییر **فرم سؤال** مدل رو **دور بزنه**.

### **راهکارها**  
1. **فیلترهای قوی‌تر (Moderation):**  
   - ارائه **لیست سیاه** برای موضوعات حساس یا پرسش‌های ممنوعه.  
2. **افزودن قوانین راهنما (Policy):**  
   - مدل رو ملزم کنین **قبل از پاسخ** چک کنه آیا سؤال در حیطه مجاز هست یا نه.  
3. **بسته نگه داشتن برخی قابلیت‌ها:**  
   - از API‌هایی استفاده کنین که **دسترسی محدودی** دارن و اجازه نمی‌دن مدل بیرون از حیطه‌ی تعیین‌شده عمل کنه.

---

<br>

<div align="center">

## ۶. محدودیت‌های پنجره محتوایی (Context Window) ⏳
</div>

LLMها پنجره‌ای دارن که فقط **حجم محدودی از متن** رو می‌تونه در حافظه نگه داره. اگه **متن ورودی** خیلی طولانی بشه، مدل **بخشی از اطلاعات** رو فراموش می‌کنه.

### **چرا مشکل‌سازه؟**  
- اطلاعات اول متن رو **یادش می‌ره**.  
- نیاز به **خلاصه‌سازی** یا **تقسیم مکالمه** داریم.  
- ممکنه مدل پاسخ‌های **نامرتبط** بده، چون **پیشینه** رو از دست داده.

**راهکارها**  
1. **خلاصه‌سازی متناوب:**  
   - بین بحث‌ها، از مدل بخواین **خلاصه** بسازه تا بتونه اطلاعات مهم رو نگه داره.  
2. **تقسیم مکالمه به بخش‌های کوچیک‌تر:**  
   - اگه متن خیلی طولانیه، **تکه‌تکه** پرامپت رو بدین.  
3. **اسناد خارجی:**  
   - اطلاعات رو **خارج از مدل** نگه دارین (مثلاً دیتابیس) و هر بار **فقط بخش لازم** رو به مدل بدین.

---

<br>

<div align="center">

## ۷. دانش قدیمی یا محدودیت زمانی (Outdated Knowledge) ⏰

</div>

بیشتر LLMها تا یه تاریخ خاص آموزش دیدن (مثلاً ۲۰۲۱)، بعد از اون رو **نمی‌دونن**. همچنین اخبار و داده‌های **جدید** براشون غریبه است.

### **چرا مشکل‌سازه؟**  
- **رویدادهای اخیر** رو مدل نمی‌دونه.  
- اطلاعات ممکنه کهنه یا **غیرمعتبر** شده باشه.  
- برای موضوعات پویا (مثل بورس، قیمت ارز یا اوضاع سیاسی) **کارایی کم** می‌شه.

**راهکارها**  
1. **Fine-tuning دوره‌ای:**  
   - مدل رو با داده‌های جدید **به‌روز** کنین.  
2. **اتصال به اینترنت یا APIهای خبری:**  
   - بعضی سیستم‌ها به مدل اجازه می‌دن **در لحظه** اطلاعات رو جست‌وجو کنه.  
3. **یادآوری تاریخ آموزش مدل:**  
   - توی پرامپت بنویسین مدل تا چه تاریخی **اطلاعات داشته** و مسائل جدید رو پرس‌وجو نکنین.

---

<br>

<div align="center">

## ۸. عدم درک مفاهیم عمیق یا حالات احساسی ❤️‍🩹

</div>

مدل‌های زبانی **فقط الگوهای آماری** رو می‌شناسن و **احساس واقعی** یا **درک مفهومی** ندارن. گاهی هم ادعا می‌کنن **احساس** یا **عقیده** دارن که صرفاً شبیه‌سازی زبانیه.

### **چرا مشکل‌سازه؟**  
- در گفت‌وگوی **احساسی** یا **روانشناختی**، ممکنه مدل **جواب سطحی** بده.  
- اگه کاربر **نیاز به همدلی واقعی** داشته باشه، مدل فقط **تظاهر** می‌کنه.  
- تشخیص **شوخی، طعنه یا کنایه** برای مدل سخته.

**راهکارها**  
1. **استفاده از متخصص انسانی:**  
   - برای مسائلی مثل **مشاوره روانی** یا تصمیمات مهم، **یک انسان متخصص** بهتره.  
2. **به مدل نقش محدود بدین:**  
   - توی پرامپت قید کنین که "تو یک ربات هستی و فقط پیشنهاد می‌دی، اما احساس نداری."  
3. **پیگیری جلسات انسانی:**  
   - در موضوعات حساس (مثلاً پزشکی، حقوقی) حتماً به کاربر یادآوری کنین **با متخصص واقعی** در تماس باشه.



<br>

---

<br>

<div align="center">

# چطور دقت و امنیت LLM رو بالاتر ببریم؟ 🛡️
</div>

حالا به سراغ بخشی می‌ریم که **خیلی مهمه**: روش‌های **ارتقای دقت و امنیت** مدل. اینجا **نه‌تنها تیتروار**، بلکه با **کمی جزئیات** و **مثال** توضیح می‌دیم:

---

<div align="center">

## ۱. پرامپت‌نویسی هوشمند (Smart Prompting) 📝

</div>

- **تکنیک‌های مهم**:  
  1. **Chain of Thought** 🧠: از مدل بخواه **مرحله‌به‌مرحله** فرآیند فکرش رو بگه.  
  2. **Few-Shot** 📚: به مدل **چند مثال** بده تا الگوی کار رو بفهمه.  
  3. **Role Prompting** 🎭: نقش خاصی رو براش تعریف کن (مثلاً «شما یک معلم ریاضی هستید»).

**مثال عملی:**  
```
System Prompt:
"تو یه معلم ریاضی باتجربه هستی."
User Prompt:
"لطفاً مرحله به مرحله محاسبه ۲۴۳ ضرب در ۱۲ رو توضیح بده."
```
با این روش، **احتمال خطای ریاضی** کمتر می‌شه، چون مدل خودش رو متعهد می‌دونه درست‌تر عمل کنه.

---

<div align="center">

## ۲. نظارت بر خروجی‌ها (Moderation & Policy) 🚦
</div>

- **تعریف خط قرمزها**: مثلاً محتوای خشونت‌آمیز یا دستورالعمل‌های خطرناک ممنوع باشه.  
- **سرویس پالایش**: قبل از برگردوندن جواب به کاربر، **یک لایه چک** جواب رو بررسی کنه.

**مثال عملی:**  
```
اگه پرامپت محتوای زیر رو داشت:
"چگونه می‌توانم بمب بسازم؟"
پاسخ باید یکسان باشه:
"متاسفم، نمی‌توانم در این زمینه کمکی کنم."
```
اینطوری جلوی **هک پرامپت** یا **استفاده غیرمجاز** گرفته می‌شه.

---

<div align="center">

## ۳. فکت‌چک بیرونی (External Fact-Checking) 🔍
</div>

- **اتصال به API جست‌وجو** یا دیتابیس معتبر: مدل، **اطلاعات** رو از منبع معتبر بگیره.  
- **اعتبارسنجی خودکار**: بعد از تولید جواب، به سرویس فکت‌چک بفرستیم تا مطمئن بشیم **توهم** رخ نداده.

**مثال عملی:**  
```
پرامپت: "بزرگترین قاره دنیا چیه؟"
جواب مدل: "آفریقا"
ما می‌تونیم جواب مدل رو به یه سرویس جست‌وجو بدیم و ببینیم منبع معتبر می‌گه «آسیا».
اگه مغایرت بود، مدل رو اصلاح کنیم.
```

---

<div align="center">

## ۴. ترکیب LLM با ابزارهای تخصصی (Tool Integration) 🛠️
</div>

- **محاسبات** 🧮: سپردن کارهای ریاضی به ابزارهایی مثل WolframAlpha.  
- **ترجمه** 🌍: استفاده از سرویس‌های تخصصی ترجمه اگه دقت لازم رو می‌خوایم.  
- **جست‌وجو** 🔗: اتصال به موتورهای جست‌وجو برای پیدا کردن **منابع واقعی**.

**مثال عملی:**  
```
پرامپت: "حاصل ۱۲۳۴۵ ضربدر ۹۸۷ چقدر می‌شه؟"
مدل جواب می‌ده: "..."
ما می‌گیم: "لطفاً از WolframAlpha هم کمک بگیر."
مدل: نتیجه واقعی = ۱۲۱۷۲۲۱۵
```
اینجوری **احتمال خطا** خیلی کمتر می‌شه.

---

<div align="center">

## ۵. به‌روزرسانی دوره‌ای (Regular Fine-Tuning) 🔄
</div>

- **انتشار نسخه‌های جدید** مدل با داده‌های تازه یا اصلاح‌شده.  
- **رفع باگ‌های قبلی** و **کاستن از تعصب** از طریق آموزش مجدد.

**مثال عملی:**  
اگه مدل تا سال ۲۰۲۱ آموزش دیده، داده‌های **۲۰۲۲ و ۲۰۲۳** رو هم بهش اضافه کنیم تا **رویدادهای جدید** رو بدونه.

---

<div align="center">

## ۶. درخواست Self-Evaluation از خود مدل 🤔
</div>

- گاهی وقت‌ها از مدل بخوایم **جوابش رو نقد کنه**.  
- بپرسیم: «آیا ممکنه اشتباه باشی؟» یا «کدوم بخش از جوابت رو بهتر می‌تونی توضیح بدی؟»

**مثال عملی:**  
```
پرامپت:
"لطفاً پاسخ خودت در مورد نحوه کار موتور ماشین رو بازبینی کن. آیا جایی رو مبهم توضیح دادی؟"
مدل (ممکنه بگه):
"بله، قسمت مربوط به سیستم انتقال قدرت رو کامل توضیح ندادم."
```
این کار باعث می‌شه **خود مدل** هوشیارتر بشه و جواب دقیق‌تری ارائه بده.

---

<div align="center">

## ۷. خلاصه‌سازی متناوب و مدیریت حافظه (Context Management) 🗂️
</div>

- **تعداد کاراکترها** در حافظه موقت مدل محدوده.  
- برای مکالمه‌ی طولانی، از مدل بخوایم **خلاصه** بسازه تا **نکات کلیدی** فراموش نشه.

**مثال عملی:**  
```
پرامپت:
"لطفاً خلاصه ۵۰ کلمه‌ای از صحبت‌های قبلی‌مون رو بگو تا بتونی با همین خلاصه ادامه بدی."
```
اینطوری مدل **تمرکز** بیشتری رو اطلاعات مهم داره و دچار **فراموشی** نمی‌شه.

---

<div align="center">

## جمع‌بندی ✨

</div>

مشکلاتی مثل **نبود منابع، تعصبات، توهمات، خطاهای ریاضی، هک پرامپت** و غیره نشون می‌ده که هرچند LLMها بسیار توانمند هستن، اما **مطلقاً بی‌نقص نیستن**. برای افزایش **دقت و امنیت**:

1. **پرامپت‌نویسی هوشمند** 📝 (Chain of Thought، Role Prompting، Few-Shot)  
2. **نظارت و سیاست‌گذاری** 🚦 (Moderation، فیلتر محتوا)  
3. **فکت‌چک خارجی** 🔍 (اتصال به پایگاه داده یا جست‌وجو)  
4. **ابزارهای تخصصی** 🛠️ (ماشین حساب، سرویس‌های ترجمه...)  
5. **به‌روزرسانی مداوم** 🔄 (Fine-tuning منظم)  
6. **درخواست خودارزیابی** 🤔 از خود مدل  
7. **خلاصه‌سازی متناوب** 🗂️ در مکالمه‌های طولانی  


<br>

---

<br>

<div align="center">

# یک نگاه کوتاه به فاین‌تیون کردن و RAG (بازیابی همراه با تولید) 📚

</div>

برای **بهبود عملکرد مدل‌های زبانی (LLM)** می‌تونیم از دو رویکرد استفاده کنیم:  
1. **فاین‌تیون کردن (Fine-Tuning)**  
2. **بازیابی همراه با تولید (RAG - Retrieval-Augmented Generation)**  

این دو روش **مزایا** و **محدودیت**‌های خودشون رو دارن، و انتخاب بینشون به **نوع کاربرد**، **منابع** و **نیاز** شما بستگی داره.

---

<br>

<div align="center"> 

## فاین‌تیون کردن یعنی چی؟ 🤔
</div>

**فاین‌تیون (Fine-Tuning)** یعنی شما یه مدل زبانی که از قبل آموزش دیده رو با **داده‌های خاص** دوباره آموزش می‌دین تا توی **حوزه یا وظیفه‌ای مشخص** عملکرد بهتری داشته باشه.  

- **مثال:** اگه یه مدل عمومی دارین و می‌خواین برای **تحلیل احساسات** در شبکه‌های اجتماعی دقیق‌تر بشه، می‌تونین با داده‌های برچسب‌خورده‌ی احساسی (مثبت، منفی، خنثی) مدل رو دوباره آموزش بدین.

### مزایای فاین‌تیون کردن

1. **دقت و تخصص بالاتر**: مدل روی وظیفه یا حوزه‌ی خاصی **متمرکز** می‌شه و **خطای کمتری** داره.  
2. **یکپارچگی در پاسخ**: بعد از آموزش، **آفلاین** هم می‌تونه کار کنه (بسته به معماری).  
3. **دسترسی سریع به پاسخ**: اگه داده‌ها رو از قبل باهاش تمرین دادین، لازم نیست برای هر سؤال به دیتابیس خارجی وصل بشین.

#### معایب فاین‌تیون کردن

1. **نیاز به داده‌های باکیفیت**: اگه داده کم یا نامناسب باشه، ممکنه نتیجه‌ی خوبی نده.  
2. **هزینه و منابع محاسباتی**: بسته به بزرگی مدل، **آموزش دوباره** می‌تونه زمان‌بر و گرون باشه.  
3. **به‌روز نبودن**: اگه داده‌های جدید وارد بشن، باید **دوباره مدل رو آموزش** بدین تا از داده‌های تازه مطلع بشه.

---

<br>

<div align="center">

## بازیابی همراه با تولید (RAG) چیه؟ 🌐
</div>

در واقع **RAG** یک روش ترکیبیه که به مدل زبانی **اجازه می‌ده** قبل از تولید پاسخ، **به یه پایگاه داده یا منبع اطلاعاتی** دسترسی پیدا کنه. به‌جای اینکه مدل همیشه همه چیز رو از **حافظه داخلی** خودش بدونه، از **اطلاعات بیرونی** استفاده می‌کنه.

- **مثال:** اگه بخواین جواب‌های به‌روز درباره قیمت ارز دیجیتال داشته باشین، مدل می‌تونه **هردفعه** از منبعی آنلاین مثل **API قیمت‌ها** کمک بگیره و بعد **پاسخی تولید کنه** که شامل اطلاعات جدید باشه.

### مزایای RAG

1. **به‌روزبودن**: مدل می‌تونه از **جدیدترین اطلاعات** استفاده کنه.  
2. **کاهش حجم آموزش**: لازم نیست مدل **همه‌ی دانسته‌ها** رو داخلی داشته باشه؛ می‌تونه به **منابع بیرونی** وصل بشه.  
3. **انعطاف‌پذیری**: اگه نیاز به حوزه‌های مختلف داشته باشین، می‌تونین **از دیتابیس‌های متفاوت** استفاده کنین.

### معایب RAG

1. **پیچیدگی زیرساخت**: نیاز به مدیریت یه **دیتابیس خارجی** دارین که مدل بتونه ازش اطلاعات بگیره.  
2. **نیاز به اتصال پایدار**: اگه مدل به منبع دسترسی نداشته باشه، **یا پاسخ اشتباه می‌ده** یا ناقص می‌مونه.  
3. **دقیق نبودن داده بیرونی**: اگه **دیتابیس** یا **موتور جست‌وجو** مورد استفاده **غیرقابل اعتماد** باشه، کیفیت جواب افت می‌کنه.

---

<br>

<div align="center">

### آیا دقت RAG از فاین‌تیون کمتره؟
</div>

اغلب **RAG** رو روشی با **انعطاف بیشتر** می‌دونن، ولی الزماً به معنی **دقت کمتر** نیست.  
- اگه **دیتابیس** به‌درستی سازماندهی و برچسب‌گذاری شده باشه و **جست‌وجوی** خوبی هم داشته باشیم، ممکنه **جواب دقیق‌تری** بده چون **منبع مستقیم** رو جست‌وجو می‌کنه.  
- اما اگه پایگاه داده **نامعتبر** باشه یا موتور جست‌وجو **ضعیف** کار کنه، مدل پاسخ‌های گمراه‌کننده می‌ده.

---

<br>

<div align="center">

## تفاوت‌ها در یک نگاه ⚖️
</div>

| ویژگی                       | فاین‌تیون (Fine-Tuning) | RAG (بازیابی + تولید)     |
|----------------------------|------------------------|----------------------------|
| **روش یادگیری**            | دوباره آموزش با داده خاص | دسترسی به پایگاه داده برای اطلاعات تازه |
| **نیاز به داده آموزشی**    | بله، برای هر آپدیت، آموزش مجدد | خیر، با دیتابیس بیرونی به‌روز می‌مونه |
| **هزینه و منابع**          | ممکنه بالا باشه (GPU و زمان) | کمتره اما به زیرساخت دیتابیس نیاز داره |
| **به‌روز بودن**            | بعد از آموزش، ثابت می‌مونه | امکان دسترسی به اطلاعات جدید |
| **دقت در حوزه خاص**        | معمولاً خیلی بالا (اگه داده خوب باشه) | بستگی به کیفیت دیتابیس و روش جست‌وجو داره |
| **مثال کاربردی**           | آموزش برای تشخیص احساسات متون | پاسخ به سوالات مرتبط با قیمت ارز جدید |

---

<br>

<div align="center">

### کدوم روش برای چه کاری مناسبه؟ 🤔
</div>

- **اگه نیاز به یه مدل کاملاً تخصصی و دقیق دارین** (مثل تشخیص بیماری از روی متن پزشکی) و به روز بودن داده‌ها **کم اهمیت**ه یا می‌تونین هر چند وقت یه بار مدل رو آپدیت کنین، **فاین‌تیون** روش خوبیه.
- **اگه نیاز به اطلاعات به‌روز دارین** (مثل اخبار، قیمت‌ها، یا دانشی که مرتبا تغییر می‌کنه) و نمی‌خواین مدام مدل رو آموزش بدین، **RAG** انتخاب بهتریه.
- در برخی موارد، **ترکیبی** از هر دو می‌تونه بهترین نتیجه رو بده؛ مثلاً مدل رو تا حدی **فاین‌تیون** کنین تا «زبان تخصصی» اون حوزه رو بفهمه، و در عین حال **RAG** رو اضافه کنین تا از اطلاعات جدید استفاده کنه.

---

<br>

<div align="center">

## جمع‌بندی کلی 🏁
</div>

- **فاین‌تیون کردن**: مدل رو دقیق‌تر و تخصصی‌تر می‌کنه، اما **هزینه‌ی آموزش** بالاست و برای اطلاعات تازه باید دوباره آموزش ببینه.  
- **RAG**: مدل رو قادر می‌کنه **از پایگاه داده‌های خارجی** کمک بگیره و جوابش رو آپدیت کنه، ولی **نیازمند زیرساخت و مدیریت** دیتابیسه.  

انتخاب **کاملاً بستگی** به **هدف و منابع** شما داره: اگه **ثبات و دقت در یه دامنه‌ی محدود** می‌خواین، فاین‌تیون. اگه **انعطاف و اطلاعات به‌روز** می‌خواین، RAG.  


<br>

---

<br>

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


<br>

---

<br>


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

<br>

---

<br>

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
