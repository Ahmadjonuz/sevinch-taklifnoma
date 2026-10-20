import type { Metadata, Viewport } from 'next';
import { wedding } from '@/config/wedding';
import { dateParts } from '@/lib/event.mjs';
import './globals.css';
const title=`${wedding.groom.uz} & ${wedding.bride.uz} — Kelin taklifnomasi`;
const description=`${dateParts(wedding.date,'uz').label}${wedding.startTime?`, soat ${wedding.startTime}`:''}. ${wedding.venue.address.uz}`;
const origin=wedding.siteUrl||process.env.NEXT_PUBLIC_SITE_URL||(process.env.VERCEL_PROJECT_PRODUCTION_URL?`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`:'http://localhost:3000');
export const metadata:Metadata={title,description,metadataBase:new URL(origin),openGraph:{title,description,type:'website',locale:'uz_UZ',alternateLocale:'ru_RU',images:[{url:'/share-card-kelin-v2.png',width:1200,height:630,alt:'Nabijon & Sevinchxon — 07.11.2026, 12:00'}]},twitter:{card:'summary_large_image',title,description,images:['/share-card-kelin-v2.png']},icons:{icon:'/icon.svg'}};
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:'#fff9f8'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="uz"><body>{children}</body></html>;}
