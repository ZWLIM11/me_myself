import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const events = new Map();
const windowEvents = new Map();
const queries = new Map();
let pending;
function element(kind, page = null) {
  const values = new Map();
  return {kind, values, style:{setProperty:(k,v)=>values.set(k,v),removeProperty:k=>values.delete(k)},
    closest(selector) { if(selector === '#home' || selector === '#contact') return selector === page ? this : null; return this; },
    matches:() => kind === 'button', getBoundingClientRect:() => ({left:0,top:0,width:200,height:100}), contains:other => other === null};
}
const hero = element('hero');
const orbit = element('orbit');
const context = {
  matchMedia(query) { const result = {matches:query.includes('hover'),addEventListener:(_,fn)=>{result.change=fn;}}; queries.set(query,result); return result; },
  document:{documentElement:{classList:{contains:()=>false}},querySelector:selector=>selector === '.hero-image' ? hero : selector === '.contact-art' ? orbit : null,addEventListener:(name,fn)=>events.set(name,fn)},
  window:{addEventListener:(name,fn)=>windowEvents.set(name,fn)},
  innerWidth:1000,innerHeight:800,requestAnimationFrame:fn=>{pending=fn;return 1;},cancelAnimationFrame:()=>{pending=null;},setTimeout
};
vm.runInNewContext(readFileSync(new URL('../dist/interactions.js',import.meta.url),'utf8'),context);
const move = (target,x=150,y=75,pointerType='mouse') => {events.get('pointermove')({target,clientX:x,clientY:y,pointerType}); if(pending){const fn=pending;pending=null;fn();}};
const button=element('button','#home');
move(button);
assert.equal(button.values.get('--magnet-x'),'2.5px');
assert.ok(hero.values.has('--hero-x'));
const card=element('card');
move(card);
assert.equal(button.values.size,0,'previous target resets');
assert.equal(card.values.get('--tilt-y'),'2deg');
assert.equal(hero.values.size,0,'hero resets outside home');
events.get('pointerout')({relatedTarget:null});
assert.equal(card.values.size,0,'leaving viewport resets tilt');
move(card,150,75,'touch');
assert.equal(card.values.size,0,'touch input does not tilt');
const reduced=queries.get('(prefers-reduced-motion: reduce)');
move(card); reduced.matches=true; reduced.change();
assert.equal(card.values.size,0,'changing motion preference clears active effects');
move(card); assert.equal(card.values.size,0,'reduced motion blocks new effects');
reduced.matches=false;
const replacement=element('card'); move(replacement);
assert.ok(replacement.values.has('--tilt-y'),'dynamically replaced project cards work');
windowEvents.get('hashchange')();
assert.equal(replacement.values.size,0,'navigation clears effects');
context.innerWidth=700;move(card);
assert.equal(card.values.size,0,'narrow zoomed view skips pointer effects');
context.innerWidth=1000;move(card);windowEvents.get('resize')();
assert.equal(card.values.size,0,'resizing clears existing transforms');
context.document.documentElement.classList.contains=()=>true;move(card);
assert.equal(card.values.size,0,'active resize skips effects');
console.log('Passed: magnetic buttons, card tilt, hero reset, pointer leave, touch, reduced motion, dynamic cards, navigation and zoom cleanup.');
