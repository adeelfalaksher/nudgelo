import test from 'node:test';
import assert from 'node:assert/strict';
import {Round,validateHistory} from '../public/round.js';

test('a full ballot rejects extra viewers while allowing an existing viewer to change their choice',()=>{
  const now=Date.now(),round=new Round();round.open(120,now,'twitch');
  for(let i=0;i<5000;i++)assert.equal(round.vote('viewer-'+i,'a','delivery-'+i,now+1,now+1),true);
  assert.equal(round.vote('extra-viewer','same','extra-delivery',now+1,now+1),false);
  assert.equal(round.vote('viewer-0','b','changed-delivery',now+1,now+1),true);
  assert.deepEqual(round.counts(),{a:4999,b:1,same:0});
});

test('a ballot caps delivery tracking and rejects overlong identifiers without counting them',()=>{
  const now=Date.now(),round=new Round();round.open(120,now,'twitch');
  assert.equal(round.vote('x'.repeat(101),'a','normal',now,now),false);
  assert.equal(round.vote('viewer','a','x'.repeat(201),now,now),false);
  for(let i=0;i<10000;i++)assert.equal(round.vote('viewer',i%2?'b':'a','message-'+i,now+1,now+1),true);
  assert.equal(round.vote('viewer','same','overflow-message',now+1,now+1),false);
  assert.deepEqual(round.counts(),{a:0,b:1,same:0});
});

test('session import rejects forged and oversized records and strips unrelated private metadata',()=>{
  const now=Date.now(),round=new Round();round.open(30,now);round.close();round.run(now);round.reveal();const record=round.record();
  assert.equal(validateHistory({version:1,rounds:Array.from({length:50},()=>record)}).length,50);
  for(const bad of [
    {version:1,rounds:Array.from({length:51},()=>record)},
    {version:1,rounds:[{...record,kind:'__proto__'}]},
    {version:1,rounds:[{...record,counts:{a:5000,b:1,same:0}}]},
    {version:1,rounds:[{...record,counts:{a:Number.MAX_SAFE_INTEGER+1,b:0,same:0}}]},
    {version:1,rounds:[{...record,params:{...record.params,lengthA:'<img src=x onerror=alert(1)>'}}]}
  ])assert.throws(()=>validateHistory(bad));
  const clean=validateHistory({version:1,token:'private-fixture-token',rounds:[{...record,viewer:'private-fixture-viewer',rawChat:'private-fixture-chat',params:{...record.params,extra:'private-fixture-value'}}]});
  assert.deepEqual(clean,[record]);assert.equal(JSON.stringify(clean).includes('private-fixture'),false);
});
