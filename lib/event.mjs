export function dateParts(date, language='uz') {
  const [year,month,day]=date.split('-').map(Number);
  const months={uz:['yanvar','fevral','mart','aprel','may','iyun','iyul','avgust','sentabr','oktabr','noyabr','dekabr'],ru:['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря']};
  const weeks={uz:['yakshanba','dushanba','seshanba','chorshanba','payshanba','juma','shanba'],ru:['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота']};
  return {year,month,day,label:`${day} ${months[language][month-1]} ${year}`,weekday:weeks[language][new Date(Date.UTC(year,month-1,day)).getUTCDay()]};
}
export function calendarCells(date) {
  const [year,month,day]=date.split('-').map(Number);
  const leading=(new Date(Date.UTC(year,month-1,1)).getUTCDay()+6)%7;
  return {day,cells:[...Array(leading).fill(null),...Array.from({length:new Date(Date.UTC(year,month,0)).getUTCDate()},(_,i)=>i+1)]};
}
export function countdown(date,time,offset,now=Date.now()) {
  const target=new Date(`${date}T${time||'00:00'}:00${offset}`).getTime();
  const difference=Math.max(0,target-now);
  return {days:time?Math.floor(difference/86400000):Math.ceil(difference/86400000),hours:Math.floor(difference/3600000)%24,minutes:Math.floor(difference/60000)%60,seconds:Math.floor(difference/1000)%60,elapsed:now>=target};
}
const escapeIcs=value=>String(value).replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
function fold(line){let result='',part='',bytes=0;for(const char of line){const size=new TextEncoder().encode(char).length;if(bytes+size>75){result+=part+'\r\n';part=' ';bytes=1;}part+=char;bytes+=size;}return result+part;}
export function buildIcs(event,language='uz') {
  const title=`${event.groom[language]} & ${event.bride[language]}`;
  const compact=value=>value.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  const start=event.startTime?`DTSTART:${compact(new Date(`${event.date}T${event.startTime}:00${event.utcOffset}`))}`:`DTSTART;VALUE=DATE:${event.date.replace(/-/g,'')}`;
  const end=event.startTime?[]:[`DTEND;VALUE=DATE:${new Date(new Date(event.date+'T00:00:00Z').getTime()+86400000).toISOString().slice(0,10).replace(/-/g,'')}`];
  return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Nabijon Sevinchxon Bride Side//Wedding//UZ','CALSCALE:GREGORIAN','BEGIN:VEVENT',`UID:nabijon-sevinchxon-kelin-${event.date}@invitation`,`DTSTAMP:${compact(new Date())}`,start,...end,`SUMMARY:${escapeIcs(title)}`,`LOCATION:${escapeIcs(event.venue.address[language]||event.venue.name[language])}`,`DESCRIPTION:${escapeIcs(event.venue.mapUrl)}`,`GEO:${event.venue.latitude};${event.venue.longitude}`,'END:VEVENT','END:VCALENDAR'].map(fold).join('\r\n')+'\r\n';
}
