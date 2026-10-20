import test from 'node:test';
import assert from 'node:assert/strict';
import { dateParts,calendarCells,countdown,buildIcs } from '../lib/event.mjs';
const event={groom:{uz:'Nabijon',ru:'Набижон'},bride:{uz:'Sevinchxon',ru:'Севинчхон'},date:'2026-11-07',startTime:null,utcOffset:'+05:00',venue:{name:{uz:'Kelin tomoni to‘y manzili',ru:'Место торжества со стороны невесты'},address:{uz:'Google xaritada belgilangan manzil',ru:'Место отмечено на Google Картах'},latitude:40.417192,longitude:70.897604,mapUrl:'https://maps.google.com/maps?q=40.417192,70.897604&ll=40.417192,70.897604&z=16'}};
test('November 7 is Saturday, with deterministic Uzbek and Russian date labels',()=>{
  assert.equal(dateParts(event.date,'uz').label,'7 noyabr 2026');
  assert.equal(dateParts(event.date,'ru').weekday,'суббота');
  const {cells}=calendarCells(event.date);
  assert.equal(cells.indexOf(7)%7,5);
  assert.equal(cells.filter(Boolean).length,30);
});
test('unconfirmed time counts days without inventing a start time',()=>{
  const remaining=countdown(event.date,null,'+05:00',new Date('2026-11-06T12:00:00+05:00').getTime());
  assert.equal(remaining.days,1);assert.equal(remaining.elapsed,false);
  const ics=buildIcs(event);
  assert.ok(ics.includes('DTSTART;VALUE=DATE:20261107'));
  assert.ok(ics.includes('DTEND;VALUE=DATE:20261108'));
  assert.ok(ics.includes('GEO:40.417192;70.897604'));
  const unfolded=ics.replace(/\r\n /g,'');
  assert.ok(unfolded.includes(event.venue.mapUrl.replaceAll(',','\\,')));
});
test('confirmed time produces the correct UTC instant and a clamped countdown',()=>{
  const timed={...event,startTime:'12:00'};
  assert.ok(buildIcs(timed).includes('DTSTART:20261107T070000Z'));
  assert.equal(countdown(timed.date,timed.startTime,timed.utcOffset,Date.parse('2026-11-07T06:00:00Z')).hours,1);
  assert.deepEqual(countdown(timed.date,timed.startTime,timed.utcOffset,Date.parse('2026-11-08T13:00:00Z')),{days:0,hours:0,minutes:0,seconds:0,elapsed:true});
});
test('Russian calendar content keeps CRLF line folding within 75 UTF-8 bytes',()=>{
  const ics=buildIcs({...event,venue:{...event.venue,address:{uz:'',ru:'Свадебное торжество, приглашаем вас разделить нашу радость '.repeat(8)}}},'ru');
  for(const line of ics.split('\r\n'))assert.ok(new TextEncoder().encode(line).length<=75);
  assert.ok(ics.includes('Набижон & Севинчхон'));
});
