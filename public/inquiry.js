import {EXPERIMENTS, parameters, result} from './physics.js';

export const CHALLENGES = Object.freeze({
  mass: {kind:'pendulum', title:'Does heavier mean faster?', prompt:'Same string lengths. Different bob masses. Make a prediction before you run it.', params:parameters('pendulum',{lengthA:1,lengthB:1,massA:0.4,massB:1.2})},
  surface: {kind:'friction', title:'Can a surface change the finish?', prompt:'Both sleds start at the same speed. Only their surfaces are different.', params:parameters('friction')},
  density: {kind:'buoyancy', title:'Same size. Will both float?', prompt:'Two equal-sized blocks have different densities. Predict what the liquid will support.', params:parameters('buoyancy',{densityA:600,densityB:1200,fluid:1000})}
});

export function predictionSummary(counts, winner) {
  const choices=['a','b','same'];
  if(!choices.includes(winner)||!counts)throw new Error('A valid outcome and counts are required.');
  let total=0;
  for(const key of choices){if(!Number.isSafeInteger(counts[key])||counts[key]<0||counts[key]>5000)throw new Error('Invalid prediction count.');total+=counts[key];}
  if(total>5000)throw new Error('Too many predictions.');
  return {total, correct:counts[winner], percent:total?Math.round(100*counts[winner]/total):null,
    distribution:choices.map(choice=>({choice,count:counts[choice],percent:total?Math.round(100*counts[choice]/total):0}))};
}

export function compareExperiments(previous,current) {
  if(!previous||previous.kind!==current.kind)return null;
  const spec=Object.hasOwn(EXPERIMENTS,current.kind)?EXPERIMENTS[current.kind]:null;
  if(!spec)throw new Error('Choose a supported experiment.');
  const before=parameters(current.kind,previous.params),after=parameters(current.kind,current.params);
  const changes=spec.fields.filter(([key])=>Math.abs(before[key]-after[key])>1e-9)
    .map(([key,label,,,,,unit])=>({key,label,unit,before:before[key],after:after[key]}));
  const oldResult=result(current.kind,before),newResult=result(current.kind,after);
  return {changes,controlled:changes.length===1,unchanged:changes.length===0,before:oldResult,after:newResult};
}

export function controlledRetest(kind,values) {
  const p=parameters(kind,values);let key,value;
  if(kind==='pendulum'){key='lengthA';value=p.lengthA===p.lengthB?(p.lengthB>0.4?Math.max(0.4,p.lengthB-0.2):0.6):p.lengthB;value=Number(value.toFixed(1));}
  else if(kind==='friction'){key='muB';value=p.muB===p.muA?(p.muA<=0.5?p.muA+0.1:p.muA-0.1):p.muA;value=Number(value.toFixed(2));}
  else{key='densityB';value=p.densityB<p.fluid?p.fluid+200:p.fluid-200;}
  const next=parameters(kind,{...p,[key]:value}),field=EXPERIMENTS[kind].fields.find(f=>f[0]===key);
  return {params:next,key,label:field[1],unit:field[6],before:p[key],after:value};
}
