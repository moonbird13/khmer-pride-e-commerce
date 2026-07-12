import http from 'http';
const BASE='http://localhost:5001';
function req(method,path,body){return new Promise((res,rej)=>{const u=new URL(path,BASE);const opts={hostname:u.hostname,port:u.port,path:u.pathname+u.search,method,headers:{'Content-Type':'application/json'}};const r=http.request(opts,resp=>{let d='';resp.on('data',c=>d+=c);resp.on('end',()=>res({status:resp.statusCode,body:d}));});r.on('error',rej);if(body) r.write(JSON.stringify(body));r.end();});}
(async ()=>{try{const r=await req('POST','/api/auth/register',{fullName:'Dara Sok',email:'dara@gmail.com',password:'123456'});console.log('status',r.status);console.log(r.body);}catch(e){console.error(e);} })();
