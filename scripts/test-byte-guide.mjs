import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const sandbox={window:{}};
vm.runInNewContext(readFileSync(new URL('../dist/byte-guide-model.js',import.meta.url),'utf8'),sandbox);
const reply=sandbox.window.getByteReply;
for(const [question,href] of [
  ['Show me Ripple','/projects/ripple/'],['football tactics','/projects/ripple/'],
  ['Where is Makan Mana?','/projects/makan-mana/'],['plan a trip','/projects/makan-mana/'],
  ['AI interview','/projects/interview/'],['show travel photos','#photography'],
  ['What does Ziwei study?','#about'],['How can I contact him?','#contact'],
  ['I want his CV','#contact'],['show projects','#projects'],['go home','#home']
])assert.equal(reply(question).href,href,question);
assert.match(reply('Can you predict the weather?').text,/only answer questions about this site/);
assert.match(reply('<script>alert(1)</script>').text,/local portfolio guide/);
assert.match(reply('resume').text,/not been added/);
for(const q of ['',null,undefined,'x'.repeat(5000)])assert.ok(reply(q).text);
console.log('Passed: Byte project/page routing, photo intent, résumé availability, unknown input, and bounded messages.');
