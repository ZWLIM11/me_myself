import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../functions/api/photography/[[path]].js',import.meta.url),'utf8');
const {onRequest}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const store=new Map();
const bucket={
  async put(key,body,options){const bytes=body instanceof Uint8Array?body:new Uint8Array(await new Response(body).arrayBuffer());const object={key,bytes,etag:crypto.randomUUID(),httpMetadata:options.httpMetadata,customMetadata:options.customMetadata};store.set(key,object);return object;},
  async get(key){const object=store.get(key);return object?{...object,body:object.bytes,httpEtag:'"'+object.etag+'"'}:null;},
  async list(){return {objects:[...store.values()],truncated:false};}
};
const token='test-only-key-012345678901234567890123456789';
const env={PHOTOS:bucket,PHOTO_ADMIN_TOKEN:token};
const call=(path='',method='GET',body,auth=false,extra={})=>onRequest({env,params:{path:path.split('/')},request:new Request('https://portfolio.test/api/photography/'+path,{method,body,headers:{...(auth?{Authorization:'Bearer '+token}:{}),...extra}})});
const details={title:'Evening light',category:'City',location:'Kuala Lumpur',alt:'An evening skyline',caption:'After the rain.',published:true};
function upload(type='image/png',bytes=new Uint8Array([137,80,78,71,13,10,26,10,0])){const form=new FormData();form.set('photo',new Blob([bytes],{type}),'photo.png');form.set('details',JSON.stringify(details));return form;}
assert.equal((await call('','POST',upload())).status,401);
assert.equal((await call('manage')).status,401);
assert.equal((await call('','POST',upload(),true,{Origin:'https://other.test'})).status,403);
assert.equal((await call('','POST',upload('image/svg+xml',new TextEncoder().encode('<svg/>')),true)).status,415);
const created=await call('','POST',upload(),true);assert.equal(created.status,201);const item=(await created.json()).photo;
assert.equal((await (await call()).json()).photos.length,1);
assert.equal((await call('image/'+item.id)).headers.get('Content-Type'),'image/png');
assert.equal((await call(item.id,'PATCH',JSON.stringify({...details,etag:item.etag,title:'Changed'}))).status,401);
const edited=await call(item.id,'PATCH',JSON.stringify({...details,etag:item.etag,title:'Changed',published:false}),true);assert.equal(edited.status,200);
assert.equal((await (await call()).json()).photos.length,0);
assert.equal((await call('image/'+item.id)).status,404);
const hidden=(await (await call('manage','GET',undefined,true)).json()).photos[0];assert.equal(hidden.title,'Changed');
assert.equal((await call(item.id,'PATCH',JSON.stringify({...details,etag:hidden.etag,published:true}),true)).status,200);
assert.equal((await (await call()).json()).photos.length,1);
const unconfigured=await onRequest({env:{},params:{path:[]},request:new Request('https://portfolio.test/api/photography/')});assert.equal(unconfigured.status,503);
console.log('Passed: auth, origin protection, file validation, upload, gallery, edit, hide, restore and missing storage. R2 mocked; cloud deployment requires separate verification.');
