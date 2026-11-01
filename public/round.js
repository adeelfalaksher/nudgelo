import {EXPERIMENTS, parameters, result} from './physics.js';
export const CHOICES = ['a','b','same'];
export function parseCommand(text) {
  if (typeof text !== 'string' || text.length > 50) return null;
  const match = /^!trial\s+(a|b|same)\s*$/i.exec(text.trim());
  return match?.[1].toLowerCase() ?? null;
}
export class Round {
  constructor(kind='pendulum', values={}) {this.kind=kind;this.params=parameters(kind,values);this.phase='setup';this.votes=new Map();this.deliveries=new Set();this.openedAt=0;this.deadline=0;this.startedAt=0;this.source='practice';}
  open(seconds=30, now=Date.now(), source='practice') {
    if(this.phase!=='setup') throw new Error('Start a new round first.');
    if(!Number.isInteger(seconds)||seconds<15||seconds>120||!['practice','twitch'].includes(source)) throw new Error('Choose a prediction window from 15 to 120 seconds.');
    this.source=source;this.phase='open';this.openedAt=now;this.deadline=now+seconds*1000;
  }
  vote(user,choice,delivery, timestamp,now=Date.now()) {
    if(this.phase!=='open'||now>=this.deadline||!CHOICES.includes(choice)||typeof user!=='string'||!user||user.length>100||typeof delivery!=='string'||!delivery||delivery.length>200||!Number.isFinite(timestamp)||timestamp<this.openedAt||timestamp>now+5000||now-timestamp>30000||this.deliveries.has(delivery))return false;
    if(this.deliveries.size>=10000||(!this.votes.has(user)&&this.votes.size>=5000))return false;
    this.deliveries.add(delivery);this.votes.set(user,choice);return true;
  }
  close(){if(this.phase==='open')this.phase='locked';}
  run(now=Date.now()){if(this.phase!=='locked')throw new Error('Close predictions before running.');this.phase='running';this.startedAt=now;}
  reveal(){if(this.phase!=='running')throw new Error('Run the experiment first.');this.phase='revealed';return result(this.kind,this.params);}
  counts(){const counts={a:0,b:0,same:0};for(const c of this.votes.values())counts[c]++;return counts;}
  record(){if(this.phase!=='revealed')throw new Error('Reveal the result before saving.');return{kind:this.kind,params:{...this.params},source:this.source,counts:this.counts(),outcome:result(this.kind,this.params).winner,at:new Date(this.startedAt).toISOString()};}
}
export function validateHistory(value) {
  if(!value||value.version!==1||!Array.isArray(value.rounds)||value.rounds.length>50)throw new Error('Choose a Trialroom session with up to 50 rounds.');
  return value.rounds.map(r=>{
    if(!r||!Object.hasOwn(EXPERIMENTS,r.kind)||!['practice','twitch'].includes(r.source)||!Number.isFinite(Date.parse(r.at))||!r.counts||typeof r.counts!=='object')throw new Error('This session record is not valid.');
    const p=parameters(r.kind,r.params),counts={};let total=0;
    for(const c of CHOICES){if(!Number.isSafeInteger(r.counts[c])||r.counts[c]<0||r.counts[c]>5000)throw new Error('This prediction count is not valid.');counts[c]=r.counts[c];total+=counts[c];}
    if(total>5000||r.outcome!==result(r.kind,p).winner)throw new Error('This result does not match its parameters.');
    return{kind:r.kind,params:{...p},source:r.source,counts,outcome:r.outcome,at:new Date(r.at).toISOString()};
  });
}
