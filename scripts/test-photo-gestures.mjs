import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
class Element {
  constructor(){this.events=new Map();this.children=new Map();this.style={};this.clientWidth=300;this.clientHeight=200;this.clicks=0;this.open=true;}
  querySelector(s){if(!this.children.has(s))this.children.set(s,new Element());return this.children.get(s);}
  querySelectorAll(){return [this.querySelector('button'),this.querySelector('plus'),this.querySelector('.zoom-reset')];}
  addEventListener(s,fn){this.events.set(s,fn);}
  fire(s,e={}){this.events.get(s)?.(e);}
  click(){if(this.disabled)return;this.clicks++;this.fire('click');}
  after(){} setPointerCapture(){} getAnimations(){return [];}
  getBoundingClientRect(){return {left:0,top:0,width:300,height:200};}
}
const lightbox=new Element(),stage=lightbox.querySelector('.lightbox-stage'),image=stage.querySelector('img');
const created=[],events=new Map();let pending=null;
const context={document:{hidden:false,querySelector:()=>lightbox,createElement:()=>{const el=new Element();created.push(el);return el;},addEventListener:(key,fn)=>events.set(key,fn)},addEventListener:(key,fn)=>events.set(key,fn),requestAnimationFrame:fn=>{pending=fn;return 1;},cancelAnimationFrame:()=>{pending=null;}};
const source=readFileSync(new URL('../dist/friendly.js',import.meta.url),'utf8');
vm.runInNewContext(source.slice(source.indexOf('  const lightbox='),source.indexOf('  // Horizontal touch')),context);
const flush=()=>{const fn=pending;pending=null;fn?.();};
const point=(id,x,y)=>({pointerId:id,clientX:x,clientY:y,button:0});
stage.fire('pointerdown',point(1,100,100));stage.fire('pointerdown',point(2,200,100));stage.fire('pointermove',point(2,300,100));flush();
assert.equal(image.style.scale,'2','pinch doubles zoom');
stage.fire('pointerup',point(2,300,100));stage.fire('pointermove',point(1,1000,900));flush();
assert.equal(image.style.translate,'150px 100px','pan clamps to image edges');stage.fire('pointerup',point(1,1000,900));
assert.equal(lightbox.querySelector('.lightbox-next').clicks,0,'pinch and pan do not change photo');
lightbox.fire('photo:change');assert.equal(image.style.scale,'1','new photo resets zoom');
stage.fire('pointerdown',point(1,220,100));stage.fire('pointerup',point(1,60,110));assert.equal(lightbox.querySelector('.lightbox-next').clicks,1,'left swipe advances');
stage.fire('pointerdown',point(1,100,100));stage.fire('pointerup',point(1,120,250));assert.equal(lightbox.querySelector('.lightbox-prev').clicks,0,'vertical movement does not swipe');
const plus=created[0].querySelector('plus');for(let i=0;i<10;i++)plus.click();assert.equal(image.style.scale,'4','zoom limited to 4x');
lightbox.fire('close');assert.equal(image.style.scale,'1');assert.equal(image.style.translate,'0px 0px');
stage.fire('pointerdown',point(1,200,100));stage.fire('pointercancel');stage.fire('pointerup',point(1,0,100));assert.equal(lightbox.querySelector('.lightbox-next').clicks,1,'cancelled gesture never advances');
console.log('Passed: pinch, bounded pan, swipe direction, zoom limits, image-change reset, close and cancellation.');
