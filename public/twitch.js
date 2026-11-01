export const EVENTSUB_URL='wss://eventsub.wss.twitch.tv/ws';
export function reconnectUrl(value){try{const u=new URL(value);return u.protocol==='wss:'&&u.hostname==='eventsub.wss.twitch.tv'&&!u.port&&!u.username&&!u.password&&u.pathname==='/ws'&&!u.hash?u.href:null;}catch{return null;}}
export function chatEvent(frame,channel,user,now=Date.now()){
  const m=frame?.metadata,p=frame?.payload,e=p?.event;
  if(m?.message_type!=='notification'||m.subscription_type!=='channel.chat.message'||p?.subscription?.type!=='channel.chat.message'||p.subscription.condition?.broadcaster_user_id!==channel||p.subscription.condition?.user_id!==user||e?.broadcaster_user_id!==channel)return null;
  const time=Date.parse(m.message_timestamp);
  if(!Number.isFinite(time)||time>now+5000||now-time>30000||typeof m.message_id!=='string'||typeof e.chatter_user_id!=='string'||typeof e.message?.text!=='string')return null;
  return {delivery:m.message_id,time,user:e.chatter_user_id,text:e.message.text};
}
export function oauthRequest(clientId,redirectUri,storage=sessionStorage,random=crypto){
  if(!/^[a-z0-9]{10,64}$/i.test(clientId))throw new Error('Enter the public Client ID from your Twitch application.');
  const bytes=random.getRandomValues(new Uint8Array(24)),state=Array.from(bytes,x=>x.toString(16).padStart(2,'0')).join('');
  storage.setItem('trialroom-oauth',JSON.stringify({state,clientId,redirectUri,at:Date.now()}));
  const u=new URL('https://id.twitch.tv/oauth2/authorize');for(const [k,v] of Object.entries({client_id:clientId,redirect_uri:redirectUri,response_type:'token',scope:'user:read:chat',state}))u.searchParams.set(k,v);return u.href;
}
export function oauthReturn(hash,storage=sessionStorage,now=Date.now()){
  const q=new URLSearchParams(hash.replace(/^#/,''));
  if(!q.has('access_token')&&!q.has('error'))return null;
  let pending;try{pending=JSON.parse(storage.getItem('trialroom-oauth')||'null');}catch{}storage.removeItem('trialroom-oauth');
  if(!pending||!Number.isFinite(pending.at)||typeof pending.clientId!=='string'||!/^[a-z0-9]{10,64}$/i.test(pending.clientId)||q.get('state')!==pending.state||now-pending.at>600000||now<pending.at)throw new Error('Twitch sign in expired or could not be verified. Connect again.');
  if(q.has('error'))throw new Error('Twitch access was not granted. You can keep using local practice.');
  const token=q.get('access_token');if(!/^[a-z0-9._~+\/=-]{10,512}$/i.test(token))throw new Error('Twitch returned an invalid session. Connect again.');
  return {token,clientId:pending.clientId};
}
export class TwitchConnection {
  constructor({onStatus=()=>{},onChat=()=>{},fetcher=fetch,Socket=WebSocket,store=sessionStorage}={}){this.onStatus=onStatus;this.onChat=onChat;this.fetcher=fetcher.bind(globalThis);this.Socket=Socket;this.store=store;this.generation=0;this.status='disconnected';this.sockets=new Set();this.validationTimer=null;this.watchdog=null;this.current=null;this.auth=null;}
  emit(status,message){this.status=status;this.onStatus({status,message,login:this.login??''});}
  async validate(auth){
    const response=await this.fetcher('https://id.twitch.tv/oauth2/validate',{headers:{Authorization:'OAuth '+auth.token},signal:AbortSignal.timeout(12000)});
    if(!response.ok)throw new Error('Twitch session expired. Connect again.');
    const data=await response.json();
    if(data.client_id!==auth.clientId||!data.scopes?.includes('user:read:chat')||!/^\d+$/.test(data.user_id)||typeof data.login!=='string')throw new Error('Twitch session needs permission to read your chat. Connect again.');return data;
  }
  async connect(auth){
    this.disconnect(false);const generation=this.generation;this.emit('connecting','Verifying Twitch session…');
    try{const data=await this.validate(auth);if(generation!==this.generation)return;this.auth={token:auth.token,clientId:auth.clientId};this.user=data.user_id;this.login=data.login;
      try{this.store.setItem('trialroom-twitch',JSON.stringify(this.auth));}catch{}
      this.openSocket(EVENTSUB_URL,false,generation);
      this.validationTimer=setInterval(async()=>{try{await this.validate(this.auth);}catch{if(generation===this.generation)this.fail('Twitch session expired. Connect again.');}},3600000);
    }catch(error){if(generation===this.generation)this.fail(error.message==='Twitch session expired. Connect again.'||error.message.startsWith('Twitch session needs')?error.message:'Could not reach Twitch. Check your connection and try again.');}
  }
  openSocket(url,migrating,generation){
    const socket=new this.Socket(url);this.sockets.add(socket);let welcomed=false,timer=setTimeout(()=>{if(!welcomed&&generation===this.generation)this.fail('Twitch did not welcome the connection. Connect again.');},15000);
    socket.onmessage=async({data})=>{
      if(generation!==this.generation)return;let frame;try{if(typeof data!=='string'||data.length>100000)return;frame=JSON.parse(data);}catch{return;}
      const type=frame.metadata?.message_type;
      if(type==='session_welcome'){
        const session=frame.payload?.session;if(welcomed||typeof session?.id!=='string')return;welcomed=true;clearTimeout(timer);
        const previous=this.current;this.current=socket;
        this.armWatchdog(session.keepalive_timeout_seconds,generation);
        if(migrating){if(previous&&previous!==socket){previous.onclose=null;previous.close();this.sockets.delete(previous);}this.emit('connected','Reading Twitch chat · @'+this.login);return;}
        try{const response=await this.fetcher('https://api.twitch.tv/helix/eventsub/subscriptions',{method:'POST',headers:{Authorization:'Bearer '+this.auth.token,'Client-Id':this.auth.clientId,'Content-Type':'application/json'},body:JSON.stringify({type:'channel.chat.message',version:'1',condition:{broadcaster_user_id:this.user,user_id:this.user},transport:{method:'websocket',session_id:session.id}}),signal:AbortSignal.timeout(12000)});
          if(generation!==this.generation)return;if(response.status!==202)throw new Error();this.emit('connected','Reading Twitch chat · @'+this.login);
        }catch{if(generation===this.generation)this.fail('Could not subscribe to your Twitch chat. Check permissions and connect again.');}
      }else if(socket===this.current){
        this.armWatchdog(this.keepalive,generation);
        if(type==='session_keepalive')return;
        if(type==='session_reconnect'){
          const next=reconnectUrl(frame.payload?.session?.reconnect_url);if(!next){this.fail('Twitch returned an unsupported reconnect address. Connect again.');return;}
          if(this.status==='reconnecting')return;this.emit('reconnecting','Twitch is moving the connection. Predictions are paused.');this.openSocket(next,true,generation);
        }else if(type==='revocation'){this.fail('Twitch revoked chat access. Connect again.');}
        else{const event=chatEvent(frame,this.user,this.user);if(event&&this.status==='connected')this.onChat(event);}
      }
    };
    socket.onerror=()=>{};
    socket.onclose=()=>{clearTimeout(timer);this.sockets.delete(socket);if(generation===this.generation&&(socket===this.current||!welcomed))this.fail('Twitch disconnected. Predictions are closed; reconnect before the next round.');};
    socket._trialroomCleanup=()=>clearTimeout(timer);
  }
  armWatchdog(seconds,generation){this.keepalive=Number.isFinite(seconds)&&seconds>=10&&seconds<=600?seconds:30;clearTimeout(this.watchdog);this.watchdog=setTimeout(()=>{if(generation===this.generation)this.fail('Twitch stopped responding. Predictions are closed. Connect again.');},(this.keepalive+5)*1000);}
  fail(message){this.disconnect(false);this.emit('error',message);}
  disconnect(announce=true){this.generation++;clearInterval(this.validationTimer);clearTimeout(this.watchdog);for(const socket of this.sockets){socket._trialroomCleanup?.();socket.onclose=null;socket.onmessage=null;socket.close();}this.sockets.clear();this.current=null;this.auth=null;this.user=null;this.login=null;try{this.store.removeItem('trialroom-twitch');}catch{}if(announce)this.emit('disconnected','Twitch disconnected. Local practice is available.');}
}
