'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, CalendarPlus, Check, Copy, Heart, MapPin, Music2, Pause, Share2 } from 'lucide-react';
import { wedding } from '@/config/wedding';
import { translations } from '@/lib/translations';
import { buildIcs, calendarCells, countdown, dateParts } from '@/lib/event.mjs';
import { Botanical, Flourish } from './ornament';

type Language='uz'|'ru';
type Remaining={days:number;hours:number;minutes:number;seconds:number;elapsed:boolean};
const particles=Array.from({length:42},(_,i)=>({left:`${(i*37+9)%100}%`,delay:`${(i%11)*0.17}s`,duration:`${5+(i%6)*0.55}s`,rotation:`${i*39}deg`}));
const coverPetals=Array.from({length:18},(_,i)=>({left:`${(i*43+7)%100}%`,top:`${(i*29+3)%88}%`,delay:`${(i%7)*-.73}s`,duration:`${6.5+(i%5)*.8}s`,scale:`${.55+(i%4)*.18}`,burst:`${i%2?-75:75}px`}));

export default function Invitation(){
  const [language,setLanguage]=useState<Language>('uz');
  const [opened,setOpened]=useState(false);
  const [revealing,setRevealing]=useState(false);
  const [celebrate,setCelebrate]=useState(false);
  const [playing,setPlaying]=useState(false);
  const [audioError,setAudioError]=useState(false);
  const [remaining,setRemaining]=useState<Remaining|null>(null);
  const [pastWedding,setPastWedding]=useState(false);
  const [notice,setNotice]=useState('');
  const audioRef=useRef<HTMLAudioElement>(null);
  const headingRef=useRef<HTMLHeadingElement>(null);
  const timerRef=useRef<ReturnType<typeof setTimeout>|null>(null);
  const revealTimerRef=useRef<ReturnType<typeof setTimeout>|null>(null);
  const t=translations[language];
  const date=dateParts(wedding.date,language);
  const calendar=calendarCells(wedding.date);
  const groom=wedding.groom[language],bride=wedding.bride[language];

  useEffect(()=>{
    try{const preferred=new URLSearchParams(window.location.search).get('lang')||localStorage.getItem('ns-language');if(preferred==='uz'||preferred==='ru')setLanguage(preferred);}catch{}
    return ()=>{if(timerRef.current)clearTimeout(timerRef.current);if(revealTimerRef.current)clearTimeout(revealTimerRef.current);};
  },[]);
  useEffect(()=>{document.documentElement.lang=language;try{localStorage.setItem('ns-language',language);}catch{}},[language]);
  useEffect(()=>{const previous=document.body.style.overflow;document.body.style.overflow=opened?previous:'hidden';return ()=>{document.body.style.overflow=previous;};},[opened]);
  useEffect(()=>{const update=()=>{setRemaining(countdown(wedding.date,wedding.startTime,wedding.utcOffset));setPastWedding(Date.now()>=Date.parse(`${wedding.date}T00:00:00${wedding.utcOffset}`)+86400000);};update();const interval=setInterval(update,1000);return ()=>clearInterval(interval);},[]);
  useEffect(()=>{if(!opened)return;headingRef.current?.focus({preventScroll:true});const timer=setTimeout(()=>setCelebrate(false),10000);return ()=>clearTimeout(timer);},[opened]);
  useEffect(()=>{if(!notice)return;const timer=setTimeout(()=>setNotice(''),4200);return ()=>clearTimeout(timer);},[notice]);
  useEffect(()=>{if(audioError)setNotice(t.audioError);},[audioError,t.audioError]);

  function play(){const audio=audioRef.current;if(!audio)return;audio.volume=wedding.music.volume;setAudioError(false);void audio.play().catch(()=>{setPlaying(false);setAudioError(true);});}
  function open(){
    if(revealing)return;
    play();
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){setOpened(true);setCelebrate(true);return;}
    setRevealing(true);
    revealTimerRef.current=setTimeout(()=>{setOpened(true);setCelebrate(true);},1350);
  }
  function toggleMusic(){if(playing)audioRef.current?.pause();else play();}
  async function copy(value:string,success:string){try{await navigator.clipboard.writeText(value);setNotice(success);}catch{setNotice(t.copyFailed);}}
  async function share(){
    const url=new URL(wedding.siteUrl||window.location.href);url.search='';url.hash='';url.searchParams.set('lang',language);
    if(navigator.share){try{await navigator.share({title:`${groom} & ${bride}`,text:t.coverLine,url:url.toString()});return;}catch(error){if(error instanceof DOMException&&error.name==='AbortError')return;}}
    try{await navigator.clipboard.writeText(url.toString());setNotice(t.shared);}catch{setNotice(t.shareFailed);}
  }
  function saveCalendar(){const blob=new Blob([buildIcs(wedding,language)],{type:'text/calendar;charset=utf-8'});const url=URL.createObjectURL(blob);const anchor=document.createElement('a');anchor.href=url;anchor.download='nabijon-sevinchxon-kelin-tomoni.ics';document.body.appendChild(anchor);anchor.click();anchor.remove();timerRef.current=setTimeout(()=>URL.revokeObjectURL(url),1000);setNotice(t.calendarDone);}
  const languageSwitch=<div className="language-switch" aria-label="Til / Язык">{(['uz','ru'] as const).map(lang=><button key={lang} type="button" aria-pressed={language===lang} onClick={()=>setLanguage(lang)}>{lang.toUpperCase()}</button>)}</div>;

  return <>
    <audio ref={audioRef} src={wedding.music.src} loop preload="none" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onError={()=>{setPlaying(false);setAudioError(true);}}/>
    {!opened&&<section className={`opening bride-opening ${revealing?'is-revealing':''}`} aria-label={t.invitation} aria-busy={revealing}>
      <div className="opening-aura" aria-hidden="true"><span/><span/><span/></div>
      <div className="cover-petals" aria-hidden="true">{coverPetals.map((petal,i)=><span key={i} style={{left:petal.left,top:petal.top,animationDelay:petal.delay,animationDuration:petal.duration,'--petal-scale':petal.scale,'--burst-x':petal.burst} as React.CSSProperties}/>)}</div>
      <div className="reveal-flash" aria-hidden="true"/>
      <div className="opening-top"><span>07 / 11 / 2026</span>{languageSwitch}</div>
      <div className="opening-center">
        <div className="bridal-stage">
          <Botanical className="cover-botanical cover-botanical-left"/><Botanical className="cover-botanical cover-botanical-right"/>
          <div className="bridal-card">
            <span className="card-shine" aria-hidden="true"/>
            <span className="card-orbit orbit-a" aria-hidden="true"/><span className="card-orbit orbit-b" aria-hidden="true"/>
            <span className="bridal-ribbon" aria-hidden="true"><i/><b>♡</b><i/></span>
            <p className="eyebrow cover-label">{t.coverHint}</p>

            <Flourish className="cover-flourish"/>
            <p className="cover-invitation">{t.invitation}</p>
            <h1><span>{groom}</span><i>&</i><span>{bride}</span></h1>
            <p className="cover-date">07 · 11 · 2026 <span>•</span> 12:00</p>
            <button className="pearl-open" onClick={open} aria-label={t.open} disabled={revealing}><span className="open-pulse" aria-hidden="true"/><Heart size={16} fill="currentColor"/><span>{t.open}</span><ArrowUpRight size={16}/></button>
          </div>
        </div>
        <p className="cover-line">{t.coverLine}</p>
        <span className="sound-hint"><Music2 size={12}/>{t.soundHint}</span>
      </div>
      <p className="opening-bottom">NABIJON <span>&</span> SEVINCHXON</p>
    </section>}

    <div className={`invitation bride-theme ${opened?'is-open':''}`} inert={!opened} aria-hidden={!opened}>
      <a className="skip-link" href="#main">{t.skip}</a>
      <header className="site-header"><a href="#home" className="monogram" aria-label="Nabijon va Sevinchxon">N<span>&</span>S</a><span className="header-date">07 · 11 · 2026 · 12:00</span>{languageSwitch}</header>
      <main id="main">
        <section className="hero" id="home">
          <Botanical className="botanical hero-left"/><Botanical className="botanical hero-right"/>
          <div className="hero-arch" aria-hidden="true"><span className="hero-pearl one"/><span className="hero-pearl two"/><span className="hero-pearl three"/></div>
          <div className="hero-content"><p className="eyebrow">{t.invitation}</p><Flourish className="hero-flourish"/>
          <h1 ref={headingRef} tabIndex={-1}><span>{groom}</span><i>&</i><span>{bride}</span></h1>
          <p className="hero-line">{t.heroLine}</p>
          <div className="hero-date"><span>{date.weekday}</span><strong>07 <i>/</i> 11 <i>/</i> 2026</strong><span>{wedding.startTime||t.forever}</span></div>
          <a className="scroll-link" href="#invitation">{t.discover}<ArrowDown size={17}/></a></div>
          <span className="vertical-note" aria-hidden="true">N & S — 2026</span>
        </section>

        <section className="letter-section section" id="invitation"><span className="section-number">01 /</span><p className="eyebrow">{t.letterEyebrow}</p><h2>{t.letterTitle}</h2><div className="small-rule"/><p className="letter-copy">{t.letterBody}</p><p className="signature-label">{t.withLove}</p><p className="signature">{groom} <i>&</i> {bride}</p><Flourish className="letter-flourish"/></section>

        <section className="countdown-section" aria-label={t.countLabel}><div className="countdown-frame"><p className="eyebrow">{t.countLabel}</p>{remaining?.elapsed?<h2 className="celebration-date">{pastWedding?t.past:t.today}</h2>:<div className={`countdown ${wedding.startTime?'with-time':''}`}>{(wedding.startTime?['days','hours','minutes','seconds'] as const:['days'] as const).map(unit=><div key={unit}><strong>{remaining?String(remaining[unit]).padStart(2,'0'):'—'}</strong><span>{t[unit]}</span></div>)}</div>}{!remaining?.elapsed&&<p className="count-note">{t.dayNote}</p>}<span className="count-star" aria-hidden="true">✧</span></div></section>

        <section className="date-section section" id="date"><div className="section-intro"><span className="section-number">02 /</span><p className="eyebrow">{t.dateEyebrow}</p><h2>{t.dateTitle}</h2></div><div className="date-grid">
          <div className="calendar"><div className="calendar-heading"><h3>{t.month}</h3><span>{date.year}</span></div><div className="calendar-grid">{t.week.map((day,i)=><span className="weekday" key={'week'+i}>{day}</span>)}{calendar.cells.map((day:number|null,i:number)=><span key={i} className={day===date.day?'selected-day':'calendar-day'} aria-label={day===date.day?date.label:undefined}>{day===date.day&&<Heart aria-hidden="true"/>}<span>{day}</span></span>)}</div><p className="calendar-caption">07.11.2026 <span>·</span> {date.weekday}</p></div>
          <div className="date-details"><div><span className="detail-label">{t.date}</span><strong>{date.label}</strong><p>{date.weekday}</p></div><div className="time-detail"><span className="detail-label">{t.time}</span>{wedding.startTime?<strong className="event-time">{wedding.startTime}</strong>:<p className="pending-time">{t.timePending}</p>}</div><button className="button outline" onClick={saveCalendar}><CalendarPlus size={17}/>{t.calendar}</button></div>
        </div></section>

        <section className="location-section section" id="location"><span className="section-number">03 /</span><p className="eyebrow">{t.locationEyebrow}</p><h2>{t.locationTitle}</h2><p className="location-description">{t.locationBody}</p>
          <div className="location-card"><div className="location-emblem" aria-hidden="true"><span className="orbit one"/><span className="orbit two"/><MapPin size={42} strokeWidth={1}/></div><h3>{wedding.venue.name[language]}</h3>{wedding.venue.address[language]&&<p>{wedding.venue.address[language]}</p>}<span className="coordinates">{wedding.venue.latitude}, {wedding.venue.longitude}</span><a href={wedding.venue.mapUrl} target="_blank" rel="noopener noreferrer" className="button primary">{t.map}<ArrowUpRight size={17}/></a><button className="text-button" onClick={()=>copy(`${wedding.venue.latitude}, ${wedding.venue.longitude}`,t.copied)}><Copy size={13}/>{t.copyCoords}</button></div>
        </section>

        <section className="closing"><Flourish/><p className="eyebrow">{t.forever}</p><h2>{t.closing}</h2><p>{t.closingText}</p><span className="closing-monogram" aria-hidden="true">N<i>&</i>S</span><button className="button outline" onClick={share}><Share2 size={16}/>{t.share}</button></section>
      </main><footer><span>NABIJON & SEVINCHXON</span><span>{t.footer}</span><span>07.11.2026 · 12:00</span></footer>
      <div className="music-control"><span className="music-caption">{audioError?t.audioError:wedding.music.title}</span><button onClick={toggleMusic} className={`music-button ${playing?'playing':''}`} aria-label={playing?t.pause:t.play} title={playing?t.pause:t.play}>{playing?<Pause size={19}/>:<Music2 size={19}/>}</button></div>
      {notice&&<div className="toast" role="status"><Check size={16}/>{notice}</div>}
    </div>
    {celebrate&&<div className="confetti" aria-hidden="true">{particles.map((particle,i)=><span key={i} style={{left:particle.left,animationDelay:particle.delay,animationDuration:particle.duration,'--rotation':particle.rotation} as React.CSSProperties}/>)}</div>}
    <noscript><div className="no-js"><h1>Nabijon & Sevinchxon</h1><p>07.11.2026 · 12:00</p><a href={wedding.venue.mapUrl}>Google xaritada ochish / Открыть Google Карты</a><p>Taklifnomani to‘liq ochish uchun JavaScript’ni yoqing.</p></div></noscript>
  </>;
}
