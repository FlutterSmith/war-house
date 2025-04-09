# نظام إدارة المخازن (Warehouse Management System)

نظام متكامل لإدارة المخازن مع واجهة مستخدم سهلة الاستخدام وميزات متقدمة للتتبع والتقارير.

## نظرة عامة

نظام إدارة المخازن هو تطبيق ويب متطور مصمم لتبسيط إدارة المخزون وعمليات المخازن. يتضمن النظام لوحة تحكم إحصائية، وإدارة للمخزون، وتتبع لعمليات المخازن، وتقارير متنوعة، وإدارة للمستخدمين مع دعم كامل للغة العربية.

## المميزات الرئيسية

- **لوحة تحكم تفاعلية**: عرض إحصائيات المخزون بشكل مباشر وآخر العمليات
- **إدارة المخزون**: تتبع المنتجات في مختلف المخازن (المستديم، المستهلك، التالف)
- **عمليات المخازن**: إضافة، سحب، استرجاع، نقل وإتلاف الأصناف
- **تقارير متقدمة**: تقارير متنوعة عن حالة المخزون وسجل العمليات
- **نظام الصلاحيات**: مستويات وصول مختلفة بناءً على دور المستخدم
- **واجهة مستخدم متقدمة**: واجهة سهلة الاستخدام مع دعم كامل للغة العربية

## بنية المشروع

تم تصميم بنية المشروع بشكل نمطي لتسهيل التطوير والصيانة:

```
gur-project/
├── assets/                   # الموارد الثابتة (الصور والخطوط)
│   ├── fonts/                # ملفات الخطوط
│   └── img/                  # ملفات الصور
├── css/                      # ملفات التنسيق (CSS)
│   ├── base/                 # أساسيات التنسيق
│   ├── components/           # مكونات واجهة المستخدم
│   ├── layout/               # تخطيطات الصفحة
│   ├── pages/                # تنسيقات خاصة بالصفحات
│   └── utilities/            # أدوات مساعدة للتنسيق
├── js/                       # ملفات JavaScript
│   ├── api/                  # وحدات API للتعامل مع البيانات
│   ├── auth/                 # نظام المصادقة والتحقق
│   ├── components/           # مكونات واجهة المستخدم
│   ├── pages/                # وحدات خاصة بصفحات محددة
│   ├── services/             # خدمات منطق الأعمال
│   └── utils/                # أدوات مساعدة
├── index.html                # الصفحة الرئيسية للنظام
└── login.html                # صفحة تسجيل الدخول
```

## العناصر البرمجية الرئيسية

### 1. وحدات API

- **localStorage.js**: واجهة للتعامل مع بيانات localStorage لمحاكاة قاعدة بيانات

### 2. وحدات المصادقة

- **auth.js**: نظام التحقق والمصادقة وإدارة الجلسات

### 3. المكونات

- **modal.js**: نظام النوافذ المنبثقة
- **toast.js**: نظام الإشعارات العائمة

### 4. وحدات الصفحات

- **dashboard.js**: منطق لوحة التحكم الرئيسية
- **inventory.js**: إدارة المخزون وعرضه
- **operations.js**: منطق عمليات المخازن
- **reports.js**: إنشاء وعرض التقارير
- **settings.js**: إعدادات النظام

### 5. الخدمات

- **inventory-service.js**: خدمات منطق الأعمال للمخزون
- **operations-service.js**: خدمات منطق الأعمال للعمليات
- **reports-service.js**: خدمات إنشاء التقارير

### 6. الأدوات المساعدة

- **animations.js**: تأثيرات ورسوم متحركة
- **date-formatter.js**: تنسيق وتحويل التواريخ
- **form-validator.js**: التحقق من صحة النماذج
- **i18n.js**: الترجمة والتدويل
- **permissions.js**: إدارة الأذونات والصلاحيات

## كيفية الاستخدام

### تثبيت النظام

1. قم بتنزيل أو استنساخ المشروع
2. فتح الملف `index.html` في متصفح حديث

### تسجيل الدخول

استخدم أحد الحسابات التالية للدخول:

- **عميد الكلية**: admin / admin123
- **مدير الكلية**: director / dir123
- **أمين المخزن**: store / store123
- **موظف المخازن**: staff / staff123

### استخدام النظام

1. **لوحة التحكم**: تعرض إحصائيات المخزون الرئيسية وآخر العمليات
2. **العمليات**: لإجراء عمليات المخازن (إضافة، سحب، إلخ)
3. **المخزون**: لعرض وتعديل المخزون في المخازن المختلفة
4. **التقارير**: لإنشاء وعرض تقارير متنوعة عن المخزون
5. **الإعدادات**: لتخصيص النظام وإدارة الحسابات

## التطوير المستقبلي

- إضافة قاعدة بيانات حقيقية بدلاً من localStorage
- تحسين نظام الصلاحيات والأذونات
- إضافة نظام الباركود للأصناف
- تطوير تطبيق للهاتف المحمول
- إضافة نظام للإشعارات التلقائية عند انخفاض المخزون

## المساهمة في التطوير

نرحب بمساهماتكم في تطوير النظام. يرجى اتباع الخطوات التالية:

1. انسخ المشروع (Fork)
2. أنشئ فرعًا جديدًا (Branch) للميزة الجديدة
3. أرسل طلب دمج (Pull Request) مع شرح التعديلات

## الترخيص

هذا المشروع مرخص تحت رخصة MIT. راجع ملف LICENSE للتفاصيل.