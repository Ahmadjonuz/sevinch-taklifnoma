import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { resolve, sep, extname } from 'node:path';
const root=resolve('out');
if(!existsSync(root)){console.error('Avval npm run build buyrug‘ini bajaring.');process.exit(1);}
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.woff':'font/woff','.svg':'image/svg+xml','.png':'image/png','.mp3':'audio/mpeg','.txt':'text/plain; charset=utf-8','.ico':'image/x-icon'};
createServer((req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
  let file;
  try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);file=resolve(root,'.'+pathname);}catch{res.writeHead(400);res.end();return;}
  if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403);res.end();return;}
  if(existsSync(file)&&statSync(file).isDirectory())file=resolve(file,'index.html');
  if(!existsSync(file)){res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});createReadStream(resolve(root,'404.html')).pipe(res);return;}
  const size=statSync(file).size;
  const headers={'Content-Type':mime[extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Accept-Ranges':'bytes'};
  const range=/^bytes=(\d+)-(\d*)$/.exec(req.headers.range||'');
  let start=0,end=size-1;
  if(range){start=Number(range[1]);end=range[2]?Math.min(Number(range[2]),size-1):size-1;if(start>=size||end<start){res.writeHead(416,{'Content-Range':`bytes */${size}`});res.end();return;}headers['Content-Range']=`bytes ${start}-${end}/${size}`;}
  res.writeHead(range?206:200,{...headers,'Content-Length':end-start+1});
  if(req.method==='HEAD'){res.end();return;}
  createReadStream(file,{start,end}).pipe(res);
}).listen(Number(process.env.PORT)||3000,()=>console.log(`http://localhost:${process.env.PORT||3000}`));
