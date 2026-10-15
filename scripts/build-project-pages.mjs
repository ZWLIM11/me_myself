import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import vm from 'node:vm';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const sandbox={window:{}};vm.createContext(sandbox);
for(const name of ['content.js','collections-content.js'])vm.runInContext(await readFile(path.join(root,name),'utf8'),sandbox);
const data=sandbox.window.PORTFOLIO,base='https://me-myself.limziwei2004.workers.dev';
const e=value=>String(value||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const url=value=>{if(!value)return '';try{const u=new URL(value,base+'/');return ['https:','http:'].includes(u.protocol)?u.href:'';}catch{return '';}};
const asset=value=>{const valid=url(value);return valid.startsWith(base+'/')?valid.slice(base.length):valid;};
for(const project of data.projects){
  if(!/^[a-z0-9-]+$/.test(project.id))throw new Error('Project id must be a safe URL segment');
  const study=data.caseStudies[project.id]||{},canonical=`${base}/projects/${project.id}/`;
  const fields=[['problem','The problem'],['role','My contribution'],['approach','The approach'],['results','Results & evidence'],['lessons','What I learned']].filter(([key])=>study[key]);
  const images=(study.screenshots||[]).filter(image=>url(image.src));
  const html=`<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#101412"><title>${e(project.title)} — Lim Ziwei</title><meta name="description" content="${e(project.subtitle)}"><link rel="canonical" href="${canonical}"><meta property="og:type" content="article"><meta property="og:title" content="${e(project.title)} — Lim Ziwei"><meta property="og:description" content="${e(project.subtitle)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${e(url(project.image))}"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/style.css?v=20261015-sections"><link rel="stylesheet" href="/project-page.css?v=20261015-sections"></head>
<body><a class="skip-link" href="#project-main">Skip to project</a><header class="case-header"><a class="logo" href="/#home" aria-label="Ziwei home">ZW<span>®</span></a><a class="text-link" href="/#projects">← All projects</a></header>
<main id="project-main" class="project-document"><p class="eyebrow">${e(project.label)} / SELECTED EXPLORATION</p><h1>${e(project.fullTitle)}</h1><p class="project-subtitle">${e(project.subtitle)}</p><div class="tags">${project.tags.map(tag=>`<span>${e(tag)}</span>`).join('')}</div><div class="case-actions">${url(study.demoUrl)?`<a class="button primary" href="${e(url(study.demoUrl))}" target="_blank" rel="noopener noreferrer">Open live app ↗</a>`:''}${url(project.url)?`<a class="text-link" href="${e(url(project.url))}" target="_blank" rel="noopener noreferrer">View repository ↗</a>`:''}<button class="text-link" id="share-project">Copy project link ↗</button><span id="share-status" role="status"></span></div><p id="share-fallback" hidden><a href="${canonical}">${canonical}</a></p><img class="case-cover" src="${e(asset(project.image))}" alt="${e(project.alt)}"><div class="case-overview"><section><p class="eyebrow">THE IDEA</p><h2>Project overview.</h2><p>${e(project.overview)}</p></section><aside><h2>Areas of exploration</h2><ul>${project.features.map(feature=>`<li>${e(feature)}</li>`).join('')}</ul></aside></div>
${fields.length?`<section class="case-written">${fields.map(([key,label])=>`<article><h2>${label}</h2><p>${e(study[key])}</p></article>`).join('')}</section>`:''}
${url(study.videoUrl)?`<section class="case-media"><h2>Project walkthrough.</h2><video controls playsinline preload="metadata" ${url(study.videoPoster)?`poster="${e(asset(study.videoPoster))}"`:''}><source src="${e(asset(study.videoUrl))}"><a href="${e(asset(study.videoUrl))}">Open video</a></video></section>`:''}
${images.length?`<section class="case-media"><h2>Behind the build.</h2>${images.map(image=>`<figure><img src="${e(asset(image.src))}" alt="${e(image.alt)}" loading="lazy"><figcaption>${e(image.caption)}</figcaption></figure>`).join('')}</section>`:''}
${!fields.length?'<p class="case-status">The detailed case study is being prepared. More about the process and results will be added here.</p>':''}
<nav class="case-more" aria-label="Other projects"><p class="eyebrow">KEEP EXPLORING</p>${data.projects.filter(p=>p.id!==project.id).map(p=>`<a href="/projects/${p.id}/">${e(p.title)} <span>↗</span></a>`).join('')}</nav></main><footer class="case-footer"><a href="/#contact">Let’s connect ↗</a><span>Lim Ziwei · Portfolio</span><button id="motion-toggle" type="button" aria-label="Reduce motion" aria-pressed="false">Motion: on</button></footer><script src="/motion.js?v=20261015-sections"></script><script src="/project-page.js?v=20261015-sections"></script></body></html>`;
  const destination=path.join(root,'projects',project.id);await mkdir(destination,{recursive:true});await writeFile(path.join(destination,'index.html'),html);
}
console.log(`Generated ${data.projects.length} standalone project pages.`);
