import {APP_CONFIG} from './config.js';
const validId=value=>typeof value==='string'&&/^[a-z0-9]{10,64}$/i.test(value);
export function resolveConnection(config,currentUrl,ownerClient='') {
  const current=new URL(currentUrl),configured=validId(config.twitchClientId),clientId=configured?config.twitchClientId:validId(ownerClient)?ownerClient:'';
  let redirect;try{redirect=configured?new URL(config.twitchRedirectUri):new URL(current.origin+current.pathname);}catch{return{ready:false,reason:'invalid',clientId:'',redirectUri:''};}
  if(redirect.username||redirect.password||redirect.hash||redirect.search)return{ready:false,reason:'invalid',clientId:'',redirectUri:''};
  if(redirect.protocol!=='https:'&&!(redirect.protocol==='http:'&&['localhost','127.0.0.1'].includes(redirect.hostname)))return{ready:false,reason:'invalid',clientId:'',redirectUri:''};
  if(!clientId)return{ready:false,reason:'unconfigured',clientId:'',redirectUri:redirect.href};
  if(current.origin+current.pathname!==redirect.origin+redirect.pathname)return{ready:false,reason:'origin',clientId:'',redirectUri:redirect.href};
  return{ready:true,reason:'',clientId,redirectUri:redirect.href};
}
export function connectionSettings(){let ownerClient='';try{ownerClient=localStorage.getItem('trialroom-client-id')||'';}catch{}return resolveConnection(APP_CONFIG,location.href,ownerClient);}
export function renderConnectionState(dialog,status){
  const config=connectionSettings(),connected=status.status==='connected',busy=['connecting','reconnecting'].includes(status.status);
  dialog.querySelector('#connection-title').textContent=connected?'Your chat is in.':config.ready?'Bring your community.':'Play now. Connect later.';
  dialog.querySelector('#connection-summary').textContent=connected?'Trialroom is reading commands from @'+status.login+'. It never posts to chat.':config.ready?'Connect your Twitch channel and let viewers choose the next move. You authorize read-only chat access on Twitch.':'Solo play is ready. Live chat is waiting for the app owner to finish the Twitch connection.';
  dialog.querySelector('#connection-status').textContent=status.status==='disconnected'?(config.ready?'Not connected. Continue on Twitch to authorize your channel.':'Live Twitch connection is not configured yet. No player account or developer key is needed for solo play.'):status.message;
  const authorize=dialog.querySelector('#connect-authorize');authorize.hidden=!config.ready||connected;authorize.disabled=busy;
  dialog.querySelector('#disconnect').hidden=!connected&&!busy;
  const canonical=dialog.querySelector('#connect-public');canonical.hidden=config.reason!=='origin';canonical.href=config.redirectUri+'#/play';
  dialog.querySelector('#connect-solo').hidden=connected;
}
export function renderOwnerSetup(app,{connect,announce}){
  app.innerHTML=`<article class="guide owner-setup"><p class="eyebrow">Application owner settings</p><h1>Set up Twitch once.</h1><p>This page is for the app owner or a self-hosted installation. Players use Connect Twitch; they do not register an application or enter an app ID.</p><p>Register a Public Website Integration application in <a href="https://dev.twitch.tv/console/apps" target="_blank" rel="noopener noreferrer">Twitch Developer Console ↗</a>. Twitch requires the owner's two-factor authentication. Add this browser's exact redirect URL:</p><code id="owner-redirect"></code><form id="owner-form"><label for="owner-client-id">Application Client ID</label><input id="owner-client-id" autocomplete="off" spellcheck="false" pattern="[a-zA-Z0-9]{10,64}" minlength="10" maxlength="64" required><p class="hint">The Client ID is public. Never enter a Client Secret, password or access token. This override is saved only in this browser.</p><button class="button primary" type="submit">Save this browser's connection</button></form><p id="owner-status" role="status"></p><h2>For every player</h2><p>Put the registered app's public Client ID and exact redirect URL in <code>public/config.js</code> and deploy. Then all hosts can authorize through one button. The app ID identifies Trialroom; access to a host's chat still needs their Twitch authorization.</p><a class="button secondary" href="#/home">Back to the playground</a></article>`;
  app.querySelector('#owner-redirect').textContent=location.origin+location.pathname;
  try{app.querySelector('#owner-client-id').value=localStorage.getItem('trialroom-client-id')||'';}catch{}
  app.querySelector('#owner-form').addEventListener('submit',event=>{event.preventDefault();const id=app.querySelector('#owner-client-id').value.trim();if(!validId(id))return;try{localStorage.setItem('trialroom-client-id',id);app.querySelector('#owner-status').textContent='Saved on this browser. Continue on Twitch to authorize your own channel.';announce('Owner configuration saved.');connect();}catch{app.querySelector('#owner-status').textContent='This browser could not save configuration. Check its storage settings.';}});
}
