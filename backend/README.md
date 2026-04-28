<div align="center">
  
# 🏪 Mazzadi - Backend API

### منصة المزادات الإلكترونية العربية الأولى

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)

![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![API](https://img.shields.io/badge/API-RESTful-orange)

</div>

---

## 📋 جدول المحتويات

- [نظرة عامة](#-نظرة-عامة)
- [المميزات](#-المميزات)
- [التقنيات المستخدمة](#-التقنيات-المستخدمة)
- [هيكل المشروع](#-هيكل-المشروع)
- [التثبيت والإعداد](#-التثبيت-والإعداد)
- [المتغيرات البيئية](#-المتغيرات-البيئية)
- [تشغيل المشروع](#-تشغيل-المشروع)
- [API Documentation](#-api-documentation)
- [النشر](#-النشر)

---

## 🎯 نظرة عامة

**Mazzadi Backend** هو الخادم الخلفي لمنصة مزادات إلكترونية متكاملة، مبني باستخدام NestJS مع TypeScript. يوفر API قوي وآمن لإدارة المزادات، المستخدمين، المدفوعات، والمزيد.

---

## ✨ المميزات

### 🔐 نظام المصادقة والأمان

- تسجيل وتسجيل دخول المستخدمين
- مصادقة JWT مع Refresh Tokens
- التحقق من الهوية (OTP)
- حماية من الهجمات (Rate Limiting, CORS)
- تشفير كلمات المرور (bcrypt)

### 🏷️ نظام المزادات

- **المزادات العادية** - مزادات تقليدية مع وقت محدد
- **المزادات السريعة (Flash)** - مزادات قصيرة المدة
- **المزادات الجماعية** - مزادات متعددة المشاركين
- **المزادات الخاصة** - مزادات بدعوة فقط
- **المزادات العكسية** - البائعون يتنافسون على أقل سعر
- **المزايدة التلقائية** - Auto-bidding system

### 💰 نظام المالية

- محفظة إلكترونية لكل مستخدم
- طلبات السحب والإيداع
- نقاط الولاء والمكافآت
- تتبع المعاملات المالية

### 📦 إدارة المنتجات

- إضافة وتعديل المنتجات
- رفع الصور المتعددة
- التصنيفات والفلاتر
- المقارنة بين المنتجات
- قائمة المفضلة (Watchlist)

### 💬 نظام التواصل

- دردشة فورية (Real-time Chat)
- الإشعارات الفورية (Push Notifications)
- نظام الرسائل الداخلية
- دعم العملاء

### 👨‍💼 لوحة التحكم

- إدارة المستخدمين
- إدارة المزادات والمنتجات
- التقارير والإحصائيات
- إدارة الشكاوى

### 📊 مميزات إضافية

- نظام التقييمات والمراجعات
- تتبع الشحنات
- سجل النشاطات
- نظام التوصيات الذكي
- إحصائيات المستخدمين

---

## 🛠️ التقنيات المستخدمة

| التقنية             | الوصف                    |
| ------------------- | ------------------------ |
| **NestJS**          | إطار عمل Node.js للخوادم |
| **TypeScript**      | لغة البرمجة              |
| **MongoDB**         | قاعدة البيانات           |
| **Mongoose**        | ODM لـ MongoDB           |
| **JWT**             | المصادقة والتفويض        |
| **Socket.io**       | الاتصال الفوري           |
| **Multer**          | رفع الملفات              |
| **Class Validator** | التحقق من البيانات       |
| **Swagger**         | توثيق API                |

---

## 📁 هيكل المشروع

```
backend/
├── src/
│   ├── auth/                 # المصادقة والتفويض
│   ├── users/                # إدارة المستخدمين
│   ├── auctions/             # المزادات العادية
│   ├── flash-auctions/       # المزادات السريعة
│   ├── group-auctions/       # المزادات الجماعية
│   ├── private-auctions/     # المزادات الخاصة
│   ├── reverse-auctions/     # المزادات العكسية
│   ├── auto-bid/             # المزايدة التلقائية
│   ├── bids/                 # المزايدات
│   ├── products/             # المنتجات
│   ├── auction-products/     # منتجات المزادات
│   ├── cart/                 # سلة التسوق
│   ├── chat/                 # الدردشة
│   ├── notifications/        # الإشعارات
│   ├── wallet/               # المحفظة
│   ├── money-requests/       # طلبات السحب/الإيداع
│   ├── loyalty-points/       # نقاط الولاء
│   ├── ratings/              # التقييمات
│   ├── reports/              # التقارير
│   ├── comparisons/          # المقارنات
│   ├── watchlist/            # قائمة المفضلة
│   ├── recommendations/      # التوصيات
│   ├── shipping-tracking/    # تتبع الشحن
│   ├── activity-history/     # سجل النشاطات
│   ├── user-statistics/      # إحصائيات المستخدمين
│   ├── seller-likes/         # إعجابات البائعين
│   ├── admin/                # لوحة التحكم
│   ├── admin-messages/       # رسائل الإدارة
│   ├── customer-support/     # دعم العملاء
│   ├── identity-verification/# التحقق من الهوية
│   ├── job-applications/     # طلبات التوظيف
│   ├── promoted-auctions/    # المزادات المروجة
│   ├── home/                 # الصفحة الرئيسية
│   ├── schemas/              # MongoDB Schemas
│   └── main.ts               # نقطة البداية
├── uploads/                  # الملفات المرفوعة
├── test/                     # الاختبارات
├── render.yaml               # إعدادات Render
└── package.json
```

---

## 🚀 التثبيت والإعداد

### المتطلبات

- Node.js >= 18.0.0
- MongoDB >= 6.0
- npm أو yarn

### خطوات التثبيت

```bash
# استنساخ المشروع
git clone https://github.com/your-username/mazzadi-backend.git

# الانتقال للمجلد
cd mazzadi-backend

# تثبيت الحزم
npm install

# نسخ ملف البيئة
cp .env.example .env

# تعديل المتغيرات البيئية
nano .env
```

---

## 🔧 المتغيرات البيئية

أنشئ ملف `.env` في المجلد الرئيسي:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/mazzadi

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRATION=7d

# CORS
CORS_ORIGIN=http://localhost:4200

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

---

## ▶️ تشغيل المشروع

```bash
# وضع التطوير
npm run start:dev

# وضع المراقبة
npm run start:debug

# وضع الإنتاج
npm run build
npm run start:prod
```

---

## 📚 API Documentation

### نقاط النهاية الرئيسية

| Method | Endpoint             | الوصف             |
| ------ | -------------------- | ----------------- |
| `POST` | `/api/auth/register` | تسجيل مستخدم جديد |
| `POST` | `/api/auth/login`    | تسجيل الدخول      |
| `GET`  | `/api/auctions`      | جلب جميع المزادات |
| `POST` | `/api/auctions`      | إنشاء مزاد جديد   |
| `POST` | `/api/bids`          | تقديم مزايدة      |
| `GET`  | `/api/products`      | جلب المنتجات      |
| `GET`  | `/api/users/profile` | الملف الشخصي      |
| `GET`  | `/api/wallet`        | رصيد المحفظة      |
| `GET`  | `/api/notifications` | الإشعارات         |

### Swagger Documentation

بعد تشغيل الخادم، زور:

```
http://localhost:3000/api/docs
```

---

## 🌐 النشر

### النشر على Render

1. **اربط GitHub Repository**
2. **الملف `render.yaml` جاهز للاستخدام**
3. **أضف المتغيرات البيئية من Dashboard**

```yaml
# render.yaml موجود في المشروع
services:
  - type: web
    name: mazzadi-api
    runtime: node
    buildCommand: npm install && npm run build
    startCommand: npm run start:prod
```

### النشر اليدوي

```bash
# بناء المشروع
npm run build

# تشغيل الإنتاج
npm run start:prod
```

---

## 🧪 الاختبارات

```bash
# اختبارات الوحدات
npm run test

# اختبارات E2E
npm run test:e2e

# تغطية الاختبارات
npm run test:cov
```

---

## 📞 التواصل والدعم

- 📧 **البريد الإلكتروني**: support@mazzadi.com
- 🌐 **الموقع**: [mazzadi.com](https://mazzadi.com)
- 📱 **تويتر**: [@mazzadi](https://twitter.com/mazzadi)

---

## 📄 الرخصة

هذا المشروع مرخص تحت رخصة **MIT** - راجع ملف [abdallah244](LICENSE) للتفاصيل.

---

<div align="center">

**صنع بـ abdallah hany في مصر 🇪🇬**

⭐ إذا أعجبك المشروع، لا تنسى إضافة نجمة!

</div>
