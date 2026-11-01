import test from 'node:test';
import assert from 'node:assert/strict';
import {CHALLENGES,predictionSummary,compareExperiments,controlledRetest} from '../public/inquiry.js';
import {EXPERIMENTS,parameters,result} from '../public/physics.js';

test('guided mass question isolates mass, then a one-variable retest changes the result',()=>{
  const p=CHALLENGES.mass.params;assert.equal(p.lengthA,p.lengthB);assert.notEqual(p.massA,p.massB);
  assert.equal(result('pendulum',p).winner,'same');
  const next=controlledRetest('pendulum',p),comparison=compareExperiments({kind:'pendulum',params:p},{kind:'pendulum',params:next.params});
  assert.equal(comparison.controlled,true);assert.deepEqual(comparison.changes.map(c=>c.key),['lengthA']);
  assert.equal(comparison.after.winner,'a');assert.equal(comparison.before.b,comparison.after.b);
});
test('recap separates zero predictions from a real zero percent match',()=>{
  assert.equal(predictionSummary({a:0,b:0,same:0},'a').percent,null);
  const r=predictionSummary({a:0,b:2,same:1},'a');assert.equal(r.total,3);assert.equal(r.percent,0);
  assert.equal(predictionSummary({a:2,b:1,same:1},'a').percent,50);
  for(const c of [{a:-1,b:0,same:0},{a:0.5,b:0,same:0},{a:5000,b:1,same:0}])assert.throws(()=>predictionSummary(c,'a'));
});
test('comparison does not label several changed variables as a controlled test',()=>{
  const p=parameters('pendulum'),same=compareExperiments({kind:'pendulum',params:p},{kind:'pendulum',params:p});assert.equal(same.unchanged,true);assert.equal(same.controlled,false);
  const changed=compareExperiments({kind:'pendulum',params:p},{kind:'pendulum',params:{...p,lengthA:1,massB:1.4}});assert.equal(changed.controlled,false);assert.equal(changed.changes.length,2);
  assert.equal(compareExperiments({kind:'friction',params:{}},{kind:'pendulum',params:p}),null);
});
test('suggested retests change exactly one bounded variable across slider extremes',()=>{
  for(const [kind,spec] of Object.entries(EXPERIMENTS))for(const end of [2,3,5]){
    const p=parameters(kind,Object.fromEntries(spec.fields.map(f=>[f[0],f[end]]))),next=controlledRetest(kind,p);
    const comparison=compareExperiments({kind,params:p},{kind,params:next.params});
    assert.equal(comparison.controlled,true,kind);assert.equal(comparison.changes[0].key,next.key);
  }
});
