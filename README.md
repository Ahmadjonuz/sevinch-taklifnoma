# Nabijon & Sevinchxon — kelin tomoni to‘y taklifnomasi

Next.js + TypeScript. O‘zbekcha/ruscha, mobil ekranlarga mos, kelin tomoni uchun alohida nafis va animatsion dizayndagi taklifnoma. Barcha sarlavhalarda kuyov — Nabijon birinchi yoziladi.
To‘y: **7-noyabr 2026, soat 12:00 (O‘zbekiston vaqti)**. Musiqa: **Benom guruhi — Yoningdaman**, foydalanuvchi yuborgan MP3.
Fotosuratlar, mehmonlar formasi, admin va ma’lumotlar bazasi yo‘q. Supabase yoki maxfiy kalit kerak emas.

## Kompyuterda ochish

ZIP’ni alohida papkaga oching. Papkada PowerShell ochib:

```powershell
npm.cmd install
npm.cmd run dev
```

Brauzer: http://localhost:3000

## Boshlanish vaqti

`config/wedding.ts` faylida:

```ts
startTime: '12:00' as string | null,
```

Boshlanish vaqti **12:00** qilib tasdiqlangan. Sahifadagi soat, hisoblagich va yuklanadigan kalendar shu vaqtga mos. Kelajakda vaqt o‘zgarsa, yuqoridagi qiymatni yangilang.

## Ism, manzil, musiqa

Hammasi `config/wedding.ts` ichida. Kelin tomoni manzilining koordinatasi: **40.417192, 70.897604**.
Xarita tugmasi yuborilgan Google Maps havolasini ochadi: https://maps.google.com/maps?q=40.417192,70.897604&ll=40.417192,70.897604&z=16
Aniq manzil nomi ma’lum bo‘lsa, `venue.address` orqali o‘zbekcha va ruscha matnni tahrirlash mumkin.

Musiqa: `public/music/benom-yoningdaman.mp3`. Sayt “Taklifnomani ochish” bosilganda musiqani boshlaydi. Past o‘ngdagi tugma ovozni to‘xtatadi/qayta yoqadi. Telefon ovozsiz rejimi va brauzer autoplay qoidalari ijroga ta’sir qilishi mumkin.

## Vercel

Bu alohida yangi loyiha. GitHub’da yangi repository, Vercel’da yangi project yarating.
Framework: Next.js. Build: `npm run build`. Node: 22.13 yoki undan yangi.
Loyiha statik export qiladi; mahalliy `out/` tayyor sahifalarni saqlaydi.
Vercel’da odatda qo‘shimcha sozlama kerak emas. Boshqa domen uchun `config/wedding.ts` dagi `siteUrl` ni to‘liq `https://...` ko‘rinishida yozing.

```powershell
npm.cmd run build
npm.cmd start
```

Link preview: kelin tomoni dizaynidagi ismlar, sana va vaqt yozilgan `public/share-card-kelin-v2.png`.
`?lang=uz` yoki `?lang=ru` bilan tilni oldindan tanlash mumkin.

## Tekshirish

`npm run typecheck`, `npm test`, `npm run build`.
Kalendar va sana testlari O‘zbekiston +05:00 vaqtini hisobga oladi.
Mobil brauzerda ulashishdan oldin musiqa, xarita va kalendar faylini ochib tekshiring.

Shriftlar: Cormorant Garamond va Manrope; SIL Open Font License nusxalari `public/fonts/` ichida.
