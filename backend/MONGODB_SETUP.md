# إعداد MongoDB - حل مشاكل الاتصال

## المشكلة الشائعة: `ECONNREFUSED`

إذا كنت تواجه خطأ `ECONNREFUSED` عند الاتصال بـ MongoDB Atlas، اتبع الخطوات التالية:

## 1. التحقق من Connection String

تأكد من أن `MONGODB_URI` في ملف `.env` صحيح:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/projectdata?retryWrites=true&w=majority
```

**ملاحظات مهمة:**

- استبدل `username` و `password` ببيانات المستخدم الصحيحة
- استبدل `cluster.mongodb.net` بـ cluster URL الخاص بك
- تأكد من عدم وجود مسافات في connection string

## 2. إعداد Network Access في MongoDB Atlas

1. اذهب إلى [MongoDB Atlas](https://cloud.mongodb.com/)
2. اختر مشروعك
3. اذهب إلى **Network Access** من القائمة الجانبية
4. اضغط على **Add IP Address**
5. اختر أحد الخيارات:
   - **Allow Access from Anywhere** (للتطوير فقط): `0.0.0.0/0`
   - **Add Current IP Address** (أكثر أماناً): سيضيف IP الحالي تلقائياً

## 3. التحقق من Database User

1. اذهب إلى **Database Access** في MongoDB Atlas
2. تأكد من وجود مستخدم مع صلاحيات القراءة والكتابة
3. إذا لم يكن موجوداً، أنشئ مستخدم جديد:
   - اضغط **Add New Database User**
   - اختر **Password** كطريقة المصادقة
   - اختر **Read and write to any database** كصلاحيات
   - احفظ اسم المستخدم وكلمة المرور

## 4. استخدام MongoDB Local (بديل)

إذا كنت تواجه مشاكل مع Atlas، يمكنك استخدام MongoDB محلي:

### تثبيت MongoDB محلياً:

**Windows:**

```bash
# تحميل MongoDB Community Server من:
# https://www.mongodb.com/try/download/community

# بعد التثبيت، قم بتشغيل MongoDB:
# ابحث عن "MongoDB" في قائمة Start وافتح MongoDB Compass أو استخدم Command Line
```

**أو استخدم Docker:**

```bash
docker run -d -p 27017:27017 --name mongo mongo:latest
```

### تحديث ملف `.env`:

```env
MONGODB_URI=mongodb://localhost:27017/projectdata
```

## 5. اختبار الاتصال

بعد إعداد كل شيء، أعد تشغيل الـ backend:

```bash
cd backend
npm run start:dev
```

إذا ظهرت رسالة:

```
Application is running on: http://localhost:3000
```

بدون أخطاء، يعني أن الاتصال نجح! ✅

## 6. حلول إضافية

### إذا استمرت المشكلة:

1. **تحقق من Firewall:**
   - تأكد من أن Firewall لا يمنع الاتصال
   - أضف MongoDB إلى قائمة الاستثناءات

2. **تحقق من DNS:**
   - جرب استخدام IP مباشرة بدلاً من domain name
   - أو استخدم Google DNS: `8.8.8.8`

3. **تحقق من Connection String Format:**
   - تأكد من استخدام `mongodb+srv://` لـ Atlas
   - تأكد من استخدام `mongodb://` للـ local

4. **تحقق من MongoDB Atlas Status:**
   - تأكد من أن cluster يعمل (ليس في حالة paused)
   - تحقق من أنك لم تتجاوز الـ free tier limits

## مثال على ملف `.env` صحيح:

```env
# MongoDB Local
MONGODB_URI=mongodb://localhost:27017/projectdata

# أو MongoDB Atlas
# MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/projectdata?retryWrites=true&w=majority

PORT=3000
EMAIL_PASSWORD=your_gmail_app_password
```

## نصائح إضافية:

- استخدم MongoDB Compass لاختبار الاتصال مباشرة
- تحقق من logs في MongoDB Atlas Dashboard
- تأكد من أن connection string لا يحتوي على `<` أو `>` (استبدلها بالقيم الفعلية)

---

**إذا استمرت المشكلة، تأكد من:**

1. ✅ Connection string صحيح
2. ✅ IP address مسموح في Network Access
3. ✅ Database user موجود وله صلاحيات
4. ✅ Cluster يعمل (ليس paused)
5. ✅ لا توجد مشاكل في الشبكة/Firewall
