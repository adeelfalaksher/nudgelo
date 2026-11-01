import {createScene} from './scene.js';
import {result} from './physics.js';
import {MISSIONS} from './game.js';

const arrow='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
const spark='<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2v28M2 16h28M6 6l20 20M26 6 6 26"/></svg>';
const details={
 sync:{category:'Find your rhythm',description:'Two pendulums. Different tempos. Can you get them swinging together?',hint:'A little timing. A little tinkering.',color:'blue'},
 brake:{category:'Stick the landing',description:'A moving sled. One small target. Find just the right amount of friction.',hint:'Less speed? More grip? Your call.',color:'peach'},
 balance:{category:'Find your balance',description:'Make a block hang in the water. Not floating. Not sinking. Just right.',hint:'There’s more than one way to get there.',color:'lavender'}
};

export function renderHome(app,{announce,reduced,connect}) {
 let frame=0,params={...MISSIONS.sync.params},scene=null,start=performance.now();
 app.innerHTML=`
 <section class="nudge-hero" aria-labelledby="home-title">
  <div class="hero-story">
   <p class="hero-badge"><span aria-hidden="true">${spark}</span>A playground for your what-ifs</p>
   <h1 id="home-title">Small moves.<br><span>Big aha!</span></h1>
   <p class="hero-description">A little physics. A lot to figure out. Solve a challenge in five moves—on your own, or with your Twitch community.</p>
   <div class="hero-actions"><a class="button primary hero-start" href="#/play">Let’s play ${arrow}</a><a class="hero-guide" href="#/guide">How does it work? <span aria-hidden="true">↗</span></a></div>
   <p class="hero-footnote"><span aria-hidden="true">✓</span>Jump in solo. No signup. No downloads.</p>
   <div class="hero-signoff"><span class="signoff-line" aria-hidden="true"></span><span>Good questions make<br>great little discoveries.</span></div>
  </div>
  <div class="hero-playground">
   <div class="playground-sticker"><span aria-hidden="true">${spark}</span>Your first aha<br>starts here.</div>
   <div class="live-toy">
    <div class="toy-header"><span class="toy-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 4h14M7 4v15m10-15v15M7 6l4 10m6-10-3 10"/><circle cx="11" cy="17" r="2"/><circle cx="14" cy="17" r="2"/></svg></span><div><strong>The rhythm challenge</strong><span>Go on, give it a nudge.</span></div><span class="toy-tag">Try it</span></div>
    <div class="toy-instrument"><div class="scene" id="home-scene"></div><span class="toy-orbit orbit-one" aria-hidden="true"></span><span class="toy-orbit orbit-two" aria-hidden="true"></span></div>
    <div class="toy-dashboard"><div class="toy-reading"><span>RHYTHM DIFFERENCE</span><strong id="home-gap">42.3<span>%</span></strong><small>Can you get it to zero?</small></div><div class="toy-controls"><span>String A <strong id="home-length">0.4 m</strong></span><div><button class="button" id="home-control" type="button">Lengthen A <span aria-hidden="true">+</span></button><button type="button" id="home-reset" class="icon-button" aria-label="Reset preview">↺</button></div></div></div>
    <p id="home-feedback" class="toy-feedback" role="status"></p>
   </div>
   <span class="playground-caption">Real equations. A very playful way to meet them.</span>
  </div>
 </section>
 <section class="puzzle-library" aria-labelledby="puzzles-title">
  <div class="library-heading"><div><p class="eyebrow">THREE LITTLE WHAT-IFS</p><h2 id="puzzles-title">Pick your next discovery.</h2></div><p>Five moves.<br>As many ideas as you like.</p></div>
  <div class="puzzle-grid">${Object.entries(MISSIONS).map(([id,s],index)=>{const d=details[id];return `<a class="puzzle-card puzzle-${d.color}" href="#/play/${id}"><div class="puzzle-art"><span class="puzzle-index">0${index+1}</span><span class="puzzle-topic">${({sync:'MOTION',brake:'FRICTION',balance:'DENSITY'})[id]}</span><div class="scene" id="card-scene-${id}"></div><span class="puzzle-corner" aria-hidden="true">${arrow}</span></div><div class="puzzle-copy"><p class="puzzle-kicker">${d.category}</p><h3>${s.short}</h3><p>${d.description}</p><div class="puzzle-bottom"><span>${d.hint}</span><span class="puzzle-play">Play ${arrow}</span></div></div></a>`;}).join('')}</div>
 </section>
 <section class="nudge-how" aria-labelledby="how-title"><div class="how-intro"><span class="how-spark" aria-hidden="true">${spark}</span><p class="eyebrow">NO BIG MANUAL. JUST BIG IDEAS.</p><h2 id="how-title">Try. Tweak.<br>“Ohhh, I get it.”</h2><a class="text-link" href="#/guide">Your quick-start guide ${arrow}</a></div><ol><li><span class="how-number">1</span><div><h3>Pick a puzzle</h3><p>Read the target. Meet your three controls. Every challenge starts with one simple question.</p></div></li><li><span class="how-number">2</span><div><h3>Make a little change</h3><p>Tap a control in solo play. Once Twitch hosting is connected, viewers can choose together in chat.</p></div></li><li><span class="how-number">3</span><div><h3>See the why</h3><p>Watch the model move. Follow the measurements. Keep what works and rethink what doesn’t.</p></div></li></ol></section>
 <section class="lab-invite"><div class="lab-doodle" aria-hidden="true"><svg viewBox="0 0 150 120"><path d="M48 16h34m-27 0v34L28 91q-5 10 8 10h62q12 0 6-10L76 50V16M43 74h46"/><circle cx="61" cy="67" r="5"/><circle cx="77" cy="87" r="3"/><path d="m111 23 9 9m0-9-9 9M21 31v12m-6-6h12"/></svg></div><div><p class="eyebrow">KEEP THE CURIOSITY GOING</p><h2>What if you made the rules?</h2><p>Choose your own variables in the free lab. Predict, experiment and change one thing.</p></div><div class="lab-links"><a class="button secondary" href="#/studio">Open the studio ${arrow}</a><a class="text-link" href="#/studio/pendulum/mass">Try a guided round →</a></div></section>
 <section class="community-invite"><div><p class="eyebrow">BETTER WITH A ROOM FULL OF IDEAS</p><h2>Your chat.<br>Your next experiment.</h2><p>Viewers stay in Twitch. One person, one vote. One shared “we did it.” Hosting becomes available when the app’s Twitch registration is complete.</p></div><div class="community-actions"><button class="button primary" type="button" id="home-connect">Explore Twitch play ${arrow}</button><span>Solo play is ready right now.</span></div></section>
 <section class="section faq"><div><p class="eyebrow">A FEW GOOD QUESTIONS</p><h2>Before your<br>first nudge.</h2></div><div><details><summary>Do I need an account?</summary><p>No account is needed for solo play or the free lab. Twitch hosting requires the application owner’s registration, then a host’s read-only channel authorization.</p></details><details><summary>How do viewers play?</summary><p>They stay in the host’s Twitch chat and type !nudge a, !nudge b or !nudge c. The host shows the labeled controls on stream. Existing !trial commands also work.</p></details><details><summary>Are these real experiments?</summary><p>These are idealized mathematical models, not physical sensor readings. The same equations drive both the motion and the measurements. Each challenge shows its assumptions.</p></details><details><summary>How do I show it on stream?</summary><p>Open Stage view and use OBS Window Capture for this running browser window. An independent OBS Browser Source does not synchronize with the host tab.</p></details></div></section>`;
 app.querySelector('#home-connect').addEventListener('click',connect);
 for(const [id,s] of Object.entries(MISSIONS)){const illustration=createScene(app.querySelector('#card-scene-'+id),s.kind,s.params);illustration.update(s.kind==='pendulum'?0:8);}
 const draw=()=>{
  scene=createScene(app.querySelector('#home-scene'),'pendulum',params);
  const r=result('pendulum',params),gap=Math.abs(r.a/r.b-1)*100;
  app.querySelector('#home-gap').innerHTML=gap.toFixed(1)+'<span>%</span>';
  app.querySelector('#home-length').textContent=params.lengthA.toFixed(1)+' m';
  app.querySelector('#home-feedback').textContent=gap<2?'In sync! You’ve got the idea. Try the full challenge.':'Different lengths. Different rhythms. What happens if you change one?';
  app.querySelector('#home-control').disabled=params.lengthA>=1.2;
  app.querySelector('.live-toy').classList.toggle('in-sync',gap<2);
  scene.update(0);start=performance.now();
 };
 app.querySelector('#home-control').addEventListener('click',()=>{params.lengthA=Math.min(1.2,Math.round((params.lengthA+0.2)*10)/10);draw();announce('String A is '+params.lengthA+' metres. '+app.querySelector('#home-feedback').textContent);});
 app.querySelector('#home-reset').addEventListener('click',()=>{params={...MISSIONS.sync.params};draw();announce('Preview reset.');});
 draw();const tick=()=>{if(!app.querySelector('#home-scene'))return;if(!document.hidden)scene.update(reduced.matches?0:(performance.now()-start)/1000);if(!reduced.matches)frame=requestAnimationFrame(tick);};
 tick();return()=>cancelAnimationFrame(frame);
}
