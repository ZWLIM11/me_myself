const PREFIX='photography/';
const MAX=10*1024*1024;
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
async function authorized(request,secret){
  if(!secret||secret.length<32)return false;
  const given=request.headers.get('Authorization')?.replace(/^Bearer /,'')||'';
  if(given.length>256)return false;
  const hash=async s=>new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)));
  const [a,b]=await Promise.all([hash(given),hash(secret)]);let diff=0;
  for(let i=0;i<a.length;i++)diff|=a[i]^b[i];return diff===0;
}
function metadata(input){
  const out={};
  for(const [field,max] of Object.entries({title:80,category:32,location:80,alt:200,caption:300})){
    if(typeof input[field]!=='string'||input[field].length>max)throw Error(`Check ${field} (maximum ${max} characters).`);
    out[field]=input[field].trim();
  }
  if(!out.title||!out.category||!out.alt)throw Error('Title, category, and image description are required.');
  out.published=input.published===false?'false':'true';
  if(new TextEncoder().encode(JSON.stringify(out)).length>1600)throw Error('Please shorten the photo details.');
  return out;
}
function photo(object){const id=object.key.slice(PREFIX.length);return {id,...object.customMetadata,published:object.customMetadata?.published!=='false',src:`/api/photography/image/${id}`,etag:object.etag};}
export async function onRequest({request,env,params}){
  const route=(Array.isArray(params.path)?params.path:[params.path||'']).join('/');
  const method=request.method;
  try{
    if(!env.PHOTOS)return json({error:'Photo storage is not connected yet. Follow PHOTOGRAPHY-SETUP.md to add the PHOTOS R2 binding.'},503);
    const admin=route==='manage'||method!=='GET';
    if(admin){
      if(!env.PHOTO_ADMIN_TOKEN||env.PHOTO_ADMIN_TOKEN.length<32)return json({error:'Set PHOTO_ADMIN_TOKEN to a random secret of at least 32 characters in Cloudflare, then redeploy.'},503);
      const origin=request.headers.get('Origin');
      if(origin&&origin!==new URL(request.url).origin)return json({error:'Request origin is not allowed.'},403);
      if(!await authorized(request,env.PHOTO_ADMIN_TOKEN))return json({error:'Incorrect editor key.'},401);
    }
    if(method==='GET'&&route.startsWith('image/')){
      const id=route.slice(6);if(!/^[a-f0-9-]{36}\.(jpg|png|webp)$/.test(id))return json({error:'Photo not found.'},404);
      const object=await env.PHOTOS.get(PREFIX+id);
      if(!object||object.customMetadata?.published==='false')return json({error:'Photo not found.'},404);
      return new Response(object.body,{headers:{'Content-Type':object.httpMetadata.contentType,'Cache-Control':'public, max-age=60','ETag':object.httpEtag,'X-Content-Type-Options':'nosniff'}});
    }
    if(method==='GET'&&(route===''||route==='manage')){
      let cursor,photos=[];
      do{const page=await env.PHOTOS.list({prefix:PREFIX,include:['customMetadata'],limit:1000,...(cursor?{cursor}:{})});photos.push(...page.objects.map(photo));cursor=page.truncated?page.cursor:undefined;}while(cursor);
      photos.sort((a,b)=>(b.created||'').localeCompare(a.created||''));
      return json({photos:route==='manage'?photos:photos.filter(p=>p.published)});
    }
    if(method==='POST'&&route===''){
      if(Number(request.headers.get('Content-Length'))>MAX+65536)return json({error:'Choose an image smaller than 10 MB.'},413);
      const form=await request.formData(),file=form.get('photo');
      if(!file||typeof file.arrayBuffer!=='function'||file.size>MAX||file.size===0)return json({error:'Choose a JPG, PNG or WebP image smaller than 10 MB.'},400);
      const bytes=new Uint8Array(await file.arrayBuffer());
      const signature=Array.from(bytes.slice(0,12));
      const ext=signature[0]===255&&signature[1]===216&&signature[2]===255?'jpg':signature.slice(0,8).join(',')==='137,80,78,71,13,10,26,10'?'png':String.fromCharCode(...signature.slice(0,4))==='RIFF'&&String.fromCharCode(...signature.slice(8,12))==='WEBP'?'webp':null;
      if(!ext)return json({error:'Only JPG, PNG and WebP images are supported.'},415);
      const details=metadata(JSON.parse(form.get('details')||'{}'));details.created=new Date().toISOString();
      const object=await env.PHOTOS.put(PREFIX+crypto.randomUUID()+'.'+ext,bytes,{httpMetadata:{contentType:ext==='jpg'?'image/jpeg':`image/${ext}`},customMetadata:details});
      return json({photo:photo(object)},201);
    }
    if(method==='PATCH'&&/^[a-f0-9-]{36}\.(jpg|png|webp)$/.test(route)){
      const input=await request.json(),details=metadata(input);
      const old=await env.PHOTOS.get(PREFIX+route);if(!old)return json({error:'Photo not found.'},404);
      if(input.etag!==old.etag)return json({error:'This photo changed in another tab. Refresh and try again.'},409);
      details.created=old.customMetadata.created;
      const object=await env.PHOTOS.put(old.key,old.body,{onlyIf:{etagMatches:old.etag},httpMetadata:old.httpMetadata,customMetadata:details});
      if(!object)return json({error:'This photo changed in another tab. Refresh and try again.'},409);
      return json({photo:photo(object)});
    }
    return json({error:'Not found.'},404);
  }catch(error){
    if(error instanceof SyntaxError||/Check |required|shorten/.test(error.message))return json({error:error.message},400);
    return json({error:'Could not save or load photographs. Please try again.'},500);
  }
}
