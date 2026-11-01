import test from 'node:test';
import assert from 'node:assert/strict';
import {parameters,result,position} from '../public/physics.js';
import {Round,parseCommand,validateHistory} from '../public/round.js';
test('pendulum mass does not change small angle period; length does',()=>{
 const a=result('pendulum',{lengthA:1,lengthB:1,massA:0.1,massB:2});assert.equal(a.winner,'same');
 assert.ok(Math.abs(a.a-2.00606668)<1e-7);assert.equal(result('pendulum',{lengthA:.4,lengthB:1.6}).winner,'a');
});
test('friction positions stop at exact stopping distances',()=>{
 const p=parameters('friction');const r=result('friction',p),end=position('friction',p,100);assert.equal(r.winner,'a');assert.ok(Math.abs(r.a-end.a)<1e-10);assert.ok(Math.abs(r.b-end.b)<1e-10);assert.equal(position('friction',p,0).a,0);
});
test('buoyancy includes both, neither, neutral and swapped cases',()=>{
 assert.equal(result('buoyancy',{}).winner,'a');assert.equal(result('buoyancy',{densityA:1400,densityB:600}).winner,'b');
 assert.equal(result('buoyancy',{densityA:600,densityB:600}).winner,'same');assert.equal(result('buoyancy',{densityA:1000,densityB:1400}).winner,'same');
});
test('parameter trust boundary rejects coercion, NaN, out of bounds and unknown experiments',()=>{
 for(const bad of ['1',NaN,Infinity,0,100,null])assert.throws(()=>parameters('pendulum',{lengthA:bad}));assert.throws(()=>parameters('constructor'));assert.throws(()=>parameters('unknown'));assert.ok(Object.isFrozen(parameters('pendulum')));
});
test('chat parser accepts only the complete documented command',()=>{
 assert.equal(parseCommand(' !trial A '),'a');assert.equal(parseCommand('!TRIAL same'),'same');for(const x of ['!trial ab','hello !trial a','!trial a <script>','!trial',null])assert.equal(parseCommand(x),null);
});
test('round lifecycle and one voter can change their choice',()=>{
 const r=new Round();assert.throws(()=>r.run());r.open(30,1000);assert.ok(r.vote('u','a','d1',1100,1100));assert.ok(r.vote('u','b','d2',1200,1200));assert.deepEqual(r.counts(),{a:0,b:1,same:0});assert.equal(r.vote('v','a','d2',1200,1200),false);r.close();assert.equal(r.vote('v','a','d3',1300,1300),false);r.run(1400);assert.throws(()=>r.open());r.reveal();assert.equal(r.record().counts.b,1);
});
test('late, stale, future and pre round votes are not counted',()=>{
 const r=new Round();r.open(120,1000);for(const [t,now] of [[999,1100],[1200,121000],[50000,100000],[12000,1300]])assert.equal(r.vote('u','a',String(t),t,now),false);assert.equal(r.vote('u','same','good',2000,2200),true);
});
test('anonymous export has no identity and import rejects altered outcomes',()=>{
 const r=new Round();r.open(30,1000);r.vote('private-user-id','a','private-delivery',1100,1100);r.close();r.run(1200);r.reveal();const record=r.record();assert.ok(!JSON.stringify(record).includes('private'));assert.deepEqual(validateHistory({version:1,rounds:[record]}),[record]);assert.throws(()=>validateHistory({version:1,rounds:[{...record,outcome:'b'}]}));assert.throws(()=>validateHistory({version:1,rounds:[{...record,counts:{a:-1,b:0,same:0}}]}));
});
