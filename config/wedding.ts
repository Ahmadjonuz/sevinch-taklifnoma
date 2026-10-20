// Kelin tomoni taklifnomasi: ismlar, sana, vaqt va manzil shu fayldan boshqariladi.
export const wedding = {
  groom: { uz: 'Nabijon', ru: 'Набижон' },
  bride: { uz: 'Sevinchxon', ru: 'Севинчхон' },
  date: '2026-11-07',
  // Boshlanish vaqti O‘zbekiston vaqti bo‘yicha tasdiqlangan.
  startTime: '12:00' as string | null,
  utcOffset: '+05:00',
  venue: {
    name: { uz: 'Kelin tomoni to‘y manzili', ru: 'Место торжества со стороны невесты' },
    address: {
      uz: 'Google xaritada belgilangan manzil',
      ru: 'Место отмечено на Google Картах',
    },
    latitude: 40.417192,
    longitude: 70.897604,
    mapUrl: 'https://maps.google.com/maps?q=40.417192,70.897604&ll=40.417192,70.897604&z=16',
  },
  music: { src: '/music/benom-yoningdaman.mp3', title: 'Benom guruhi — Yoningdaman', volume: 0.55 },
  // Vercel domeni avtomatik aniqlanadi. O‘z domeningiz bo‘lsa shu yerga yozishingiz mumkin.
  siteUrl: '',
};
