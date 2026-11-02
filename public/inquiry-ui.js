import {EXPERIMENTS,position,result} from './physics.js';
import {predictionSummary,compareExperiments} from './inquiry.js';

const choices=['a','b','same'];
function el(tag,className,text){const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;}
const label=(kind,choice)=>EXPERIMENTS[kind].choices[choices.indexOf(choice)];

export function renderProgress(root,phase){
  if(root.dataset.phase===phase)return;root.dataset.phase=phase;
  const current={setup:0,open:1,locked:2,running:2,revealed:3}[phase];
  root.replaceChildren(...['Set a question','Predict','Run the model','Explain'].map((text,index)=>{
    const item=el('li',index===current?'current':index<current?'complete':'');
    if(index===current)item.setAttribute('aria-current','step');
    const number=el('span','progress-number',index<current?'✓':String(index+1).padStart(2,'0'));number.setAttribute('aria-hidden','true');
    item.append(number,el('span','',text));return item;
  }));
}

export function renderRecap(root,round){
  const stats=predictionSummary(round.counts(),result(round.kind,round.params).winner),spec=EXPERIMENTS[round.kind];
  const section=el('section','prediction-recap');section.setAttribute('aria-labelledby','recap-title');
  const head=el('div','recap-head'),title=el('h3','','What did the room predict?');title.id='recap-title';
  head.append(title,el('span','source-pill',round.source==='twitch'?'Twitch chat':'Local practice'));section.append(head);
  section.append(el('p','recap-summary',!stats.total?'No predictions this round. You can still explore the model result.':round.source==='practice'?
    (stats.correct?'Your local prediction matched the model.':'Your local prediction did not match the model. What would you change next?'):
    `${stats.correct} of ${stats.total} viewers predicted the outcome (${stats.percent}%).`));
  if(stats.total){
    const list=el('ul','recap-bars');
    for(const row of stats.distribution){
      const item=el('li',row.choice===result(round.kind,round.params).winner?'correct':'');
      const track=el('span','recap-track');track.setAttribute('aria-hidden','true');const fill=el('span','recap-fill');fill.style.width=(100*row.count/stats.total)+'%';track.append(fill);
      item.append(el('span','recap-label',spec.choices[choices.indexOf(row.choice)]),track,el('span','recap-count',`${row.count} · ${row.percent}%`));list.append(item);
    }section.append(list);
  }
  section.append(el('p','hint',round.source==='practice'?'These are choices on this device, not Twitch activity.':'Each viewer has one current choice. A changed prediction replaces the earlier one.'));
  root.append(section);
}

export function renderComparison(root,previous,current){
  const comparison=compareExperiments(previous,current);if(!comparison||comparison.unchanged)return;
  const section=el('section','comparison-panel');section.setAttribute('aria-labelledby','comparison-title');
  section.append(el('p','eyebrow',comparison.controlled?'One variable changed':'Multiple variables changed'));
  const title=el('h3','','What changed from the last test?');title.id='comparison-title';section.append(title);
  const changes=el('ul','change-list');for(const change of comparison.changes)changes.append(el('li','',`${change.label}: ${change.before} → ${change.after} ${change.unit}`));section.append(changes);
  section.append(el('p','',comparison.controlled?'All other model inputs stayed fixed. Compare the measured outcomes below.':'Several inputs changed. This comparison does not isolate a single variable’s effect.'));
  const table=el('table','comparison-table'),caption=el('caption','sr-only','Calculated measurements before and after the change');
  const head=el('thead'),headRow=el('tr');for(const text of ['Measurement','Previous','This round']){const th=el('th','',text);th.scope='col';headRow.append(th);}head.append(headRow);
  const body=el('tbody');for(const key of ['a','b']){const tr=el('tr'),th=el('th','',key.toUpperCase()+' · '+comparison.after.unit);th.scope='row';tr.append(th,el('td','',comparison.before[key].toFixed(3)),el('td','',comparison.after[key].toFixed(3)));body.append(tr);}table.append(caption,head,body);section.append(table);
  const same=comparison.before.winner===comparison.after.winner;
  section.append(el('p','comparison-takeaway',same?'The correct choice stayed the same. The measurements show whether anything else changed.':`The correct choice changed: ${label(current.kind,comparison.before.winner)} → ${label(current.kind,comparison.after.winner)}.`));
  root.append(section);
}

export function renderTrace(root,kind,params){
  if(kind==='buoyancy')return;
  const svgNS='http://www.w3.org/2000/svg',svg=document.createElementNS(svgNS,'svg');svg.setAttribute('viewBox','0 0 640 180');svg.setAttribute('role','img');
  const name=kind==='pendulum'?'Swing angle':'Distance traveled';
  svg.setAttribute('aria-label',`${name} for A and B over eight model seconds. A is a solid line; B is a dashed line. Numerical outcomes are listed above.`);
  const make=(tag,attrs,text)=>{const n=document.createElementNS(svgNS,tag);for(const [k,v]of Object.entries(attrs))n.setAttribute(k,String(v));if(text!==undefined)n.textContent=text;return n;};
  const r=result(kind,params),min=kind==='pendulum'?-10:0,max=kind==='pendulum'?10:Math.max(r.a,r.b)*1.05;
  const x=t=>56+t/8*566,y=value=>18+(max-value)/(max-min)*124;
  for(const value of [min,(min+max)/2,max]){svg.append(make('line',{x1:56,x2:622,y1:y(value),y2:y(value),class:'trace-grid'}),make('text',{x:46,y:y(value)+4,'text-anchor':'end',class:'trace-tick'},kind==='pendulum'?value+'°':value.toFixed(1)));}
  for(const t of [0,4,8])svg.append(make('text',{x:x(t),y:167,'text-anchor':'middle',class:'trace-tick'},t+'s'));
  for(const key of ['a','b']){const points=Array.from({length:161},(_,i)=>{const t=i/20;return x(t).toFixed(2)+','+y(position(kind,params,t)[key]).toFixed(2);}).join(' ');svg.append(make('polyline',{points,fill:'none',class:'trace-'+key}));}
  const figure=el('figure','model-trace');figure.append(el('figcaption','',`${name} · calculated from this round’s model`),svg);
  const legend=el('div','trace-legend');legend.append(el('span','legend-a','A · solid'),el('span','legend-b','B · dashed'));figure.append(legend);root.append(figure);
}

const notebookState=new WeakMap();
export function renderNotebook(root,history,phase,onRepeat){
  const disabled=!['setup','revealed'].includes(phase),state=notebookState.get(root);
  if(state?.history===history&&state.disabled===disabled)return;notebookState.set(root,{history,disabled});
  root.replaceChildren();if(!history.length){root.append(el('p','notebook-empty','Your experiment notebook starts after your first reveal.'));return;}
  const head=el('div','notebook-head');head.append(el('h2','','Your experiment notebook'),el('span','hint',history.length+' saved round'+(history.length===1?'':'s')));root.append(head);
  const list=el('ol','notebook-list');
  history.slice(-5).reverse().forEach((record,index)=>{
    const row=el('li'),number=el('span','notebook-number',String(history.length-index).padStart(2,'0')),text=el('div','notebook-description');
    text.append(el('strong','',EXPERIMENTS[record.kind].title),el('span','',label(record.kind,record.outcome)+' · '+(record.source==='practice'?'practice':'Twitch')+' record'));
    const button=el('button','button secondary','Repeat settings');button.type='button';button.disabled=disabled;button.setAttribute('aria-label','Repeat settings from round '+(history.length-index));button.addEventListener('click',()=>onRepeat(record));row.append(number,text,button);list.append(row);
  });root.append(list,el('p','hint','The latest five anonymous records are shown. Imports may be included; this is not a verified chat log. Download the session to keep all saved rounds.'));
}
