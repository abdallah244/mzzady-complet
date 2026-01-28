<div dir="rtl" align="right">

<p align="center">
  <img src="https://img.shields.io/badge/🚀_دليل_التشغيل-Mazzady-blue?style=for-the-badge" alt="Installation"/>
</p>

<h1 align="center">⚡ دليل تثبيت وتشغيل المشروع</h1>

---

## 📋 المتطلبات الأساسية

قبل البدء، تأكد من تثبيت:

| البرنامج | الإصدار المطلوب | رابط التحميل                                                  |
| -------- | --------------- | ------------------------------------------------------------- |
| Node.js  | v18+            | [nodejs.org](https://nodejs.org)                              |
| MongoDB  | v7+             | [mongodb.com](https://www.mongodb.com/try/download/community) |
| Git      | أحدث إصدار      | [git-scm.com](https://git-scm.com)                            |

---

## 🔧 خطوات التثبيت

### 1️⃣ استنساخ المشروع

```bash
git clone https://github.com/your-username/mazzady.git
cd mazzady
```

### 2️⃣ تثبيت الـ Backend

```bash
# الدخول لمجلد الباك اند
cd backend

# تثبيت الحزم
npm install
```

### 3️⃣ إعداد ملف البيئة (.env)

أنشئ ملف `.env` في مجلد `backend/`:

```env
# ═══════════════════════════════════════════════════════
#                    🗄️ قاعدة البيانات
# ═══════════════════════════════════════════════════════
MONGODB_URI=mongodb://localhost:27017/projectdata
PORT=3000

# ═══════════════════════════════════════════════════════
#                    📧 إعدادات الإيميل
# ═══════════════════════════════════════════════════════
# للحصول على App Password من Gmail:
# 1. فعّل Two-Factor Authentication
# 2. اذهب إلى: https://myaccount.google.com/apppasswords
# 3. أنشئ App Password جديد
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

# ═══════════════════════════════════════════════════════
#                    🔐 JWT Configuration
# ═══════════════════════════════════════════════════════
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=7d

# ═══════════════════════════════════════════════════════
#                    🌐 OAuth (اختياري)
# ═══════════════════════════════════════════════════════
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret

# ═══════════════════════════════════════════════════════
#                    🔗 URLs
# ═══════════════════════════════════════════════════════
FRONTEND_URL=http://localhost:4200
BACKEND_URL=http://localhost:3000
```

### 4️⃣ تثبيت الـ Frontend

```bash
# العودة للمجلد الرئيسي ثم الدخول للفرونت اند
cd ../frontend

# تثبيت الحزم
npm install
```

---

## 🚀 تشغيل المشروع

### الطريقة السريعة (Terminal واحد)

```bash
# من المجلد الرئيسي
# تشغيل الباك اند في نافذة
cd backend && npm run start:dev

# في نافذة أخرى - تشغيل الفرونت اند
cd frontend && npm start
```

### الطريقة المفصلة

#### تشغيل MongoDB

```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

#### تشغيل الـ Backend

```bash
cd backend

# وضع التطوير (مع Hot Reload)
npm run start:dev

# وضع الإنتاج
npm run build
npm run start:prod
```

#### تشغيل الـ Frontend

```bash
cd frontend

# وضع التطوير
npm start
# أو
ng serve

# بناء للإنتاج
npm run build
```

---

## 🌐 الروابط بعد التشغيل

| الخدمة         | الرابط                                         |
| -------------- | ---------------------------------------------- |
| 🖥️ Frontend    | [http://localhost:4200](http://localhost:4200) |
| ⚙️ Backend API | [http://localhost:3000](http://localhost:3000) |
| 📊 MongoDB     | mongodb://localhost:27017                      |

---

## ✅ التحقق من نجاح التشغيل

### 1. اختبار الـ Backend

افتح المتصفح على: `http://localhost:3000`

يجب أن تظهر رسالة:

```json
{
  "message": "Welcome to Mazzady API"
}
```

### 2. اختبار الـ Frontend

افتح المتصفح على: `http://localhost:4200`

يجب أن تظهر الصفحة الرئيسية للمنصة.

---

## 🔧 حل المشاكل الشائعة

### ❌ مشكلة: MongoDB لا يعمل

```bash
# تأكد من تشغيل الخدمة
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### ❌ مشكلة: Port مستخدم

```bash
# تغيير البورت في الباك اند
# في ملف .env
PORT=3001

# تغيير البورت في الفرونت اند
ng serve --port 4300
```

### ❌ مشكلة: CORS Error

تأكد من إضافة `FRONTEND_URL` صحيح في ملف `.env`:

```env
FRONTEND_URL=http://localhost:4200
```

### ❌ مشكلة: Email لا يُرسل

1. تأكد من تفعيل 2FA على حساب Gmail
2. أنشئ App Password من [هنا](https://myaccount.google.com/apppasswords)
3. استخدم App Password في `EMAIL_PASSWORD`

---

## 📦 سكربتات مفيدة

### Backend

```bash
npm run start:dev    # تشغيل مع Hot Reload
npm run build        # بناء للإنتاج
npm run start:prod   # تشغيل الإنتاج
npm run lint         # فحص الكود
npm run test         # تشغيل الاختبارات
```

### Frontend

```bash
npm start           # تشغيل التطوير
npm run build       # بناء للإنتاج
npm run lint        # فحص الكود
npm run test        # تشغيل الاختبارات
```

---

## 🐳 تشغيل بـ Docker (اختياري)

```bash
# بناء وتشغيل
docker-compose up -d

# إيقاف
docker-compose down
```

---

## 📱 الوصول من الموبايل (Local Network)

```bash
# تشغيل الفرونت اند على الشبكة المحلية
ng serve --host 0.0.0.0

# ثم افتح من الموبايل
# http://YOUR_PC_IP:4200
```

</div>
