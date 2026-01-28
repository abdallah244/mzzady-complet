<div dir="rtl" align="right">

<p align="center">
  <img src="https://img.shields.io/badge/📋_ملخص_المشروع-Mazzady-gold?style=for-the-badge" alt="Project Summary"/>
</p>

<h1 align="center">📑 ملخص مشروع Mazzady - التقني</h1>

<p align="center">
  <img src="https://img.shields.io/badge/الحالة-نشط-brightgreen?style=flat-square" alt="Status"/>
  <img src="https://img.shields.io/badge/النسخة-2.0.0-blue?style=flat-square" alt="Version"/>
  <img src="https://img.shields.io/badge/آخر_تحديث-يناير_2026-orange?style=flat-square" alt="Last Update"/>
</p>

---

## 🎯 نظرة عامة

**Mazzady** هو منصة مزادات إلكترونية شاملة مبنية على أحدث التقنيات:

| التقنية    | الإصدار | الاستخدام |
| ---------- | ------- | --------- |
| Angular    | 19      | Frontend  |
| NestJS     | 10      | Backend   |
| MongoDB    | 7+      | Database  |
| TypeScript | 5.4     | Language  |

---

## ✅ ما تم إنجازه

### 1. نظام التسجيل (Sign Up) - 8 خطوات

- ✅ الخطوة 1: الاسم الثلاثي (First, Middle, Last) + النيك نيم
- ✅ الخطوة 2: رقم التليفون المصري (التحقق من الصيغة المصرية فقط)
- ✅ الخطوة 3: الرقم القومي المصري (14 رقم، يبدأ بـ 2 أو 3، مع التحقق من عدم التكرار) + **رفع صورتي البطاقة (الوجه والظهر) - حد أقصى 2 ميجا لكل صورة**
- ✅ الخطوة 4: الإيميل (يتم إرسال كود التحقق تلقائياً)
- ✅ الخطوة 5: التحقق من كود الإيميل (6 أرقام، صلاحية 10 دقائق)
- ✅ الخطوة 6: الباسوورد + التأكيد
- ✅ الخطوة 7: مراجعة البيانات (تشمل الرقم القومي)
- ✅ الخطوة 8: رسالة نجاح التسجيل

### 2. نظام تسجيل الدخول (Login) - 5 خطوات

- ✅ الخطوة 1: الإيميل
- ✅ الخطوة 2: الباسوورد + Remember Me
- ✅ الخطوة 3: مراجعة البيانات (كورسيل)
- ✅ الخطوة 4: كود التحقق (6 أرقام)
- ✅ الخطوة 5: Welcome Back! (كورسيل مع توجيه تلقائي)

### 3. Remember Me

- ✅ مدة الصلاحية: 7 أيام
- ✅ يعمل فقط في Login (ليس Sign Up)
- ✅ تسجيل خروج تلقائي بعد انتهاء المدة

### 4. Email Verification

- ✅ إرسال كود 6 أرقام
- ✅ مدة الصلاحية: 10 دقائق
- ✅ الإيميل يُرسل من: `abdallahhfares@gmail.com`
- ✅ تصميم HTML احترافي للإيميل

### 5. التصميم

- ✅ تصميم احترافي بدون أشكال زخرفية
- ✅ ألوان: خلفية #161616، حدود ذهبية #d4af37
- ✅ انتقالات سلسة بين الخطوات
- ✅ Steps indicator تفاعلي
- ✅ تصميم متجاوب (Responsive) - محسّن لجميع الأجهزة
  - Desktop (> 1024px): التصميم الكامل
  - Tablet (768px - 1024px): تصميم متوسط
  - Mobile (480px - 768px): تصميم محسّن
  - Small Mobile (< 480px): تصميم مضغوط
- ✅ Font Awesome icons بدلاً من emojis
- ✅ Show/Hide Password functionality
- ✅ Keyboard Navigation (Enter للانتقال)

---

## 🗂️ البنية التقنية

### Backend (NestJS)

- **Framework**: NestJS
- **Database**: MongoDB (Mongoose)
- **Email**: Nodemailer (Gmail)
- **Password Hashing**: bcrypt
- **Environment**: dotenv

### Frontend (Angular)

- **Framework**: Angular (Standalone Components)
- **State Management**: Signals
- **Forms**: Reactive Forms
- **HTTP**: HttpClient
- **Routing**: Angular Router

---

## 📡 API Endpoints

### Authentication

- `POST /auth/register` - تسجيل مستخدم جديد (يتطلب: email, password, firstName, middleName, lastName, nickname, phone, nationalId)
- `POST /auth/login` - تسجيل الدخول
- `POST /auth/send-verification-code` - إرسال كود التحقق
- `POST /auth/verify-email-code` - التحقق من الكود
- `GET /auth/check-user?email=...` - التحقق من الإيميل
- `GET /auth/check-nickname?nickname=...` - التحقق من النيك نيم
- `GET /auth/check-phone?phone=...` - التحقق من رقم التليفون
- `GET /auth/check-national-id?nationalId=...` - التحقق من الرقم القومي

### OAuth (Social Login)

- `GET /auth/google` - تسجيل الدخول بـ Google
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/facebook` - تسجيل الدخول بـ Facebook
- `GET /auth/facebook/callback` - Facebook OAuth callback
- `POST /auth/verify-oauth-code` - التحقق من كود OAuth وإنشاء الحساب

---

## 🔐 الأمان

1. **كلمات المرور**: مشفرة بـ bcrypt
2. **Email Verification**: كود 6 أرقام، صلاحية 10 دقائق
3. **Remember Me**: صلاحية 7 أيام
4. **Validation**: في Frontend و Backend (مع class-validator)
5. **Memory Leaks**: تم إصلاحها (cleanup للـ subscriptions و intervals)
6. **OAuth Security**: Google و Facebook OAuth integration
7. **JWT Authentication**: نظام JWT كامل مع access و refresh tokens ✅ جديد
8. **Rate Limiting**: حماية من الطلبات المتكررة باستخدام @nestjs/throttler ✅ جديد
9. **CORS**: تكوين صحيح للـ Cross-Origin requests ✅ جديد

---

## ⚙️ الإعدادات المطلوبة

### ملف `.env` في `backend/`:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/mazzady
PORT=3000

# Email
EMAIL_PASSWORD=your_gmail_app_password

# JWT Configuration (جديد - مطلوب)
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=86400

# OAuth Configuration (اختياري)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_REDIRECT_URI=http://localhost:3000/auth/facebook/callback
```

**ملاحظة**:

- الإيميل يُرسل من `abdallahhfares@gmail.com`
- تحتاج Gmail App Password
- OAuth configuration اختياري (لتفعيل Google/Facebook login)

---

## 🚀 التشغيل

### Backend:

```bash
cd backend
npm install
npm run start:dev
```

### Frontend:

```bash
cd frontend
npm install
npm start
```

---

## 📝 ملاحظات مهمة

1. **MongoDB**: جاهز للعمل مع localhost أو Atlas
2. **Email**: يُرسل من `abdallahhfares@gmail.com`
3. **Remember Me**: 7 أيام، فقط في Login
4. **Email Verification**: إلزامي قبل إتمام التسجيل
5. **OAuth**: Google و Facebook متاحين (Twitter غير مفعّل حالياً)
6. **Loading System**: Progress bar و Circular loading للـ buttons
7. **Responsive Design**: محسّن للموبايل (768px و 480px breakpoints)
8. **Memory Management**: Cleanup تلقائي للـ subscriptions و intervals
9. **Internationalization**: نظام ترجمة كامل (عربي/إنجليزي) مع RTL/LTR switching
10. **Floating Menu**: زر عائم في جميع الصفحات مع قائمة منسدلة
11. **Chatbot**: Modal قابل للتحريك مع أزرار جاهزة للاختيار

---

## 🎨 التصميم

- **الخلفية**: #161616 (متوسط بين الأسود والفحمي)
- **الحدود**: #d4af37 (ذهبي)
- **الخطوات**: Steps indicator تفاعلي
- **الانتقالات**: fade-in + slide-up

---

## 📌 الملفات المهمة

### Backend:

- `src/auth/auth.controller.ts` - API endpoints
- `src/auth/auth.service.ts` - Business logic
- `src/auth/email.service.ts` - Email service
- `src/schemas/user.schema.ts` - User model
- `src/schemas/email-verification.schema.ts` - Verification model

### Frontend:

- `src/app/auth/auth.service.ts` - Auth service
- `src/app/auth/register/register.component.ts` - Register
- `src/app/auth/login/login.component.ts` - Login
- `src/app/app.routes.ts` - Routes
- `src/app/core/loading.service.ts` - Loading service
- `src/app/core/translation.service.ts` - Translation service (i18n)
- `src/app/shared/loading-button.directive.ts` - Loading button directive
- `src/app/shared/floating-menu/floating-menu.component.ts` - Floating menu component
- `src/app/shared/chatbot/chatbot.component.ts` - Chatbot component
- `src/app/home/home.component.ts` - Home page
- `src/app/auth/oauth-verification/oauth-verification.component.ts` - OAuth verification page

---

## 🆕 المميزات الجديدة المضافة

### 1. Loading System

- ✅ Progress Bar في أعلى الصفحة (0-100%)
- ✅ يظهر تلقائياً عند التنقل بين الصفحات
- ✅ Circular Loading للـ buttons
- ✅ يظهر عند الضغط على أي button
- ✅ تصميم ذهبي احترافي

### 2. OAuth Integration

- ✅ Google OAuth
- ✅ Facebook OAuth
- ✅ تصميم احترافي للأزرار
- ✅ Font Awesome icons
- ✅ OAuth Verification Flow:
  - بعد OAuth callback، يتم إرسال كود التحقق تلقائياً
  - المستخدم يدخل الكود للتحقق
  - بعد التحقق، يتم إنشاء الحساب في قاعدة البيانات
  - تسجيل دخول تلقائي وتوجيه إلى Home
- ✅ إذا كان المستخدم موجود، تسجيل دخول مباشر

### 3. UX Improvements

- ✅ Show/Hide Password
- ✅ Keyboard Navigation (Enter)
- ✅ Auto-focus على الحقول
- ✅ Resend Code functionality
- ✅ Memory leaks fixed

### 4. Responsive Design

- ✅ محسّن لجميع الأجهزة:
  - Desktop (> 1024px): التصميم الكامل
  - Tablet (768px - 1024px): تصميم متوسط محسّن
  - Mobile (480px - 768px): تصميم محسّن للموبايل
  - Small Mobile (< 480px): تصميم مضغوط للشاشات الصغيرة
- ✅ تحسينات شاملة على:
  - Typography (خطوط متجاوبة)
  - Spacing و Padding
  - Step Indicators
  - Buttons و Forms
  - Touch Targets للموبايل
- ✅ منع Horizontal Scroll
- ✅ تحسين Viewport Meta Tag

### 5. Login Flow Enhancement

- ✅ 5 خطوات بدلاً من 2
- ✅ كورسيل مراجعة البيانات
- ✅ كود التحقق في Login
- ✅ Welcome Back screen مع توجيه تلقائي

### 6. Journey Modal في Home Page

#### Project Journey Section:

- ✅ قسم "رحلة المشروع" (Project Journey) يعرض 10 نقاط
- ✅ Timeline تفاعلي مع نقاط قابلة للنقر
- ✅ تصميم متناوب (left/right) للـ desktop و vertical للموبايل
- ✅ Animation سلسة عند الظهور (stagger effect)

#### Journey Modal:

- ✅ **مودال يظهر في منتصف الشاشة دائماً**:
  - يتم نقله تلقائياً إلى `body` عند الفتح (لتجنب مشاكل positioning)
  - `position: fixed` بالنسبة للـ viewport وليس للـ parent
  - يغطي كل الشاشة مع backdrop blur
- ✅ **Blur على كل الصفحة**:
  - `backdrop-filter: blur(4px)` على الخلفية
  - لا يقتصر على الهيرو سيكشن فقط
- ✅ **Performance محسّن**:
  - Animation سريعة (0.15s)
  - GPU acceleration (`transform: translateZ(0)`)
  - لا يغلق السكرول (السماح بالـ scroll الطبيعي)
- ✅ **تصميم موحد مع باقي المودالات**:
  - نفس الأنماط المستخدمة في Floating Menu و Footer Modals
  - نفس الـ z-index (10004)
  - نفس الـ animations والـ transitions
- ✅ **Responsive**:
  - يتكيف مع جميع أحجام الشاشات
  - Padding متجاوب مع `clamp()`
  - Max-width و max-height محسّنة للموبايل

### 7. Performance Optimizations

- ✅ **Font Awesome Async Loading**
  - Preconnect و DNS-prefetch للـ CDN
  - Async loading مع fallback
  - تحسين LCP (Largest Contentful Paint)
- ✅ **Router Preloading**
  - PreloadAllModules للتحميل السريع
  - Lazy loading للـ routes
- ✅ **Zone Change Detection Optimization**
  - eventCoalescing لتحسين الأداء
  - تقليل عدد الـ change detection cycles
- ✅ **Faster Progress Bar**
  - 50ms interval بدلاً من 80ms
  - تحسينات على الـ animation
- ✅ **Optimized Bundle Size**
  - Production build optimizations
  - Build optimizer enabled
  - Vendor chunk optimization
- ✅ **Improved LCP**
  - تحسين initial page load
  - تحسين resource loading

### 7. OAuth Verification Page

- ✅ صفحة منفصلة للتحقق من كود OAuth
- ✅ تصميم احترافي بالإنجليزية
- ✅ Resend Code functionality
- ✅ Auto-redirect بعد النجاح

### 8. Enhanced Registration Features

- ✅ **Async Validators**:
  - التحقق من البريد الإلكتروني (غير مستخدم) أثناء الكتابة
  - التحقق من رقم الهاتف (مصري + غير مستخدم) أثناء الكتابة
  - رسائل "Checking availability..." أثناء التحقق
  - رسائل نجاح عند توفر البيانات
- ✅ **Password Strength Indicator**:
  - مؤشر بصري (weak/medium/strong)
  - شريط تقدم ملون مع تأثير shimmer
  - رسائل واضحة مع أيقونات
- ✅ **Code Timer**:
  - Countdown timer يوضح الوقت المتبقي (10 دقائق)
  - تنسيق الوقت بصيغة MM:SS
  - رسالة عند انتهاء الكود
- ✅ **Resend Code Cooldown**:
  - Timer 60 ثانية قبل إعادة الإرسال
  - زر معطل أثناء الـ cooldown
  - عرض الوقت المتبقي
- ✅ **Auto-redirect بعد النجاح**:
  - Countdown 3 ثوانٍ قبل التوجيه
  - رسالة توضح الوقت المتبقي
  - زر للانتقال فوراً
- ✅ **Enhanced Review Page**:
  - Carousel لعرض البيانات (4 بطاقات)
  - أزرار للتنقل بين البطاقات
  - مؤشرات توضح البطاقة الحالية
  - أيقونات لكل نوع بيانات

### 9. Advanced Responsive Design

- ✅ **Dynamic Sizing with clamp()**:
  - جميع الأحجام تستخدم `clamp(min, preferred, max)`
  - التكيف التلقائي مع حجم الشاشة
  - Typography متجاوب بالكامل
- ✅ **Enhanced Breakpoints**:
  - Large Desktop (1400px+): أحجام أكبر
  - Desktop (1025px - 1399px): أحجام قياسية
  - Tablet (769px - 1024px): أحجام متوسطة
  - Mobile (481px - 768px): أحجام صغيرة
  - Small Mobile (< 480px): أحجام صغيرة جداً
- ✅ **Password Field Enhancements**:
  - عرض كامل للصندوق مع padding متجاوب
  - إخفاء أيقونة القفل عند الكتابة
  - تقليل padding عند وجود قيمة
  - تحسين النص داخل الحقل (font-size, line-height, letter-spacing)
- ✅ **Label Enhancements**:
  - عرض كامل للصندوق
  - margin و padding بسيط ومتجاوب
  - يتكيف مع جميع أحجام الشاشات

### 10. UI/UX Improvements

- ✅ **Enhanced Messages**:
  - رسائل نجاح مع أيقونات
  - رسائل خطأ أوضح
  - رسائل تحقق أثناء المعالجة
- ✅ **Loading States**:
  - Spinner أثناء التحقق
  - رسائل واضحة للحالات المختلفة
  - تحسين تجربة المستخدم
- ✅ **Password Field Design**:
  - أيقونة قفل تختفي عند الكتابة
  - أيقونة تطابق خضراء عند التطابق
  - نصائح كلمة المرور
  - تحسين التباعد والترتيب

### 11. Floating Menu Component

- ✅ **زر عائم في أسفل اليسار**:
  - يظهر في جميع الصفحات (Fixed Position)
  - تصميم ذهبي احترافي مع animations سلسة
  - Dropdown menu عند الضغط
- ✅ **القائمة تحتوي على**:
  - Chat Bot (شات بوت)
  - Privacy Policy (سياسة الخصوصية)
  - Return Policy (سياسة الإرجاع)
  - Site Policy (سياسة الموقع)
  - Copyright (حقوق الطبع)
  - Quick Reference (مرجع سريع)
  - Change Language (تغيير اللغة)
- ✅ **تصميم متجاوب**:
  - محسّن للموبايل والتابلت
  - Backdrop عند فتح القائمة
  - تأثيرات hover سلسة

### 12. نظام الترجمة (Internationalization)

- ✅ **نظام ترجمة كامل**:
  - دعم العربية والإنجليزية
  - TranslationService محلي باستخدام Signals
  - حفظ اللغة في localStorage
- ✅ **تطبيق الترجمة على**:
  - جميع النصوص في Register Component
  - جميع النصوص في Login Component
  - جميع رسائل الـ Validation
  - جميع عناصر Floating Menu
  - جميع الأزرار والـ Labels
- ✅ **تحديث تلقائي**:
  - تغيير `dir` و `lang` في HTML تلقائياً
  - RTL/LTR switching تلقائي
  - تحديث فوري عند تغيير اللغة
- ✅ **زر تغيير اللغة**:
  - موجود في Floating Menu
  - تبديل فوري بين العربية والإنجليزية
  - حفظ التفضيل تلقائياً

### 13. Chatbot Component

- ✅ **Modal قابل للتحريك (Draggable)**:
  - يفتح عند الضغط على "شات بوت" في Floating Menu
  - يمكن سحبه من الـ Header في أي مكان على الشاشة
  - تصميم ذهبي احترافي متناسق مع الموقع
- ✅ **أزرار جاهزة فقط (No Text Input)**:
  - المستخدم لا يمكنه الكتابة
  - فقط اختيار من الأزرار المتاحة
- ✅ **زر "تسجيل الدخول"**:
  - يتغير حسب اللغة المختارة
  - عند الضغط يظهر خطوات تسجيل الدخول (5 خطوات)
  - رسائل تظهر تدريجياً مع animations
- ✅ **أزرار التنقل**:
  - زر "العودة إلى القائمة" للعودة للشاشة الأولى
  - زر "الذهاب إلى صفحة تسجيل الدخول" يفتح صفحة Login
- ✅ **التكامل**:
  - Integration كامل مع TranslationService
  - جميع النصوص مترجمة (عربي/إنجليزي)
  - تصميم متجاوب للموبايل والتابلت
- ✅ **المميزات**:
  - Messages container مع scroll تلقائي
  - Header قابل للسحب مع cursor: move
  - Close button لإغلاق الـ modal
  - Constraint للـ viewport (لا يخرج من الشاشة)
- ✅ **Dropdown Menu للأزرار**:
  - زر واحد "عرض الخيارات" بدلاً من عدة أزرار
  - قائمة منسدلة تحتوي على جميع الخيارات
  - توفير المساحة في الشات بوت
  - Animation سلسة للقائمة
- ✅ **زر تغيير الثيم**:
  - زر "تغيير الثيم" في القائمة المنسدلة
  - عند الضغط يظهر شرح كامل للثيم (5 رسائل)
  - شرح يتضمن: كيفية الاستخدام، Theme Persistence، موقع الزر، الفرق بين Dark/Light
- ✅ **زر "إضافة حساب جديد"**:
  - زر "New Account" في القائمة المنسدلة
  - عند الضغط يظهر خطوات التسجيل (7 خطوات)
  - التحقق من حالة المستخدم (إذا كان مسجل بالفعل)
- ✅ **تقييد الحركة للغة العربية**:
  - عند اختيار اللغة العربية، الشات بوت يتحرك فقط في الجانب الأيمن من الشاشة
  - عند اختيار اللغة الإنجليزية، الشات بوت يتحرك في جميع أنحاء الشاشة

### 14. Theme System (Dark/Light Mode & Color Schemes)

- ✅ **نظام ثيم كامل**:
  - دعم Dark Mode و Light Mode
  - ThemeService محلي باستخدام Angular Signals
  - حفظ التفضيل في localStorage (تلقائي للـ scheme، اختياري للـ theme)
- ✅ **زر تغيير الثيم**:
  - موجود في Floating Menu
  - أيقونة تتغير حسب الثيم الحالي (مصباح/شمس)
  - Dropdown menu لاختيار Dark أو Light
  - تبديل فوري بين Dark و Light
- ✅ **Theme Persistence**:
  - Checkbox "إبقاء الثيم ثابت" في Floating Menu
  - عند التفعيل، يتم حفظ الثيم في localStorage
  - عند الإلغاء، يتم حذف الثيم المحفوظ
- ✅ **نظام Color Schemes (11 ثيم لوني)**:
  - زر "تغيير السيم" في Floating Menu مع Dropdown
  - 11 ثيم لوني مختلف:
    1. كلاسيكي (Classic) - الذهبي الافتراضي
    2. سايبر بلو (Cyber Blue) - أزرق
    3. نيون بنفسجي (Neon Purple) - بنفسجي
    4. ماتريكس أخضر (Matrix Green) - أخضر
    5. نيون أحمر (Neon Red) - أحمر
    6. نار برتقالي (Fire Orange) - برتقالي
    7. كحلي (Navy Teal) - كحلي
    8. أبيض (White) - أبيض
    9. أخضر فاتح (Light Green) - أخضر فاتح
    10. رمادي (Gray) - رمادي
    11. وردي (Pink) - وردي
  - **حفظ تلقائي**: يتم حفظ Color Scheme المختار تلقائياً في localStorage
  - **تغيير شامل**: كل ثيم يغير جميع ألوان الموقع (backgrounds, texts, icons, buttons, borders, shadows, links)
  - **متوافق مع Dark/Light Mode**: كل scheme يعمل مع Dark Mode و Light Mode
- ✅ **CSS Variables System**:
  - جميع الألوان تستخدم CSS Variables
  - تغيير سريع للثيم عبر `data-theme` attribute
  - تغيير سريع للـ scheme عبر `scheme-*` classes
  - الألوان الذهبية وألوان Validation تبقى ثابتة في Classic scheme فقط
- ✅ **تطبيق الثيم على**:
  - جميع Backgrounds (primary, secondary, tertiary, hover)
  - جميع النصوص (primary, secondary, tertiary)
  - جميع الحدود (borders)
  - جميع الظلال (shadows)
  - جميع الأيقونات (icons)
  - جميع الأزرار (buttons)
  - جميع الروابط (links)
  - الخريطة والعناوين في صفحة Home
- ✅ **استثناءات** (في Classic scheme فقط):
  - اللون الذهبي (#d4af37, #f4d03f) يبقى ثابت
  - ألوان Validation (الأخضر #2d5016, #4a7c1f, #27ae60 والأحمر #e74c3c) تبقى ثابتة

### 15. Admin System

- ✅ **أيقونة Admin في صفحة Login**:
  - أيقونة درع (shield) في أعلى يمين صفحة Login
  - تظهر فقط للمستخدمين غير المسجلين (غير authenticated)
  - عند الضغط تنتقل إلى صفحة تسجيل دخول الأدمن
- ✅ **صفحة تسجيل دخول الأدمن**:
  - فورم بسيط (Email + Password)
  - بيانات تسجيل الدخول:
    - Email: `abdallah@gmail.com`
    - Password: `123456`
  - رسائل خطأ عند إدخال بيانات خاطئة
  - زر "العودة إلى تسجيل الدخول"
  - متوافق مع الترجمة (عربي/إنجليزي)
  - متوافق مع الثيم (Dark/Light)
- ✅ **لوحة تحكم الأدمن**:
  - صفحة لوحة تحكم الأدمن مع Cards للانتقال للصفحات المختلفة
  - Header مع زر تسجيل الخروج
  - محمية بـ Admin Guard
  - لا يظهر فيها Navbar و Footer
  - متوافق مع الترجمة والثيم
- ✅ **صفحة إدارة المستخدمين**:
  - صفحة إدارة المستخدمين (`/admin/users`)
  - Chart.js لعرض نسبة زيارة المستخدمين في الشهر
  - جدول المستخدمين مع بياناتهم الكاملة (يشمل الرقم القومي)
  - **زر عرض صور البطاقة القومية** (أيقونة 👁️) لكل مستخدم
  - **Modal لعرض صور البطاقة** (الوجه والظهر) - متوافق مع الثيم
  - إحصائيات: إجمالي المستخدمين، الأونلاين، الأوفلاين، إجمالي الزيارات
  - إمكانية حذف المستخدمين
  - البيانات الحقيقية من Backend API
  - متوافق مع الترجمة والثيم
- ✅ **شات بوت الأدمن**:
  - شات بوت خاص بالأدمن يظهر في جميع صفحات `/admin/`
  - يحتوي على: زر "عن لوحة التحكم"، زر "تغيير اللغة"، زر "تغيير الثيم"
  - جميع الأزرار في dropdown menu
  - تأكيد نعم/لا لتغيير اللغة والثيم
- ✅ **Admin Guard**:
  - حماية جميع صفحات Admin
  - التحقق من `sessionStorage` للـ `adminAuthenticated`
  - إعادة توجيه تلقائي إلى صفحة تسجيل الدخول إذا لم يكن مسجلاً
- ✅ **Routes**:
  - `/admin/login` - صفحة تسجيل دخول الأدمن
  - `/admin/panel` - صفحة لوحة التحكم (محمية بـ Guard)
  - `/admin/users` - صفحة إدارة المستخدمين (محمية بـ Guard)
  - `/admin/edit-home` - صفحة تعديل الصفحة الرئيسية (محمية بـ Guard)
  - `/admin/money-requests` - صفحة طلبات الإيداع (محمية بـ Guard)
  - `/admin/send-messages` - صفحة إرسال الرسائل وإدارة المبيعات (محمية بـ Guard)
- ✅ **Backend API**:
  - `GET /admin/users` - الحصول على جميع المستخدمين
  - `GET /admin/users/stats` - الحصول على إحصائيات المستخدمين
  - `DELETE /admin/users/:id` - حذف مستخدم
  - `POST /auth/logout` - تحديث حالة المستخدم عند تسجيل الخروج
  - `POST /home/upload/:section` - رفع صورة (hero أو howItWorks)
  - `GET /home/images/:section` - الحصول على صور قسم معين
  - `GET /home/images` - الحصول على جميع الصور
  - `DELETE /home/images/:id` - حذف صورة
  - `POST /money-requests` - إنشاء طلب إيداع
  - `GET /money-requests` - الحصول على جميع الطلبات (Admin)
  - `GET /money-requests/user/:userId` - الحصول على طلبات مستخدم
  - `PUT /money-requests/:id/approve` - الموافقة على طلب
  - `PUT /money-requests/:id/reject` - رفض طلب
  - `DELETE /money-requests/:id` - حذف طلب (Admin)
- ✅ **تحديثات User Schema**:
  - `isOnline` - حالة المستخدم (أونلاين/أوفلاين)
  - `lastActivity` - تاريخ آخر نشاط
  - `visitsThisMonth` - عدد الزيارات في الشهر
  - `walletBalance` - رصيد المحفظة (افتراضي: 0)
- ✅ **الأمان**:
  - أيقونة Admin تظهر فقط للمستخدمين غير المسجلين
  - صفحات Admin منفصلة تماماً عن صفحات المستخدمين
  - لا يظهر Navbar و Footer في صفحات Admin
  - شات بوت الأدمن يظهر فقط في صفحات Admin
- ✅ **Edit Home Page**:
  - صفحة لإدارة صور Home Page
  - إضافة صور Hero Section (الكورسيل) - حتى 7 صور
  - إضافة صور How It Works Section
  - رفع الصور عبر Multer
  - حفظ الصور في MongoDB
  - عرض الصور في Home Page تلقائياً بعد الحفظ
  - معاينة الصور قبل الحفظ
  - حذف الصور من الـ backend
  - زر في Admin Chatbot لشرح الصفحة

### 16. Navbar & Footer Components

- ✅ **Navbar Global**:
  - Navbar ثابت في أعلى الصفحة
  - يظهر في جميع صفحات المستخدم (ما عدا login/register/admin)
  - يحتوي على: Logo، Menu Items (Home, Auctions, Categories, About, Contact)
  - Auth Buttons (Login/Register أو Logout حسب حالة المستخدم)
  - Mobile Menu مع Hamburger Icon
  - متوافق مع الترجمة (عربي/إنجليزي) و RTL/LTR
  - متوافق مع الثيم (Dark/Light)
  - Responsive لجميع الأجهزة
- ✅ **Footer Global**:
  - Footer ثابت في أسفل الصفحة
  - يظهر في جميع صفحات المستخدم (ما عدا login/register/admin)
  - يحتوي على: About، Quick Links، Legal (Privacy, Return, Site Policy)، Contact & Social Media
  - متوافق مع الترجمة والثيم
  - Responsive لجميع الأجهزة

### 17. Home Page (Landing Page)

- ✅ **Hero Section مع Carousel**:
  - Carousel تلقائي بـ 7 صور (يتغير كل 5 ثواني)
  - Text Overlay: اسم الموقع (Mazzady) + نبذة بسيطة
  - Carousel Controls (Previous/Next buttons)
  - Carousel Indicators (نقاط توضح الصورة الحالية)
  - Animation سلسة للانتقال بين الصور
  - الصور يتم جلبها من الـ backend تلقائياً
  - Fallback إلى placeholder images إذا لم توجد صور
- ✅ **Section "كيف يعمل التطبيق"**:
  - Step 1: صورة على اليمين + كلام على اليسار
  - Step 2: صورة على الشمال + كلام على اليمين
  - تصميم متناوب مع صور وكلام
  - متوافق مع RTL/LTR
- ✅ **Section "أبرز المزادات الأونلاين"**:
  - Section فاضي حالياً (جاهز لإضافة المزادات لاحقاً)
- ✅ **Section "Contact Us for Work"**:
  - Action Button للتواصل
  - تصميم احترافي مع gradient background
- ✅ **التكامل**:
  - Navbar و Footer يظهران تلقائياً
  - متوافق مع الترجمة (عربي/إنجليزي)
  - متوافق مع الثيم (Dark/Light)
  - Responsive لجميع الأجهزة
  - أداء محسّن مع animations سلسة

### 18. Enhanced Chatbot - Home Button

- ✅ **زر "الصفحة الرئيسية" في الشات بوت**:
  - زر "Home" في القائمة المنسدلة
  - عند الضغط يظهر شرح فكرة الصفحة (4 رسائل)
  - لا يذكر التفاصيل التقنية، فقط فكرة الصفحة
  - متوافق مع الترجمة (عربي/إنجليزي)

### 19. Floating Menu & Footer Modals

- ✅ **Modals في Floating Menu**:
  - 5 Modals: Quick Reference, Privacy Policy, Return Policy, Site Policy, Copyright
  - كل Modal يعرض محتوى كامل ومنسق
  - إغلاق بالضغط على Overlay أو زر الإغلاق
  - Animations سلسة (fadeIn + slideUp)
  - Backdrop blur effect
  - Responsive design
- ✅ **Modals في Footer**:
  - نفس الـ Modals الموجودة في Floating Menu
  - في قسم Legal: Privacy Policy, Return Policy, Site Policy
  - في footer-bottom: Copyright
  - نفس المحتوى والتصميم

### 20. Chatbot Policies & Reference Buttons

- ✅ **5 أزرار جديدة في User Chatbot**:
  - Quick Reference: مرجع سريع لاستخدام المنصة
  - Privacy Policy: سياسة الخصوصية الكاملة
  - Return Policy: سياسة الإرجاع والاستبدال الكاملة
  - Site Policy: سياسة استخدام الموقع الكاملة
  - Copyright: معلومات حقوق الطبع والنشر الكاملة
- ✅ **المميزات**:
  - كل زر يعرض التفاصيل الكاملة (نفس المحتوى الموجود في Modals)
  - المحتوى يُعرض سطراً بسطر بشكل سلس
  - زر العودة للقائمة الرئيسية متوفر
  - متوافق مع الترجمة (عربي/إنجليزي)

### 21. Wallet Payment System (InstaPay)

- ✅ **Wallet Dropdown**:
  - عند الضغط على أيقونة المحفظة يظهر dropdown
  - خيار واحد: InstaPay
  - عرض رصيد المحفظة الحالي
  - تصميم احترافي مع animations سلسة
- ✅ **InstaPay Payment Modal**:
  - Modal لإضافة الرصيد عبر InstaPay
  - Form validation كامل
  - حقول:
    - المبلغ (Amount)
    - رقم الهاتف: `01142402039` (ثابت، للقراءة فقط)
    - صورة الإيداع (Deposit Image) - مع معاينة
    - Checkbox للموافقة على سياسات الخصوصية
  - زر Submit Request و Cancel
  - تصميم محسّن لزر اختيار الملف مع أيقونة
  - إمكانية حذف الصورة المختارة
  - التحقق من نوع الملف (صور فقط) والحجم (حد أقصى 5MB)
- ✅ **Money Request System**:
  - عند إرسال الطلب يتم حفظه في قاعدة البيانات
  - الحالة الافتراضية: `pending` (قيد المراجعة)
  - يتم رفع صورة الإيداع إلى `/uploads/deposits`
  - Admin يمكنه مراجعة الطلبات في صفحة "Money Requests"
- ✅ **Admin Money Requests Page**:
  - صفحة جديدة في Admin Panel: `/admin/money-requests`
  - عرض جميع طلبات الإيداع
  - إمكانية الموافقة أو الرفض على كل طلب
  - إضافة ملاحظات المراجعة (اختياري)
  - عند الموافقة: يتم إضافة المبلغ تلقائياً إلى رصيد المستخدم
  - معاينة صور الإيداع في modal
  - عرض تفاصيل الطلب: المستخدم، المبلغ، رقم الهاتف، التاريخ
- ✅ **Messages System**:
  - **إشعار بسيط للرسائل الجديدة في Navbar:**
    - يظهر في الجانب الأيمن العلوي من الصفحة
    - يظهر فقط عند وجود رسائل جديدة (unreadCount زاد)
    - يعرض عدد الرسائل الجديدة
    - يختفي تلقائياً بعد 10 ثواني
    - يمكن إغلاقه يدوياً
    - يظهر فقط للرسائل الجديدة (لا يظهر للرسائل القديمة)
  - Dropdown يعرض رسائل الموافقة/الرفض
  - تحديث تلقائي كل فترة للتحقق من الرسائل الجديدة
  - عرض حالة الطلب (موافق عليه/مرفوض)
  - عرض المبلغ والتاريخ
- ✅ **Backend API**:
  - `POST /money-requests` - إنشاء طلب إيداع
  - `GET /money-requests` - الحصول على جميع الطلبات (Admin)
  - `GET /money-requests/user/:userId` - الحصول على طلبات مستخدم
  - `PUT /money-requests/:id/approve` - الموافقة على طلب
  - `PUT /money-requests/:id/reject` - رفض طلب
  - `DELETE /money-requests/:id` - حذف طلب (Admin)
- ✅ **تحديثات User Schema**:
  - `walletBalance` - رصيد المحفظة (افتراضي: 0)
- ✅ **التكامل**:
  - متوافق مع الترجمة (عربي/إنجليزي)
  - متوافق مع الثيم (Dark/Light)
  - Responsive design
  - Form validation كامل
  - Backend API كامل للطلبات
  - رفع الملفات باستخدام Multer

---

### 21.5. نظام عرض المنتجات (Auction Products System)

- ✅ **صفحة "اعرض منتجك" (Sell Product Page)**:
  - فورم لإرسال طلب عرض منتج
  - رفع صور (صورة رئيسية + صور فرعية حتى 9 صور)
  - تحديد السعر المبدئي
  - **تحديد الحد الأدنى للمزايدة (Min Bid Increment)** - القيمة الافتراضية: 1
  - **تحديد مدة المزاد (Auction Duration)** - خيارات متعددة (ثانية، دقيقة، ساعة، يوم، 3 أيام، 7 أيام)
  - إرسال الطلب مع جميع البيانات
  - رسالة نجاح بعد الإرسال
- ✅ **صفحة "منتجات المزاد" (Auction Products - Admin)**:
  - جدول يعرض جميع طلبات عرض المنتجات
  - Pagination (5 طلبات لكل صفحة)
  - عرض معلومات كل طلب:
    - صورة المنتج الرئيسية
    - السعر المبدئي
    - الحد الأدنى للمزايدة
    - مدة المزاد
    - صاحب المنتج (الاسم، الإيميل، صورة البروفايل)
    - حالة الطلب (pending, approved, rejected)
    - تاريخ الإرسال
  - زر "موافقة" يفتح Modal
  - Modal للموافقة:
    - معاينة المنتج (الصورة الرئيسية)
    - السعر المبدئي
    - الحد الأدنى للمزايدة
    - مدة المزاد
    - صاحب المنتج
    - زر "موافقة" يؤكد الموافقة
  - **عند الموافقة على المنتج:**
    - يتم إنشاء مزاد تلقائياً في صفحة إدارة المزادات
    - المزاد يظهر بحالة **"معلق" (pending)**
    - يتم نسخ الصور من `uploads/auction-products` إلى `uploads/auctions`
    - يتم استخدام الحد الأدنى للمزايدة ومدة المزاد التي حددها المستخدم
    - الأدمن يمكنه تعديل هذه القيم قبل التفعيل
    - خيار للانتقال إلى صفحة إدارة المزادات بعد الموافقة
  - زر "رفض" يفتح Modal
  - Modal للرفض:
    - معاينة المنتج
    - حقل "ملاحظة الأدمن" (مطلوب)
    - زر "رفض" يؤكد الرفض
  - زر "حذف" لحذف الطلب
- ✅ **Backend API**:
  - `POST /auction-products` - إنشاء طلب عرض منتج
  - `GET /auction-products` - جميع طلبات المنتجات (Admin)
  - `GET /auction-products/user/:userId` - طلبات مستخدم
  - `GET /auction-products/:id` - طلب معين (Admin)
  - `PUT /auction-products/:id/approve` - الموافقة على طلب (Admin) - ينشئ مزاد تلقائياً
  - `PUT /auction-products/:id/reject` - رفض طلب (Admin)
  - `DELETE /auction-products/:id` - حذف طلب (Admin)
- ✅ **Database Schema**:
  - AuctionProduct Schema (userId, mainImageUrl, mainImageFilename, additionalImagesUrl, additionalImagesFilename, startingPrice, minBidIncrement, durationInSeconds, status: 'pending'|'approved'|'rejected')

---

### 22. نظام المزادات (Auctions System)

- ✅ **صفحة المزادات**:
  - عرض جميع المزادات النشطة
  - بحث وفلترة حسب الفئة والسعر
  - Timer لكل مزاد نشط
  - تصميم responsive مع Cards
- ✅ **صفحة تفاصيل المزاد**:
  - عرض تفاصيل المزاد الكاملة
  - عرض الصور والمعلومات
  - Timer يعرض الوقت المتبقي
  - قائمة المزايدات
  - نموذج لتقديم مزايدة جديدة
  - **ملاحظة**: تم إزالة ميزة المزايدة التلقائية (Auto-Bid) وميزة المفضلة (Watchlist)
- ✅ **صفحة إدارة المزادات (Admin)**:
  - جدول المزادات مع Pagination
  - **معاينة الصور** (الصورة الرئيسية + الصور الفرعية)
  - **حالات المزاد**:
    - **معلق (Pending)** - أصفر - للمزادات التي تم إنشاؤها تلقائياً من المنتجات المعتمدة
    - **نشط (Active)** - أخضر - للمزادات النشطة
    - **منتهي (Ended)** - أحمر - للمزادات المنتهية
  - **للمزادات المعلقة:**
    - زر **"تفعيل" (Activate)** - لتفعيل المزاد وجعله نشطاً
    - زر **"تعديل" (Edit)** - لتعديل الحد الأدنى للمزايدة ومدة المزاد
  - **للمزادات النشطة:**
    - زر "تعديل" (فقط إذا لم توجد مزايدات بعد)
  - Modal لإضافة مزاد جديد
  - اختيار صاحب المنتج، الفئة، المدة
  - رفع صور (رئيسية + فرعية)
  - Timer للمزادات النشطة
  - **عند انتهاء المزاد:**
    - يتم تحديث حالة المزاد تلقائياً إلى "منتهي"
    - يتم إنشاء منتج تلقائياً في صفحة إدارة المبيعات بحالة "معلق"
    - يتم نسخ الصورة الرئيسية من المزاد إلى المنتج
    - يتم استخدام أعلى مزايدة كسعر المنتج
- ✅ **Backend API**:
  - `POST /auctions` - إنشاء مزاد (Admin)
  - `GET /auctions` - جميع المزادات
  - `GET /auctions/active` - المزادات النشطة
  - `GET /auctions/featured` - المزادات المميزة
  - `GET /auctions/:id` - مزاد معين
  - `PUT /auctions/:id/settings` - تحديث إعدادات المزاد (minBidIncrement, durationInSeconds) - Admin only
  - `PUT /auctions/:id/activate` - تفعيل مزاد معلق - Admin only
  - `DELETE /auctions/:id` - حذف مزاد (Admin)
  - `POST /bids` - تقديم مزايدة
  - `GET /bids/auction/:auctionId` - مزايدات مزاد
  - `GET /bids/user/:userId` - مزايدات مستخدم
- ✅ **Database Schemas**:
  - Auction Schema (productName, sellerId, startingPrice, minBidIncrement, images, status: 'pending'|'active'|'ended', dates, durationInSeconds, category, isFeatured, highestBid, highestBidderId)
  - Bid Schema (auctionId, userId, amount)
- ✅ **التكامل**:
  - عرض المزادات المميزة في Home Page
  - متوافق مع الترجمة والثيم
  - Responsive design
  - Timer يحدث كل ثانية
  - **إنشاء مزاد تلقائي عند الموافقة على منتج:**
    - عند الموافقة على منتج في صفحة "منتجات المزاد"
    - يتم إنشاء مزاد تلقائياً بحالة "معلق"
    - يتم نسخ الصور من `uploads/auction-products` إلى `uploads/auctions`
    - يتم استخدام الحد الأدنى للمزايدة ومدة المزاد التي حددها المستخدم

---

### 23. إرسال الرسائل وإدارة المنتجات (للإدمن)

يمكن للإدمن إرسال رسائل لأي مستخدم مسجل وإدارة المنتجات من خلال صفحة "إرسال الرسائل".

**مسارات الواجهة:**

- `/admin/send-messages` - صفحة إرسال الرسائل وإدارة المنتجات (للإدمن فقط)

**نقاط نهاية API:**

- `POST /admin-messages` - إرسال رسالة لمستخدم (للإدمن فقط)
- `GET /admin-messages/user/:userId` - الحصول على جميع الرسائل لمستخدم
- `POST /products` - إنشاء منتج جديد (للإدمن فقط)
- `GET /products` - الحصول على جميع المنتجات (للإدمن فقط)
- `GET /products/:id` - الحصول على منتج بالمعرف
- `DELETE /products/:id` - حذف منتج (للإدمن فقط)
- `PUT /products/:id/status` - تحديث حالة المنتج (للإدمن فقط)
- `PUT /products/:id/approve` - الموافقة على منتج معلق (للإدمن فقط) - يضيف المنتج لكارت الفائز إذا كان من مزاد منتهي

**المميزات:**

**إرسال الرسائل:**

- البحث عن المستخدمين بالنيك نيم، الإيميل، الاسم الأول، أو الأخير
- اختيار المستخدم من القائمة المنسدلة
- كتابة رسالة مع العنوان والنص
- تظهر الرسائل في مودال الرسائل الخاص بالمستخدم

**إدارة المنتجات:**

- إضافة منتجات جديدة مع الصورة، الاسم، السعر، وتعيينها لمستخدم
- يتم إضافة المنتجات تلقائياً إلى كارت المستخدم المعين
- عرض جميع المنتجات في تنسيق شبكي
- **عرض المنتجات من المزادات المنتهية:**
  - المنتجات التي تم إنشاؤها تلقائياً من المزادات المنتهية تظهر بحالة **"معلق" (pending)**
  - Badge أصفر "معلق" يظهر على صورة المنتج
  - رسالة "في انتظار الموافقة" تظهر للمنتجات المعلقة
- **الموافقة على المنتجات:**
  - زر **"موافقة" (Approve)** للمنتجات المعلقة
  - عند الموافقة على منتج من مزاد منتهي:
    - يتم تغيير حالة المنتج من `pending` إلى `available`
    - **يتم إضافة المنتج تلقائياً إلى كارت الفائز في المزاد** (highestBidderId)
    - المنتج يظهر في كارت الفائز مباشرة
- حذف المنتجات
- تحديث حالة المنتج (معلق/متاح/مباع)
- عرض تفاصيل الدفع للمنتجات المدفوعة

### 24. نظام الكارت

يمكن للمستخدمين عرض وإدارة كارت التسوق، شراء المنتجات، وتحميل الفواتير.

**مسارات الواجهة:**

- `/cart` - صفحة الكارت (للمستخدمين فقط، يتطلب تسجيل الدخول)
  - عرض المنتجات في السلة
  - اختيار طريقة الشحن (بري/جوي)
  - اختيار التأمين (10% من سعر المنتج)
  - شراء المنتجات مع إدخال عنوان الشحن الكامل
  - عرض الفاتورة بعد الشراء مع إمكانية التحميل

**نقاط نهاية API:**

- `GET /cart/user/:userId` - الحصول على عناصر كارت المستخدم
- `POST /cart/add` - إضافة منتج للكارت
- `PUT /cart/:id` - تحديث عنصر الكارت (طريقة الشحن، التأمين)
- `POST /cart/remove/:id` - حذف عنصر من الكارت
- `GET /cart/total/:userId` - حساب الإجمالي للكارت
- `POST /cart/purchase` - شراء عنصر من الكارت
- `GET /cart/invoice/:invoiceId/user/:userId` - الحصول على فاتورة بالمعرف

**المميزات:**

- عرض جميع عناصر الكارت مع تفاصيل المنتج
- حساب السعر الإجمالي بما في ذلك الشحن والتأمين
- تحديث طريقة الشحن (بري/جوي) وخيارات التأمين
- حذف العناصر من الكارت
- شراء العناصر (يتم الخصم من رصيد المحفظة)
- تحميل الفاتورة بعد الشراء
- تحذير الدفع خلال 14 يوم
- التحقق من رصيد المحفظة قبل الشراء

**مخطط عنصر الكارت:**

- معلومات المنتج (الاسم، السعر، الصورة، البائع)
- طريقة الشحن (بري/جوي - التكلفة تُحسب حسب الموقع)
- خيار التأمين (10% من سعر المنتج إذا تم الاختيار)
- الحالة (قيد الانتظار/مدفوع/مكتمل/ملغي)

**عملية الشراء:**

- عند الضغط على "شراء"، يفتح مودال لإدخال عنوان الشحن الكامل:
  - الدولة
  - المحافظة
  - عنوان السكن (10 أحرف على الأقل)
  - رقم التواصل
  - مكان التوصيل
- بعد إدخال العنوان والضغط على "إكمال الشراء":
  - يتم خصم المبلغ من رصيد المحفظة تلقائياً
  - يتم إنشاء فاتورة مع جميع التفاصيل
  - يتم إرسال رسالة للأدمن تفيد بتم الدفع
  - يظهر مودال الفاتورة مع حالة النجاح/الفشل
  - يمكن تحميل الفاتورة كملف HTML

**إدارة المنتجات في الأدمن:**

- في صفحة "إرسال الرسائل وإدارة المبيعات" → تبويب "إدارة المنتجات":
  - إضافة منتجات جديدة للمستخدمين
  - عرض جميع المنتجات في تنسيق شبكي
  - إذا تم دفع المنتج، يظهر Badge "تم الدفع" على صورة المنتج
  - زر "تفاصيل الدفع والعنوان" لعرض:
    - معلومات المستخدم (الاسم، الإيميل، النيك نيم، رقم الهاتف)
    - معلومات المنتج (الاسم، السعر)
    - معلومات الشحن (الدولة، المحافظة، العنوان، رقم التواصل، مكان التوصيل)
    - معلومات الدفع (التأمين، التكلفة، المبلغ الإجمالي، تاريخ الدفع)

**مخطط الفاتورة:**

- تفاصيل المنتج
- تكاليف الشحن والتأمين
- المبلغ الإجمالي
- تاريخ الإصدار
- معلومات العنوان الكاملة (الدولة، المحافظة، العنوان، رقم التواصل، مكان التوصيل)
- قابل للتحميل كملف HTML

### 25. Chatbot - Cart & Admin Add Products

- ✅ **زر "السلة" في شات بوت المستخدم**:
  - يوضح كيفية استخدام السلة وشراء المنتجات
  - شرح خطوات الشراء (اختيار طريقة الشحن، التأمين، إدخال العنوان)
  - شرح عملية الدفع والفاتورة
  - زر للانتقال إلى صفحة السلة مباشرة
- ✅ **زر "إضافة المنتجات للمستخدم" في شات بوت الأدمن**:
  - يوضح كيفية إضافة منتجات جديدة للمستخدمين
  - شرح عملية إضافة المنتج (الاسم، السعر، الصورة، اختيار المستخدم)
  - شرح عرض تفاصيل الدفع للمنتجات المدفوعة
  - زر للانتقال إلى صفحة إدارة المنتجات مباشرة

### 26. نظام الرقم القومي المصري

- ✅ **إضافة الرقم القومي في التسجيل**:
  - خطوة جديدة (الخطوة 3) في عملية التسجيل
  - التحقق من صيغة الرقم القومي المصري (14 رقم، يبدأ بـ 2 أو 3)
  - التحقق من عدم التكرار (async validator)
  - يظهر في كورسيل المراجعة
- ✅ **عرض الرقم القومي في البروفايل**:
  - يظهر كحقل غير قابل للتعديل
  - مع رسالة توضيحية "(غير قابل للتعديل)"
  - **زر عرض صور البطاقة** (أيقونة 👁️) بجانب الرقم القومي
  - **Modal لعرض صور البطاقة** (الوجه والظهر) - متوافق مع الثيم
- ✅ **عرض الرقم القومي في إدارة المستخدمين (الأدمن)**:
  - عمود جديد في جدول المستخدمين
  - يظهر مع باقي بيانات المستخدم
  - **زر عرض صور البطاقة** (أيقونة 👁️) لكل مستخدم
  - **Modal لعرض صور البطاقة** (الوجه والظهر)
- ✅ **رفع صور البطاقة القومية**:
  - رفع صورة الوجه وصورة الظهر عند التسجيل (الخطوة 3)
  - الحد الأقصى: 2 ميجا لكل صورة
  - يُحفظ في مجلد `uploads/national-ids/`
  - Multer FileFieldsInterceptor للتعامل مع الملفات
- ✅ **Backend API**:
  - `GET /auth/check-national-id?nationalId=...` - التحقق من الرقم القومي
  - `POST /auth/register` - يتطلب `nationalId` + صور البطاقة (FormData)
  - حقول `nationalIdFrontUrl`, `nationalIdBackUrl` في User schema

---

### 27. الأنظمة المتقدمة للمزادات (Advanced Auction Systems)

تم إضافة أنظمة متقدمة شاملة لتحسين تجربة المستخدم وجعل معظم العمليات تلقائية:

#### ✅ نظام الإشعارات (Real-time Notifications)

- إشعارات تلقائية عند تجاوز المزايدة
- إشعارات عند الفوز بمزاد
- إشعارات عند انتهاء المزاد
- إشعارات عند مزاد جديد في الفئات المفضلة
- إشعارات تحديثات الشحن
- عداد إشعارات غير مقروءة في الـ Navbar
- صفحة إشعارات كاملة مع إمكانية تحديد كمقروء/حذف

#### ✅ نظام التقييمات والمراجعات (Ratings & Reviews)

- تقييم تلقائي بعد الشراء
- تقييم البائعين (1-5 نجوم)
- مراجعات المستخدمين
- متوسط التقييمات

#### ✅ نظام الإعجابات للبائعين (Seller Likes System) 🆕

نظام يتيح للمستخدمين إبداء إعجابهم بالبائعين وتتبع البائعين المفضلين:

**المميزات:**

- إضافة/إزالة إعجاب للبائع بضغطة واحدة (Toggle)
- حفظ الإعجابات في قاعدة البيانات تلقائياً
- عرض عدد الإعجابات لكل بائع في Modal البائعين
- زر إعجاب بأيقونة قلب مع animations
- تحديث فوري للعداد عند الإعجاب/إلغاء الإعجاب
- حالة loading أثناء معالجة الطلب

**API Endpoints:**

- `POST /seller-likes` - إضافة/إزالة إعجاب (Toggle)
- `GET /seller-likes/:sellerId/count` - عدد الإعجابات للبائع
- `GET /seller-likes/:sellerId/user/:userId` - التحقق من حالة الإعجاب

**الملفات:**

- Backend: `seller-likes.controller.ts`, `seller-likes.service.ts`
- Frontend: `auctions.component.ts`, `seller.service.ts`

#### ✅ نظام المتابعة (Watchlist/Favorites)

- إضافة مزادات للمتابعة تلقائياً
- إشعارات للمزادات المتابعة
- صفحة قائمة المتابعة الكاملة
- زر إضافة/إزالة من المتابعة في صفحة تفاصيل المزاد

#### ✅ نظام Auto-Bid (المزايدة التلقائية)

- تحديد حد أقصى للمزايدة
- مزايدة تلقائية عند تجاوز مزايدتك
- معالجة تلقائية عند مزايدة جديدة
- صفحة إدارة المزايدات التلقائية
- زر Auto-Bid في صفحة تفاصيل المزاد

#### ✅ نظام التاريخ والسجل (Activity History)

- حفظ تلقائي لجميع العمليات:
  - المزايدات (placed, won, lost)
  - المشتريات
  - المبيعات
  - المعاملات المالية
- سجل كامل للنشاطات

#### ✅ نظام الإحصائيات للمستخدم (User Statistics)

- تحديث تلقائي للإحصائيات:
  - إحصائيات المزايدات (عدد، نجاح، فشل)
  - إحصائيات المشتريات
  - إحصائيات المبيعات
  - إحصائيات التقييمات
  - إحصائيات النقاط

#### ✅ نظام تتبع الشحنات (Shipping Tracking)

- إنشاء تتبع تلقائي بعد الشراء
- تحديث تلقائي للحالة:
  - pending, processing, shipped, in_transit, out_for_delivery, delivered
- إشعارات تلقائية عند تحديث الحالة
- سجل تتبع كامل

#### ✅ نظام المكافآت والنقاط (Loyalty Points)

- حساب تلقائي للنقاط (1 نقطة لكل 10 جنيه)
- إضافة نقاط تلقائياً عند:
  - الشراء
  - البيع
  - المزايدة
  - التقييم
- استبدال النقاط بخصومات
- تحديث تلقائي للإحصائيات

#### ✅ نظام الإعلانات المدفوعة (Promoted Auctions)

- إبراز المزادات تلقائياً
- المزادات المميزة في الأعلى
- API لإدارة المزادات المميزة

#### ✅ نظام التوصيات الذكية (Smart Recommendations)

- اقتراحات تلقائية بناءً على:
  - الفئات المفضلة (من المزايدات السابقة)
  - المزادات المشابهة
- خوارزمية توصيات ذكية

#### ✅ نظام الإبلاغ (Report System)

- الإبلاغ عن مزاد مشبوه
- الإبلاغ عن مستخدم
- الإبلاغ عن منتج
- معالجة البلاغات من الأدمن

#### ✅ نظام الدردشة المباشرة (Live Chat)

- دردشة بين المشتري والبائع
- رسائل فورية
- إشعارات الرسائل تلقائياً
- محادثات متعددة

#### ✅ نظام المزادات العكسية (Reverse Auctions)

- المشتري يحدد السعر
- البائعون يتنافسون تلقائياً
- إشعارات تلقائية للمشتري عند عروض جديدة
- تحديث الفائز تلقائياً (أقل سعر)

#### ✅ نظام المزادات السريعة (Flash Auctions)

- مزادات قصيرة (ساعات)
- خصومات كبيرة
- إشعارات فورية للمستخدمين
- API لإدارة المزادات السريعة

#### ✅ نظام المزادات الخاصة (Private Auctions)

- مزادات للمستخدمين المميزين فقط
- دعوات تلقائية
- كود دعوة
- إشعارات تلقائية للمدعوين

#### ✅ نظام المقارنة (Compare Auctions)

- مقارنة مزادات متعددة
- حفظ المقارنات
- عرض تفاصيل المقارنة

#### ✅ نظام المزادات الجماعية (Group Auctions)

- مزادات جماعية
- مشاركة التكلفة
- إشعارات تلقائية عند اكتمال العدد
- تحديث الحالة تلقائياً

#### ✅ نظام التحقق من الهوية (Identity Verification)

- تحقق من البائع
- تحقق من المشتري
- رفع وثائق الهوية
- معالجة من الأدمن
- صلاحية التحقق (سنة)

#### ✅ التكامل التلقائي

- عند المزايدة: إشعارات تلقائية + حفظ سجل النشاط
- عند الشراء: تتبع شحن تلقائي + نقاط تلقائية + سجل نشاط
- عند انتهاء المزاد:
  - إشعارات تلقائية للفائز
  - **إنشاء منتج تلقائياً في صفحة إدارة المبيعات بحالة "معلق"**
  - نسخ الصورة الرئيسية من المزاد إلى المنتج
  - استخدام أعلى مزايدة كسعر المنتج
- عند الموافقة على منتج من مزاد منتهي:
  - **إضافة المنتج تلقائياً إلى كارت الفائز في المزاد**
- عند المزاد الجماعي: إشعارات تلقائية عند اكتمال العدد
- عند المزاد العكسي: إشعارات تلقائية للمشتري عند عروض جديدة
- **ملاحظة**: تم إزالة ميزة المزايدة التلقائية (Auto-Bid) وميزة المفضلة (Watchlist)

#### ✅ واجهات Frontend

- صفحة الإشعارات (`/notifications`)
- **ملاحظة**: تم إزالة صفحة المتابعة (`/watchlist`) وصفحة Auto-Bid (`/auto-bid`) من صفحة تفاصيل المزاد
- عداد إشعارات في الـ Navbar
- **إشعار بسيط للرسائل الجديدة في Navbar** (يختفي بعد 10 ثواني)

#### ✅ Backend API Endpoints

- `GET /notifications/user/:userId` - الحصول على الإشعارات
- `GET /notifications/user/:userId/unread-count` - عدد الإشعارات غير المقروءة
- `PUT /notifications/:id/read` - تحديد كمقروء
- `POST /watchlist` - إضافة للمتابعة
- `DELETE /watchlist/:userId/:auctionId` - إزالة من المتابعة
- `POST /auto-bid` - إنشاء مزايدة تلقائية
- `GET /auto-bid/user/:userId` - المزايدات التلقائية للمستخدم
- `POST /ratings` - إنشاء تقييم
- `GET /ratings/seller/:sellerId` - تقييمات البائع
- `GET /activity-history/user/:userId` - سجل النشاط
- `GET /user-statistics/user/:userId` - إحصائيات المستخدم
- `GET /shipping-tracking/invoice/:invoiceId` - تتبع الشحنة
- `GET /loyalty-points/user/:userId` - نقاط المستخدم
- `POST /loyalty-points/add` - إضافة نقاط
- `POST /reports` - إنشاء بلاغ
- `POST /chat/send` - إرسال رسالة
- `GET /chat/conversation/:userId1/:userId2` - المحادثة
- `POST /reverse-auctions` - إنشاء مزاد عكسي
- `POST /flash-auctions` - إنشاء مزاد سريع
- `POST /private-auctions` - إنشاء مزاد خاص
- `POST /comparisons` - إنشاء مقارنة
- `POST /group-auctions` - إنشاء مزاد جماعي
- `POST /identity-verification` - طلب تحقق

---

## 🎬 نظام Animations والـ Transitions المحسّن

### المميزات العامة:

- ✅ **Pure CSS Animations**: استخدام CSS Keyframes فقط بدون Angular Animations API
- ✅ **أداء عالي**: تحسينات شاملة للأداء مع الحفاظ على السلاسة
- ✅ **Page Transitions**: انتقالات احترافية بين الصفحات (Page Flip Animation)
- ✅ **Micro-interactions**: تأثيرات hover وactive محسّنة
- ✅ **Modal Animations**: animations سلسة وسريعة للمودال
- ✅ **Chatbot Animations**: animations محسّنة لفتح وإغلاق الشات بوت
- ✅ **RTL/LTR Support**: دعم كامل للاتجاهات مع تعديل animations تلقائياً

### Page Transitions (انتقالات الصفحات):

#### Page Flip Animation:

- ✅ **3D Page Flip Effect**: تأثير قلب الصفحة ثلاثي الأبعاد
- ✅ **Direction-aware**: يتغير الاتجاه حسب اللغة (LTR/RTL)
- ✅ **Fast & Smooth**: مدة 0.4s مع `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- ✅ **Performance Optimized**: استخدام `transform` و `opacity` فقط
- ✅ **MutationObserver**: كشف تلقائي للصفحات الجديدة وتطبيق animation

#### Animation Types:

- **LTR Mode**: `rotateY(-25deg) translateX(20px) scale(0.98)` → `rotateY(0deg) translateX(0) scale(1)`
- **RTL Mode**: `rotateY(25deg) translateX(-20px) scale(0.98)` → `rotateY(0deg) translateX(0) scale(1)`
- **Fallback**: `scale(0.98)` → `scale(1)` مع fade-in

### Floating Menu Animations:

- ✅ **Menu Slide Up**: animation سلسة لفتح القائمة (0.3s)
- ✅ **Button Transitions**: transitions محسّنة للأزرار (0.25s)
- ✅ **Menu Items**: transitions سريعة للعناصر (0.2s)
- ✅ **Hover Effects**: تأثيرات hover احترافية

### Modal Animations:

- ✅ **Overlay Fade In**: fade-in سلس للخلفية (0.25s)
- ✅ **Container Slide Up**: slide-up للـ modal container (0.3s)
- ✅ **Backdrop Blur**: blur محسّن (3px بدلاً من 4-5px)
- ✅ **Transform Origin**: `center center` للـ animations الطبيعية
- ✅ **Custom Timing**: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`

### Chatbot Animations:

#### User Chatbot:

- ✅ **Wrapper Fade In**: fade-in عند الفتح (0.3s)
- ✅ **Container Slide In**: slide-in من الأسفل (0.3s)
- ✅ **Message Animations**: fade-in مع translateY و scale (0.25s)
- ✅ **Close Animation**: fade-out و slide-out عند الإغلاق (0.3s)
- ✅ **Draggable**: قابل للتحريك مع animations سلسة

#### Admin Chatbot:

- ✅ **Absolute Positioning**: يتحرك مع scroll الصفحة (ليس fixed)
- ✅ **Full Coverage**: يغطي الصفحة بالكامل (`min-height: 100vh`)
- ✅ **No Dragging**: تعطيل السحب في وضع الأدمن
- ✅ **Same Animations**: نفس animations المستخدم العادي
- ✅ **Icon Button**: أيقونة تتحرك مع scroll (position: absolute)

### Admin Pages Performance:

- ✅ **Optimized Transitions**: جميع transitions محسّنة (0.2s - 0.25s)
- ✅ **Reduced Backdrop Blur**: تقليل blur من 4-5px إلى 3px
- ✅ **Removed will-change**: إزالة properties غير ضرورية
- ✅ **Specific Transitions**: استخدام transitions محددة بدلاً من `all`
- ✅ **Standardized Timing**: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` موحد

### Performance Optimizations:

- ✅ **CSS Containment**: `contain: layout style paint` للـ route container
- ✅ **Transform-only Animations**: استخدام `transform` و `opacity` فقط
- ✅ **No Layout Shifts**: تجنب properties تسبب reflow
- ✅ **Optimized Keyframes**: تبسيط keyframes للسرعة
- ✅ **RequestAnimationFrame**: استخدام RAF عند الحاجة
- ✅ **Lazy Loading**: lazy loading للصور (`loading="lazy"`)

### الملفات:

- `frontend/src/app/app.ts` - Page transition logic مع MutationObserver
- `frontend/src/app/app.sass` - Page flip animations و admin chatbot icon styles
- `frontend/src/styles/route-transitions.sass` - Global route transition styles
- `frontend/src/app/shared/floating-menu/floating-menu.component.sass` - Floating menu animations
- `frontend/src/app/shared/chatbot/chatbot.component.sass` - Chatbot animations
- `frontend/src/app/admin/**/*.component.sass` - Admin pages optimized transitions

---

## 🚀 تحسينات الأداء والتحسينات الجديدة (Performance Optimizations)

### 28. نظام الثيمات المبسط (Simplified Theme System)

- ✅ **تم تقليص عدد الثيمات من 5 إلى 2:**
  - تم حذف: `phantablack`, `perfect-area`, `blood-magic`
  - تم الإبقاء على: `default (classic)`, `basic`
- ✅ **الملفات المُحدَّثة:**
  - `theme.service.ts`: نوع `ColorScheme` مبسط
  - `floating-menu.component.ts`: إزالة أزرار الثيمات المحذوفة
  - `floating-menu.component.html`: إزالة HTML للثيمات المحذوفة
  - `translation.service.ts`: إزالة الترجمات للثيمات المحذوفة
  - `chatbot.component.ts`: إزالة إشارات الثيمات المحذوفة
  - `styles.sass`: إزالة ~200 سطر CSS للثيمات المحذوفة

### 29. Skeleton Loader Directive

- ✅ **Directive قابل لإعادة الاستخدام للـ Loading States:**
  ```typescript
  // استخدام بسيط
  <div appSkeletonLoader [showSkeleton]="isLoading" skeletonType="card"></div>
  ```
- ✅ **أنواع Skeleton المتاحة:**
  - `text` - للنصوص (سطر واحد أو أكثر)
  - `card` - للبطاقات
  - `image` - للصور
  - `avatar` - للصور الشخصية (دائرية)
  - `button` - للأزرار
  - `custom` - أبعاد مخصصة
- ✅ **خصائص قابلة للتخصيص:**
  - `skeletonWidth`: عرض مخصص
  - `skeletonHeight`: ارتفاع مخصص
  - `skeletonRadius`: نصف قطر الزوايا
- ✅ **الملف:** `frontend/src/app/shared/skeleton-loader.directive.ts`

### 30. Skeleton Component

- ✅ **Component قابل لإعادة الاستخدام:**
  ```html
  <app-skeleton type="card" [count]="3" [animated]="true"></app-skeleton>
  ```
- ✅ **أنواع متعددة:**
  - `text` - نص بسيط
  - `card` - بطاقة كاملة (صورة + عنوان + وصف)
  - `avatar` - صورة دائرية
  - `image` - صورة مستطيلة
  - `button` - زر
  - `table-row` - صف جدول
  - `profile` - بروفايل كامل
  - `list` - قائمة (5 عناصر)
- ✅ **الملف:** `frontend/src/app/shared/skeleton/skeleton.component.ts`

### 31. Scroll Load Directive

- ✅ **Directive للتحميل عند الوصول للقسم:**
  ```html
  <section appScrollLoad (visible)="onSectionVisible()" [threshold]="0.1">
    <!-- المحتوى يتحمل عند الوصول إليه -->
  </section>
  ```
- ✅ **يعتمد على IntersectionObserver API** للأداء العالي
- ✅ **خصائص قابلة للتخصيص:**
  - `threshold`: نسبة الظهور المطلوبة (0-1)
  - `rootMargin`: هامش إضافي للتحميل المسبق
- ✅ **الملف:** `frontend/src/app/shared/scroll-load.directive.ts`

### 32. Performance Speed Service

- ✅ **سيرفس شامل لتحسين الأداء:**

  ```typescript
  // إدارة الـ Cache
  this.performanceService.cache.set("key", data);
  this.performanceService.cache.get<Type>("key");

  // Debounce للـ functions
  const debouncedSearch = this.performanceService.debounce(fn, 300);

  // Throttle للأحداث
  const throttledScroll = this.performanceService.throttle(fn, 100);
  ```

- ✅ **المميزات:**
  - **Cache Management:** تخزين مؤقت مع TTL (وقت انتهاء)
  - **Debounce:** تأخير تنفيذ الـ function
  - **Throttle:** تحديد معدل تنفيذ الـ function
  - **Lazy Images:** تحميل الصور عند الحاجة
  - **Resource Hints:** `preconnect`, `prefetch`, `preload`
  - **Performance Metrics:** قياس وقت التنفيذ
- ✅ **الملف:** `frontend/src/app/core/performance.service.ts`

### 33. تحسين Loading Button Directive

- ✅ **خصائص جديدة:**
  ```html
  <button
    appLoadingButton
    [loading]="isLoading"
    [manualLoading]="true"
    [loadingTimeout]="5000"
  >
    Submit
  </button>
  ```
- ✅ **الخصائص المضافة:**
  - `loading`: تحكم خارجي في حالة التحميل
  - `manualLoading`: تعطيل التحميل التلقائي
  - `loadingTimeout`: وقت انتهاء التحميل (بالميلي ثانية)
- ✅ **طرق جديدة:**
  - `forceStopLoading()`: إيقاف التحميل يدوياً
- ✅ **الملف:** `frontend/src/app/shared/loading-button.directive.ts`

### 34. تحسينات App Config

- ✅ **Zone Change Detection Optimization:**
  ```typescript
  provideZoneChangeDetection({
    eventCoalescing: true,
    runCoalescing: true,
  });
  ```
- ✅ **View Transitions API:**
  ```typescript
  withViewTransitions();
  ```
- ✅ **HTTP Fetch API:**
  ```typescript
  withFetch();
  ```
- ✅ **الملف:** `frontend/src/app/app.config.ts`

### 35. تبسيط الـ Animations

- ✅ **تم تبسيط الـ Animations في `styles.sass`:**
  - إزالة animations ثقيلة (`pageFlipLTR`, `pageFlipRTL`)
  - استبدالها بـ `pageFade` بسيط (0.2s)
  - تبسيط hover effects
  - تبسيط utility classes
- ✅ **تحسينات الأداء:**
  - استخدام `ease` بدلاً من `cubic-bezier` المعقدة
  - تقليل مدة الـ transitions
  - إزالة `will-change` غير الضرورية
  - استخدام `transform` و `opacity` فقط

### 36. تطبيق التحسينات على Home Component

- ✅ **Skeleton Loading:**
  - Hero Section: skeleton أثناء تحميل الصور
  - How It Works: skeleton أثناء تحميل المحتوى
  - Featured Auctions: skeleton أثناء تحميل المزادات
  - Journey Section: skeleton أثناء تحميل المحتوى
- ✅ **Scroll Load:**
  - كل section يتحمل عند الوصول إليه
  - تحسين وقت التحميل الأولي
  - تقليل استهلاك الموارد
- ✅ **الملفات المُحدَّثة:**
  - `home.component.ts`: إضافة signals للـ loading و visibility
  - `home.component.html`: إضافة directives وcomponents

---

## 📁 الملفات الجديدة المُضافة

| الملف                                   | الوصف                          |
| --------------------------------------- | ------------------------------ |
| `shared/skeleton-loader.directive.ts`   | Directive للـ Skeleton Loading |
| `shared/scroll-load.directive.ts`       | Directive للتحميل عند السكرول  |
| `shared/skeleton/skeleton.component.ts` | Component للـ Skeleton UI      |
| `core/performance.service.ts`           | Service لتحسينات الأداء        |

---

## 📝 ملاحظات الأداء

1. **Skeleton Loading**: يجب استخدام Skeleton Loader في كل الصفحات التي تحتاج تحميل بيانات
2. **Scroll Load**: يُفضل استخدامه للأقسام الثقيلة أو التي تحتوي على صور كثيرة
3. **Performance Service**: استخدم الـ Cache للبيانات التي لا تتغير كثيراً
4. **Animations**: تجنب animations معقدة في العناصر المتكررة

---

## 🎯 تحسينات Lighthouse Score (يناير 2026)

### المشاكل التي تم حلها:

| المقياس                        | قبل   | الهدف   |
| ------------------------------ | ----- | ------- |
| First Contentful Paint (FCP)   | 2.9s  | < 1.8s  |
| Largest Contentful Paint (LCP) | 9.1s  | < 2.5s  |
| Total Blocking Time (TBT)      | 250ms | < 200ms |
| Speed Index                    | 5.0s  | < 3.4s  |

### التحسينات المطبقة:

#### 1. Critical CSS Inline

```html
<!-- CSS أساسي في index.html مباشرة -->
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{min-height:100vh;background:#161616;color:#fff}
  .app-loading{position:fixed;inset:0;display:flex;...}
</style>
```

#### 2. Loading Indicator

- مؤشر تحميل يظهر فوراً أثناء Angular bootstrap
- يختفي تلقائياً عند تحميل التطبيق

#### 3. تحسين تحميل الصور (LCP)

```html
<!-- أول صورة بأولوية عالية -->
<img fetchpriority="high" loading="eager" decoding="async" />
<!-- باقي الصور lazy -->
<img loading="lazy" decoding="async" />
```

#### 4. API Timeout Fallback

```typescript
// Fallback سريع إذا API بطيء (2 ثانية)
const timeout = setTimeout(() => {
  this.heroImages.set(fallbackImages);
  this.heroLoading.set(false);
}, 2000);
```

#### 5. Preconnect للموارد

```html
<link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin />
<link rel="preconnect" href="http://localhost:3000" crossorigin />
```

#### 6. CSS-only Skeletons

```sass
.skeleton-hero-placeholder
  background: linear-gradient(90deg, #1f1f1f 25%, #2a2a2a 50%, #1f1f1f 75%)
  animation: shimmer 1.5s infinite
```

#### 7. Simplified Page Transitions

```typescript
// بدلاً من 3D rotations معقدة
element.style.transition = "opacity 0.2s ease, transform 0.2s ease";
element.style.transform = "translateY(10px)";
```

#### 8. Reduced Motion Support

```sass
@media (prefers-reduced-motion: reduce)
  *, *::before, *::after
    animation-duration: 0.01ms !important
    transition-duration: 0.01ms !important
```

#### 9. تحسينات angular.json

```json
{
  "optimization": {
    "styles": { "minify": true, "inlineCritical": true },
    "fonts": { "inline": true }
  }
}
```

---

## 🔐 تحديثات الأمان - يناير 2026

### 1. نظام JWT Authentication

تم إضافة نظام JWT كامل:

#### Backend:

- ✅ `JwtStrategy` - استراتيجية JWT للتحقق
- ✅ `JwtAuthGuard` - حارس للحماية
- ✅ `@Public()` decorator - لتجاوز الحماية في endpoints معينة
- ✅ Validation DTOs مع `class-validator`

#### Frontend:

- ✅ `AuthInterceptor` - لإرسال tokens تلقائياً
- ✅ تجديد token تلقائي عند انتهاء الصلاحية
- ✅ تخزين آمن للـ tokens

### 2. Rate Limiting

- ✅ حماية من الطلبات المتكررة
- ✅ تكوين مخصص لكل endpoint
- ✅ 10 requests per minute للعام، 5 للـ auth

### 3. Backend Validation

- ✅ `class-validator` للتحقق من البيانات
- ✅ `ValidationPipe` global
- ✅ رسائل خطأ واضحة

### 4. CORS Configuration

- ✅ تكوين صحيح للـ origins
- ✅ دعم credentials
- ✅ الـ headers المسموحة

### 5. إصلاحات أخرى

- ✅ OAuth Schema - `phone`, `password`, `middleName` optional
- ✅ حذف Email Verification Codes بعد الاستخدام
- ✅ LoadingButtonDirective - تحكم يدوي بدلاً من timeout

---

## 🎨 تحديثات UI/UX - يناير 2026

### LoadingButtonDirective

الطريقة الجديدة (موصى بها):

```html
<button appLoadingButton [loading]="isSubmitting()">
  <i class="fas fa-check"></i>
  <span>حفظ</span>
</button>
```

### Components المحدثة:

- ✅ sell-product
- ✅ auction-details
- ✅ cart
- ✅ send-messages
- ✅ edit-home-page
- ✅ admin-login
- ✅ profile
- ✅ oauth-verification
- ✅ login
- ✅ register

---

## 📦 الحزم الجديدة

### Backend:

```json
{
  "@nestjs/jwt": "^10.x",
  "@nestjs/passport": "^10.x",
  "@nestjs/throttler": "^6.x",
  "passport": "^0.7.x",
  "passport-jwt": "^4.x",
  "class-validator": "^0.14.x",
  "class-transformer": "^0.5.x"
}
```

---

## ⚙️ الإعدادات المطلوبة (محدث)

### ملف `.env` في `backend/`:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/mazzady
PORT=3000

# Email
EMAIL_PASSWORD=your_gmail_app_password

# JWT (جديد)
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=86400

# OAuth (اختياري)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_REDIRECT_URI=http://localhost:3000/auth/facebook/callback
```

---

**تاريخ آخر تحديث**: 27 يناير 2026

---

## 🆕 التحديثات الأخيرة (يناير 2026)

### 1. ✅ Environment Configuration

تم إنشاء ملفات Environment لإدارة الـ URLs:

#### Frontend:

- `frontend/src/environments/environment.ts` - إعدادات التطوير
- `frontend/src/environments/environment.prod.ts` - إعدادات الإنتاج

```typescript
export const environment = {
  production: false,
  apiUrl: "http://localhost:3000",
  frontendUrl: "http://localhost:4200",
  wsUrl: "ws://localhost:3000",
  enableDebugMode: true,
};
```

#### AssetUrlPipe:

- `frontend/src/app/shared/pipes/asset-url.pipe.ts` - Pipe لتحويل مسارات الصور
- الاستخدام: `{{ imagePath | assetUrl }}`

### 2. ✅ WebSocket للـ Chat (Real-time)

تم إضافة WebSocket gateway للـ Chat:

#### الملفات المضافة:

- `backend/src/chat/chat.gateway.ts` - WebSocket Gateway

#### الأحداث:

- `join` - الانضمام للدردشة
- `leave` - المغادرة
- `sendMessage` - إرسال رسالة
- `typing` - مؤشر الكتابة
- `markAsRead` - تحديد كمقروء
- `newMessage` - رسالة جديدة (Event)

#### الحزم المضافة:

```json
{
  "@nestjs/websockets": "^11.0.1",
  "@nestjs/platform-socket.io": "^11.0.1",
  "socket.io": "^4.7.4"
}
```

### 3. ✅ إصلاح Admin ID Placeholder

تم إصلاح مشكلة `admin-placeholder` في 4 controllers:

- `money-requests.controller.ts`
- `job-applications.controller.ts`
- `customer-support.controller.ts`
- `auction-products.controller.ts`

الحل: استخدام `req.user?.sub || req.user?.id || 'system-admin'`

### 4. ✅ إزالة console.log

تم حذف جميع `console.log` و `console.error` من:

- **Frontend**: profile, navbar, floating-menu, sell-product, join-us
- **Backend**: main.ts, money-requests, products.service, bids.service

### 5. ✅ إكمال نظام Ratings

تم إضافة endpoints جديدة:

| Method | Endpoint                | الوصف                |
| ------ | ----------------------- | -------------------- |
| GET    | `/ratings/:id`          | جلب تقييم معين       |
| PUT    | `/ratings/:id`          | تعديل التقييم        |
| DELETE | `/ratings/:id`          | حذف التقييم          |
| GET    | `/ratings/user/:userId` | جلب تقييمات المستخدم |

#### الميزات الجديدة:

- فحص عدم تكرار التقييم لنفس الفاتورة
- التحقق من ملكية التقييم قبل التعديل/الحذف
- validation للتقييم (1-5)

### 6. ✅ Watchlist Notifications

تم تفعيل إشعارات قائمة المتابعة:

#### الإشعارات الجديدة:

- `notifyWatchlistPriceChange()` - إشعار عند مزايدة جديدة
- `notifyWatchlistEndingSoon()` - إشعار اقتراب انتهاء المزاد
- `notifyWatchlistAuctionEnded()` - إشعار انتهاء المزاد

#### التكامل:

- ربط `BidsService` مع `WatchlistService`
- إرسال إشعارات تلقائية لمتابعي المزاد عند كل مزايدة

### 7. ✅ Pagination للمزادات

تم إضافة pagination مع فلترة وبحث:

#### Controller:

```typescript
@Get()
async getAllAuctions(
  @Query('page') page?: string,
  @Query('limit') limit?: string,
  @Query('category') category?: string,
  @Query('status') status?: string,
  @Query('search') search?: string,
)
```

#### Response:

```json
{
  "auctions": [...],
  "total": 100,
  "page": 1,
  "totalPages": 5,
  "hasNext": true,
  "hasPrev": false
}
```

#### Endpoints المحدثة:

- `GET /auctions` - مع pagination وفلترة
- `GET /auctions/active` - مع pagination

---

## 📊 ملخص الملفات المعدلة

### Frontend (15+ ملف):

- `environments/environment.ts` ✨ جديد
- `environments/environment.prod.ts` ✨ جديد
- `shared/pipes/asset-url.pipe.ts` ✨ جديد
- `core/services/api-config.service.ts` ✨ جديد
- `auth/auth.service.ts`
- `shared/navbar/navbar.component.ts`
- `shared/floating-menu/floating-menu.component.ts`
- `profile/profile.component.ts`
- `home/home.component.ts`
- `cart/cart.component.ts`
- `watchlist/watchlist.component.ts`
- `notifications/notifications.component.ts`
- `auto-bid/auto-bid.component.ts`
- `customer-service/customer-service.component.ts`
- `join-us/join-us.component.ts`
- `sell-product/sell-product.component.ts`
- `core/seller.service.ts`

### Backend (15+ ملف):

- `chat/chat.gateway.ts` ✨ جديد
- `chat/chat.service.ts`
- `chat/chat.module.ts`
- `main.ts`
- `money-requests/money-requests.controller.ts`
- `money-requests/money-requests.service.ts`
- `job-applications/job-applications.controller.ts`
- `customer-support/customer-support.controller.ts`
- `auction-products/auction-products.controller.ts`
- `products/products.service.ts`
- `ratings/ratings.controller.ts`
- `ratings/ratings.service.ts`
- `notifications/notifications.service.ts`
- `bids/bids.service.ts`
- `bids/bids.module.ts`
- `auctions/auctions.controller.ts`
- `auctions/auctions.service.ts`
- `package.json`

---

## 🆕 التحديثات الأخيرة (يناير 2026)

### 1. ✅ نظام الإعجابات للبائعين (Seller Likes)

تم إضافة نظام كامل للإعجاب بالبائعين:

| الميزة           | الوصف                             |
| ---------------- | --------------------------------- |
| Toggle Like      | إضافة/إزالة إعجاب بضغطة واحدة     |
| Real-time Count  | تحديث فوري لعداد الإعجابات        |
| Database Storage | حفظ الإعجابات في MongoDB          |
| ObjectId Fix     | إصلاح مقارنة ObjectId لدقة العداد |

#### API Endpoints:

```
POST   /seller-likes              → Toggle like
GET    /seller-likes/:id/count    → Get likes count
GET    /seller-likes/sellers/stats → Get all sellers stats
```

### 2. ✅ إصلاح CORS Headers

تم إضافة `x-admin-authenticated` للـ allowedHeaders في Backend.

### 3. ✅ إصلاح API Response Format

تم تعديل Frontend للتعامل مع:

```json
{
  "auctions": [...],
  "total": 100,
  "page": 1,
  "totalPages": 5
}
```

### 4. ✅ استبدال Hardcoded URLs

تم استبدال جميع `http://localhost:3000` بـ `environment.apiUrl`.

### 5. ✅ إصلاح Null Safety

تم إصلاح خطأ `Cannot read properties of null (reading 'nickname')`:

```typescript
// قبل
product.userId.nickname;

// بعد
product.userId?.nickname || (isArabic() ? "غير معروف" : "Unknown");
```

### 6. ✅ تحسين Payment Details Modal

تم إضافة CSS fallback values لضمان ظهور النص.

---

## 📋 قائمة الملفات المهمة

<details>
<summary>📂 Backend Files</summary>

| الملف                                  | الوظيفة                   |
| -------------------------------------- | ------------------------- |
| `main.ts`                              | Entry point + CORS config |
| `auth/auth.controller.ts`              | Authentication APIs       |
| `auctions/auctions.service.ts`         | Auction logic             |
| `seller-likes/seller-likes.service.ts` | Seller likes logic        |
| `schemas/*.schema.ts`                  | MongoDB schemas           |

</details>

<details>
<summary>📂 Frontend Files</summary>

| الملف                              | الوظيفة                |
| ---------------------------------- | ---------------------- |
| `environments/environment.ts`      | API configuration      |
| `auctions/auctions.component.ts`   | Auction page           |
| `admin/send-messages.component.ts` | Admin messages         |
| `core/auth.service.ts`             | Authentication service |

</details>

---

<p align="center">
  <strong>📅 آخر تحديث: يناير 2026</strong>
</p>

</div>
