import {parameters,position,result} from './physics.js';
let serial=0;
export function createScene(host,kind,values){
  const p=parameters(kind,values),id='scene-'+(++serial),r=result(kind,p);
  const screws=(x,y)=>`<circle cx="${x}" cy="${y}" r="4" fill="#e7eefb"/><path d="M${x-2} ${y}h4" stroke="#647da8"/>`;
  const base=`<ellipse cx="320" cy="397" rx="250" ry="22" fill="#d5dff0"/><path d="M70 360 510 360 572 389 130 389Z" fill="#f4f7fd" stroke="#c4d0e5"/><path d="M130 389h442v20H130Z" fill="#dce5f3"/><path d="M70 360 130 389v20l-60-29Z" fill="#b8c9e1"/><rect x="143" y="408" width="40" height="9" rx="4" fill="#8098c0"/><rect x="496" y="408" width="40" height="9" rx="4" fill="#8098c0"/>`;
  const top=`<defs><radialGradient id="${id}-blue" cx="28%" cy="24%"><stop stop-color="#b5ceff"/><stop offset=".45" stop-color="#5e88ed"/><stop offset="1" stop-color="#284db0"/></radialGradient><radialGradient id="${id}-coral" cx="28%" cy="24%"><stop stop-color="#ffe1bc"/><stop offset=".45" stop-color="#ffb487"/><stop offset="1" stop-color="#c77050"/></radialGradient></defs>`;
  let drawing='';
  if(kind==='pendulum'){
    drawing=base+`<path d="M115 359V58h390v301h-16V74H131v285Z" fill="#5d83bd" stroke="#365a93" stroke-width="2"/><path d="M115 58l10-9h390l-10 9Z" fill="#88a8d7"/><path d="M505 58l10-9v300l-10 10Z" fill="#365a93"/>`;
    drawing+=`<rect x="481" y="112" width="14" height="210" rx="2" fill="#fff1cd"/>`;
    for(let i=0;i<21;i++)drawing+=`<path d="M481 ${119+i*9}h${i%5?6:11}" stroke="#8a754b" stroke-width="1"/>`;
    drawing+=screws(123,65)+screws(497,65)+screws(123,349)+screws(497,349);
    for(const [i,c] of ['a','b'].entries()){
      const x=235+i*155,l=60+p['length'+c.toUpperCase()]*110,radius=18+Math.sqrt(p['mass'+c.toUpperCase()])*7;
      drawing+=`<circle cx="${x}" cy="83" r="13" fill="#d2e0f4" stroke="#89a2c9"/><circle cx="${x}" cy="83" r="5" fill="#4d76b2"/><g data-arm="${c}"><line x1="${x}" y1="83" x2="${x}" y2="${83+l}" stroke="#7c8fae" stroke-width="2"/><circle cx="${x}" cy="${83+l}" r="${radius}" fill="url(#${id}-${i?'coral':'blue'})" stroke="#587bb8"/><circle cx="${x}" cy="${83+l}" r="12" fill="#fff"/><text x="${x}" y="${88+l}" text-anchor="middle" fill="#284b80" font-size="14" font-weight="800">${c.toUpperCase()}</text></g>`;
    }
  }else if(kind==='friction'){
    drawing=base;
    for(const [i,c] of ['a','b'].entries()){
      const y=210+i*90;drawing+=`<path d="M100 ${y+21}h420l32 17H132Z" fill="${i?'#f4ded0':'#dbe6f7'}" stroke="#b1c2db"/>`;
      for(let n=0;n<19;n++)drawing+=`<path d="M${120+n*21} ${y+25}v${n%3?4:8}" stroke="#9fb4d3"/>`;
      drawing+=`<text x="83" y="${y+16}" fill="#49638e" font-size="21">${c.toUpperCase()}</text><g data-sled="${c}"><path d="M110 ${y-11}h45l18 10h-45Z" fill="${i?'#ffb38e':'#83a6f0'}"/><path d="M128 ${y-1}h45v20h-45Z" fill="${i?'#e99c77':'#3864d9'}"/><path d="M110 ${y-11}l18 10v20l-18-10Z" fill="${i?'#bd7151':'#264ab0'}"/><path d="M120 ${y+19}h65M119 ${y+22}h65" stroke="#627799" stroke-width="3"/>${screws(141,y+7)}</g>`;
    }
    drawing+=`<text x="110" y="157" fill="#49638e" font-size="16">Same launch · ${p.speed} m/s</text>`;
  }else{
    drawing=base;
    for(const [i,c] of ['a','b'].entries()){
      const x=155+i*210;drawing+=`<rect x="${x}" y="119" width="142" height="240" rx="8" fill="#f6f9ff" stroke="#a3b8d8" stroke-width="3"/><rect x="${x+3}" y="174" width="136" height="179" fill="#c6ddfa"/><path d="M${x} 174h142" stroke="#82a4d2" stroke-width="2"/>`;
      for(let n=0;n<10;n++)drawing+=`<path d="M${x+125} ${180+n*17}h${n%3?9:14}" stroke="#8eabd3"/>`;
      drawing+=`<g data-block="${c}"><path d="M${x+38} 125h48l18 12h-48Z" fill="${i?'#ffbd98':'#8cacf3'}"/><path d="M${x+56} 137h48v42h-48Z" fill="${i?'#e99c77':'#3864d9'}"/><path d="M${x+38} 125l18 12v42l-18-12Z" fill="${i?'#b87759':'#2a4dae'}"/><text x="${x+79}" y="165" text-anchor="middle" fill="${i?'#4f2e26':'#fff'}" font-size="20" font-weight="600">${c.toUpperCase()}</text></g><rect x="${x-5}" y="112" width="152" height="9" rx="4" fill="#b8cbe8"/>`;
    }
    drawing+=`<text x="320" y="78" text-anchor="middle" fill="#49638e" font-size="16">Liquid · ${p.fluid} kg/m³</text>`;
  }
  host.innerHTML=`<svg viewBox="0 0 640 440" role="img" aria-label="${kind==='pendulum'?'Two pendulums on a calibrated stand':kind==='friction'?'Two sleds on parallel friction tracks':'Two blocks in separate liquid tanks'}">${top}${drawing}</svg>`;
  const svg=host.firstElementChild;const arms=[...svg.querySelectorAll('[data-arm]')],sleds=[...svg.querySelectorAll('[data-sled]')],blocks=[...svg.querySelectorAll('[data-block]')];
  const update=seconds=>{
    const v=position(kind,p,seconds);
    arms.forEach((arm,i)=>arm.setAttribute('transform',`rotate(${i?v.b:v.a} ${235+i*155} 83)`));
    sleds.forEach((sled,i)=>sled.setAttribute('transform',`translate(${(i?v.b:v.a)*40} 0)`));
    blocks.forEach((block,i)=>{const ratio=i?r.b:r.a,target=ratio<1?-5+42*ratio:ratio===1?100:174;block.setAttribute('transform',`translate(0 ${target*(1-Math.exp(-Math.max(0,seconds)*1.3))})`);});
  };
  update(0);return{update,result:r};
}
