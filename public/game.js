import {parameters, result, EXPERIMENTS} from './physics.js';
import {Round, CHOICES} from './round.js';

export const MISSIONS = Object.freeze({
  sync: {
    title:'Find the rhythm', short:'Synchronize', kind:'pendulum', number:'01',
    brief:'Bring the two pendulums into sync. Chat controls the left pendulum. You have five moves.',
    target:'Periods within 2% of each other', unit:'% apart',
    params:{lengthA:0.4,lengthB:1.2,massA:0.4,massB:1.2},
    actions:[['lengthA',0.2,'Lengthen A','+0.2 m'],['lengthA',-0.2,'Shorten A','−0.2 m'],['massA',0.2,'Add mass to A','+0.2 kg']],
    measure:p=>Math.abs(result('pendulum',p).a/result('pendulum',p).b-1)*100,
    win:p=>Math.abs(result('pendulum',p).a/result('pendulum',p).b-1)<=0.02+1e-9,
    clue:'The period depends on string length. Mass changes the bob, but not its rhythm in this ideal model.'
  },
  brake: {
    title:'Stop on the mark', short:'Precision braking', kind:'friction', number:'02',
    brief:'Land sled A between 1.40 and 1.70 metres. Chat tunes its friction or the shared launch speed.',
    target:'A stops between 1.40–1.70 m', unit:'m traveled by A',
    params:{muA:0.15,muB:0.3,speed:3},
    actions:[['muA',0.05,'More friction','+0.05 μ'],['muA',-0.05,'Less friction','−0.05 μ'],['speed',0.5,'Faster launch','+0.5 m/s']],
    measure:p=>result('friction',p).a,
    win:p=>result('friction',p).a>=1.4&&result('friction',p).a<=1.7,
    clue:'More friction shortens the glide. Launch speed affects distance quadratically. The target stays fixed.'
  },
  balance: {
    title:'Neither float nor fall', short:'Neutral buoyancy', kind:'buoyancy', number:'03',
    brief:'Suspend block B in the liquid. Match its density to the liquid within 1%. More than one route works.',
    target:'B density ratio between 0.99–1.01', unit:'B / liquid density',
    params:{densityA:600,densityB:1200,fluid:1000},
    actions:[['densityB',-100,'Lighten B','−100 kg/m³'],['densityB',100,'Densify B','+100 kg/m³'],['fluid',100,'Denser liquid','+100 kg/m³']],
    measure:p=>p.densityB/p.fluid,
    win:p=>Math.abs(p.densityB/p.fluid-1)<=0.01+1e-9,
    clue:'Equal densities give neutral buoyancy. The block stays suspended; it does not float at the surface.'
  }
});

export function consensus(counts) {
  const ranked=CHOICES.map(choice=>({choice,count:counts[choice]})).sort((a,b)=>b.count-a.count);
  if(!ranked[0].count)return {choice:null,reason:'No votes received. No move spent.'};
  if(ranked[0].count===ranked[1].count)return {choice:null,reason:'The vote is tied. Discuss it and vote again. No move spent.'};
  return {choice:ranked[0].choice,reason:''};
}

export class LabGame {
  constructor(mission='sync') {
    if(!Object.hasOwn(MISSIONS,mission))throw new Error('Choose an available mission.');
    this.mission=mission;this.spec=MISSIONS[mission];this.params=parameters(this.spec.kind,this.spec.params);
    this.phase='ready';this.moves=0;this.limit=5;this.turns=[];this.ballot=null;this.message='Choose together. Test the idea. Hit the target.';
  }
  open(source='practice',seconds=30,now=Date.now()) {
    if(!['ready','feedback'].includes(this.phase))throw new Error('Finish this turn first.');
    this.ballot=new Round(this.spec.kind,this.params);this.ballot.open(seconds,now,source);this.phase='voting';this.message='One current vote per viewer. You can change it before closing.';
  }
  vote(user,choice,delivery,timestamp,now=Date.now()) {
    return this.phase==='voting'&&this.ballot.vote(user,choice,delivery,timestamp,now);
  }
  close(){if(this.phase==='voting'){this.ballot.close();this.phase='locked';}}
  cancel(message='Vote cancelled. No move spent.') {
    if(!['voting','locked'].includes(this.phase))return;
    this.ballot.close();this.phase='feedback';this.message=message;
  }
  apply(now=Date.now()) {
    if(this.phase!=='locked')throw new Error('Close voting before applying a move.');
    const counts=this.ballot.counts(),decision=consensus(counts);
    if(!decision.choice){this.phase='feedback';this.message=decision.reason;return null;}
    const [key,delta,label]=this.spec.actions[CHOICES.indexOf(decision.choice)];
    const [,,min,max]=EXPERIMENTS[this.spec.kind].fields.find(f=>f[0]===key);
    const next=Math.round(Math.max(min,Math.min(max,this.params[key]+delta))*10000)/10000;
    if(next===this.params[key]){this.phase='feedback';this.message=label+' is already at its limit. No move spent. Choose another control.';return null;}
    const before={...this.params};this.params=parameters(this.spec.kind,{...before,[key]:next});this.moves++;
    const turn={move:this.moves,choice:decision.choice,action:label,key,before,after:{...this.params},counts,source:this.ballot.source,measurement:this.spec.measure(this.params),goalMet:this.spec.win(this.params),at:new Date(now).toISOString()};
    this.turns.push(turn);this.phase='running';this.startedAt=now;this.message=label+': '+before[key]+' → '+next+'. Measuring the model…';
    return structuredClone(turn);
  }
  finish(){
    if(this.phase!=='running')throw new Error('Apply a move before measuring.');
    this.phase=this.spec.win(this.params)?'won':this.moves>=this.limit?'lost':'feedback';
    this.message=this.phase==='won'?'Target reached. You solved it together.':this.phase==='lost'?'Five moves used. Reset and try a different strategy.':this.spec.clue;
  }
  counts(){return this.ballot?.counts()??{a:0,b:0,same:0};}
  export(){return {format:'trialroom-mission',version:1,mission:this.mission,status:this.phase,moves:this.moves,turns:structuredClone(this.turns)};}
}
