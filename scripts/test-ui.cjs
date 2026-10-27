// Run with Playwright available in NODE_PATH. Uses a separate, headless browser.
const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
(async()=>{
  const base=process.env.TEST_URL||'http://127.0.0.1:4197';
  const server=process.env.TEST_URL?null:spawn(process.execPath,['scripts/serve.mjs'],{env:{...process.env,PORT:'4197'},stdio:'pipe'});
  if(server)await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);});
  let browser;
  const issues=[];
  try{
    browser=await chromium.launch({channel:'chrome',headless:true});
    const out=path.resolve('../portfolio-ui-checks');await fs.mkdir(out,{recursive:true});
    for(const width of [320,390,768,1440]){
      const context=await browser.newContext({viewport:{width,height:844},colorScheme:'dark',reducedMotion:'reduce',isMobile:width<700,hasTouch:width<700});
      const page=await context.newPage();page.on('pageerror',e=>issues.push(`${width}: ${e.message}`));
      const check=async(label)=>{
        const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
        if(overflow)issues.push(`${width}: overflow on ${label}`);
      };
      await page.goto(base+'/explore/',{waitUntil:'load'});
      assert.equal(await page.locator('.explore-card').count(),3);
      const cover=await page.locator('.explore-card img').first().boundingBox();
      assert.ok(Math.abs(cover.width/cover.height-1.5)<.02,'Explore covers retain their 3:2 ratio');
      await page.getByRole('button',{name:'Football & play',exact:true}).click();
      assert.equal(await page.locator('.explore-card').count(),1);
      await page.getByRole('button',{name:'Save Ripple',exact:true}).click();
      await page.reload();
      await page.getByRole('button',{name:'My shortlist',exact:true}).click();
      assert.equal(await page.locator('.explore-card').count(),1);
      await page.getByRole('button',{name:'Remove Ripple',exact:true}).click();
      assert.equal(await page.locator('.explore-card').count(),0);
      await page.getByRole('button',{name:'Everything',exact:true}).click();
      for(const theme of ['light','dark']){
        await page.locator('.theme-toggle').click();
        assert.equal(await page.locator('html').getAttribute('data-theme'),theme);
        await page.reload();assert.equal(await page.locator('html').getAttribute('data-theme'),theme);
        await check('explore '+theme);
        if(width===390||width===1440)await page.screenshot({path:path.join(out,`explore-${width}-${theme}.png`),fullPage:true});
      }
      await page.goto(base+'/#projects');
      assert.equal(await page.locator('.header .theme-toggle').count(),1);
      assert.equal(await page.locator('.chapter-controls .theme-toggle').count(),0);
      await page.locator('.explore-link').waitFor({state:'visible'});
      await page.evaluate(()=>location.hash='about');await page.locator('#about.active').waitFor();
      await page.locator('[data-node="4"]').click();
      assert.ok(await page.locator('.skill-edge.connected').count()>=3,'NLP highlights multiple related disciplines');
      assert.match(await page.locator('.skill-related').textContent(),/Python/);
      assert.match(await page.locator('.home-content .eyebrow').textContent(),/DATA SCIENTIST/);
      if(width<700){
        await page.locator('.menu-toggle').click();
        await page.locator('.header nav').getByRole('link',{name:'About',exact:true}).click();
        await page.locator('#about.active').waitFor({state:'visible'});
        assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
      }
      if(width<1151)await page.locator('.menu-toggle').click();
      await page.locator('.explore-menu summary').click();await page.locator('.explore-dropdown a[href="#beyond"]').click();await page.locator('#beyond.active').waitFor();assert.equal(await page.locator('.explore-menu').getAttribute('open'),null);
      for(const theme of ['light','dark']){
        await page.locator('.theme-toggle').click();
        for(const id of ['home','about','projects','photography','beyond','playground','board-games','contact']){
          await page.evaluate(id=>location.hash=id,id);
          await page.locator('#'+id+'.active').waitFor({state:'visible'});
          await check(id+' '+theme);
          assert.equal(await page.locator('.chapter-dock').isVisible(),false,'No duplicate footer menu');
          assert.equal(await page.locator('.page:visible').count(),1);
          if(width===390||width===1440)await page.screenshot({path:path.join(out,`${id}-${theme}${width===1440?"-desktop":""}.png`),fullPage:true});
        }
      }
      await page.evaluate(()=>location.hash='beyond');await page.locator('#beyond.active').waitFor();
      for(const sport of ['volleyball','football','badminton']){await page.locator('[data-sport="'+sport+'"]').click();assert.equal(await page.locator('[data-sport="'+sport+'"]').getAttribute('aria-pressed'),'true');await page.locator('.sport-play').click();assert.match(await page.locator('.sport-feedback').textContent(),/1/);}
      await page.evaluate(()=>location.hash='playground');await page.locator('#playground.active').waitFor();
      await page.locator('#cluster-step').click();assert.match(await page.locator('.cluster-summary').textContent(),/Step|settled/);assert.match(await page.locator('.cluster-explanation').textContent(),/points changed groups/);
      await page.locator('.reaction-pad').click();await page.locator('.reaction-pad').click();assert.match(await page.locator('#reaction-status').textContent(),/early/);
      await page.locator('#reaction-reset').click();await page.locator('.reaction-pad').click();await page.locator('.reaction-pad[data-state="ready"]').waitFor();await page.locator('.reaction-pad').click();assert.match(await page.locator('#reaction-status').textContent(),/Round complete/);
      if(width===390){for(let round=1;round<5;round++){await page.locator('.reaction-pad').press('Space');await page.locator('.reaction-pad[data-state="ready"]').waitFor();await page.locator('.reaction-pad').press('Space');}assert.match(await page.locator('#reaction-status').textContent(),/Five rounds finished/);assert.match(await page.locator('.reaction-scores').textContent(),/average/);}
      await page.locator('.reaction-pad').click();await page.evaluate(()=>location.hash='board-games');await page.locator('#board-games.active').waitFor();assert.equal(await page.locator('.reaction-pad').getAttribute('data-state'),'idle');assert.equal(await page.locator('.game-box').count(),5);
      const gameUrls=['https://monopoly-deal.limziwei2004.workers.dev/','https://liar-bar-online.limziwei2004.workers.dev/','https://chess-online.limziwei2004.workers.dev/','https://bang-online.limziwei2004.workers.dev/','https://fortune-routes.pages.dev/'];
      for(let i=0;i<5;i++){await page.locator('.game-box').nth(i).click();assert.equal(await page.locator('.shelf-actions a').getAttribute('href'),gameUrls[i]);assert.equal(await page.locator('.game-box[aria-pressed="true"]').count(),1);assert.equal(await page.locator('.shelf-actions a').getAttribute('target'),'_blank');await check('selected game '+i);}
      await page.locator('.game-box').first().click();
      await page.locator('.byte-context-launch').click();assert.match(await page.locator('.byte-prompts').textContent(),/Help me choose a game/);await page.getByRole('button',{name:'Help me choose a game',exact:true}).click();assert.match(await page.locator('.byte-messages').textContent(),/Arcane Chess/);await page.locator('#byte-chat .close-dialog').click();
      for(const id of ['interview','ripple','makan-mana']){
        await page.goto(base+'/projects/'+id+'/');
        for(let i=0;i<2;i++){
          await page.locator('.theme-toggle').click();await check(id+' document');
          const theme=await page.locator('html').getAttribute('data-theme');
          if(width===390&&id==='ripple')await page.screenshot({path:path.join(out,`project-document-${theme}.png`),fullPage:true});
        }
      }
      await context.close();console.log(`Passed functional checks at ${width}px`);
    }
    const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'no-preference'});
    const page=await context.newPage();await page.goto(base+'/');
    await page.evaluate(()=>{location.hash='projects';setTimeout(()=>location.hash='contact',50);});
    await page.locator('#contact.active').waitFor();
    await page.waitForFunction(()=>!document.documentElement.classList.contains('is-routing'));
    assert.equal(await page.locator('.page:visible').count(),1);
    assert.equal(await page.locator('#main').getAttribute('aria-busy'),null);
    await context.close();
    assert.deepEqual(issues,[]);console.log('Passed theme persistence, filters, save/remove/reload, routes, rapid navigation, and overflow checks.');
  }finally{await browser?.close();server?.kill();}
})().catch(error=>{console.error(error);process.exitCode=1;});
