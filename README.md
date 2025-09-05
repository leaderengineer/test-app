# Test App - Zamonaviy Test Yechish Platformasi

Bu loyiha React va Firebase yordamida yaratilgan zamonaviy test yechish platformasidir. Foydalanuvchilar ro'yxatdan o'tish, tizimga kirish va turli darajadagi testlarni yechish imkoniyatiga ega.

## 🚀 Asosiy Xususiyatlar

### 🔐 Autentifikatsiya Tizimi
- **Email/Parol bilan ro'yxatdan o'tish va kirish**
- **Google akkaunt orqali ro'yxatdan o'tish**
- **GitHub akkaunt orqali ro'yxatdan o'tish**
- **Facebook akkaunt orqali ro'yxatdan o'tish**
- **Foydalanuvchi ma'lumotlari**: Ism, Familiya, Username, Yosh

### 👤 Foydalanuvchi Profili
- **Shaxsiy ma'lumotlarni ko'rish va tahrirlash**
- **Ro'yxatdan o'tgan sana**
- **Tizimdan chiqish**
- **Test yechish sahifasiga o'tish**

### 📝 Test Tizimi
- **3 ta darajada testlar**: Oson, O'rtacha, Qiyin
- **Interaktiv test yechish**
- **Natijalarni ko'rish**
- **Faqat tizimga kirgan foydalanuvchilar uchun**

### 👨‍💼 Admin Panel
- **Faqat admin foydalanuvchilar uchun**
- **Test qo'shish, tahrirlash, o'chirish**
- **Test natijalarini ko'rish**
- **Foydalanuvchilar statistikasini ko'rish**

### 🎨 Zamonaviy Dizayn
- **Responsive dizayn** - barcha qurilmalarda ishlaydi
- **Dark/Light mode** - foydalanuvchi tanloviga qarab
- **Animatsiyalar** - Framer Motion yordamida
- **Gradient ranglar** - zamonaviy ko'rinish

## 🛠️ Texnologiyalar

- **Frontend**: React 19, Vite
- **Styling**: CSS3, CSS Variables
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Backend**: Firebase (Auth, Firestore)
- **Routing**: React Router DOM

## 📦 O'rnatish

1. **Loyihani klonlang**
```bash
git clone <repository-url>
cd test-app
```

2. **Dependencies o'rnating**
```bash
npm install
```

3. **Firebase sozlamalarini o'rnating**
   - `.env` fayl yarating va Firebase konfiguratsiyasini kiriting
   - Firebase Auth va Firestore'ni yoqing

4. **Admin email'ini sozlang**
   - `src/contexts/AuthContext.jsx` faylida `isAdmin()` funksiyasida o'z email'ingizni kiriting

5. **Loyihani ishga tushiring**
```bash
npm run dev
```

## 🔧 Firebase Sozlamalari

Firebase da quyidagi xizmatlarni yoqing:

### Authentication
- Email/Password
- Google
- GitHub  
- Facebook

### Firestore Database
- `users` collection - foydalanuvchilar ma'lumotlari
- `tests` collection - test savollari

## 📱 Foydalanish

### Foydalanuvchilar uchun:
1. **Ro'yxatdan o'ting** - Account tugmasini bosing
2. **Tizimga kiring** - email/parol yoki ijtimoiy tarmoq orqali
3. **Test yeching** - o'zingizga mos darajani tanlang
4. **Profilni ko'ring** - shaxsiy ma'lumotlaringizni tahrirlang

### Admin uchun:
1. **Admin akkaunt bilan tizimga kiring**
2. **Admin Panel** tugmasini bosing
3. **Testlarni boshqaring** - qo'shing, tahrirlang, o'chiring

## 🎯 Loyiha Strukturasi

```
src/
├── components/          # UI komponentlari
│   └── Auth.jsx       # Autentifikatsiya modali
├── contexts/           # React Context'lar
│   ├── AuthContext.jsx # Foydalanuvchi autentifikatsiyasi
│   ├── ThemeContext.jsx # Tema boshqaruvi
│   └── TestContext.jsx # Test ma'lumotlari
├── pages/              # Sahifalar
│   ├── Home.jsx        # Bosh sahifa
│   ├── UserProfile.jsx # Foydalanuvchi profili
│   ├── AdminPanel.jsx  # Admin panel
│   ├── TestSelection.jsx # Test tanlash
│   ├── TestPage.jsx    # Test yechish
│   └── Result.jsx      # Natijalar
├── services/           # Xizmatlar
│   └── firebase.js    # Firebase konfiguratsiyasi
└── styles/             # CSS stillar
    ├── Auth.css       # Auth komponenti stillari
    ├── UserProfile.css # Profil sahifasi stillari
    └── globals.css    # Global stillar
```

## 🔒 Xavfsizlik

- **Protected Routes** - faqat tizimga kirgan foydalanuvchilar uchun
- **Admin Access** - faqat admin foydalanuvchilar admin panelga kira oladi
- **Firebase Security Rules** - ma'lumotlar xavfsizligi

## 🌟 Xususiyatlar

- **Real-time updates** - Firebase Firestore yordamida
- **Offline support** - Firebase offline xususiyati
- **Responsive design** - barcha qurilmalarda ishlaydi
- **Accessibility** - foydalanuvchi dostligi
- **Performance** - Vite yordamida tez yuklanish

## 📄 Litsenziya

Bu loyiha MIT litsenziyasi ostida tarqatiladi.

## 🤝 Hissa qo'shish

Loyihaga hissa qo'shmoqchi bo'lsangiz:
1. Fork qiling
2. Feature branch yarating
3. O'zgarishlarni commit qiling
4. Pull request yuboring

## 📞 Aloqa

Savollar yoki takliflar uchun issue oching yoki email orqali murojaat qiling.

---

**Test App** - Bilimingizni sinab ko'ring va yangi bilimlarni o'zlashtiring! 🚀
