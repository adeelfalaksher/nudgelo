import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(fileURLToPath(new URL('../public/',import.meta.url)));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.woff2':'font/woff2','.png':'image/png'};
http.createServer(async(req,res)=>{
 try{if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);res.end();return;}const url=new URL(req.url,'http://localhost'),name=decodeURIComponent(url.pathname);const file=path.resolve(root,'.'+(name==='/'?'/index.html':name));if(!file.startsWith(root+path.sep)){res.writeHead(404);res.end();return;}const data=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-store'});res.end(req.method==='HEAD'?undefined:data);}catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');}
}).listen(Number(process.env.PORT)||4173,'0.0.0.0',()=>console.log('Trialroom local server ready'));
