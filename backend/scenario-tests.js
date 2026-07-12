#!/usr/bin/env node
import http from 'http';

const BASE = process.env.BASE_URL || 'http://localhost:5000';
function req(method, path, body=null, headers={}){
  return new Promise((resolve,reject)=>{
    const url = new URL(path, BASE);
    const opts = {hostname:url.hostname, port:url.port, path:url.pathname+url.search, method, headers:{'Content-Type':'application/json', ...headers}};
    const r = http.request(opts, res=>{
      let d=''; res.on('data',c=>d+=c); res.on('end',()=>{
        let b=d; try{b = d? JSON.parse(d): null}catch(e){}
        resolve({status:res.statusCode, headers:res.headers, body:b});
      });
    });
    r.on('error',reject);
    if(body) r.write(JSON.stringify(body)); r.end();
  });
}

(async ()=>{
  console.log('Scenario tests start');
  // Scenario 1: register with 'name' field (expected to fail due to API expecting fullName)
  let res = await req('POST','/api/auth/register', {name:'Dara Sok', email:'dara@gmail.com', password:'123456', role:'customer'});
  console.log('\nScenario 1a: register with name field ->', res.status, JSON.stringify(res.body));
  // Register with correct field fullName
  res = await req('POST','/api/auth/register', {fullName:'Dara Sok', email:'dara@gmail.com', password:'123456', role:'customer'});
  console.log('\nScenario 1b: register with fullName ->', res.status, JSON.stringify(res.body));

  // Validation test: invalid data
  res = await req('POST','/api/auth/register', {fullName:'', email:'wrongemail', password:'123'});
  console.log('\nScenario 1c: invalid register ->', res.status, JSON.stringify(res.body));

  // Scenario 2: login
  res = await req('POST','/api/auth/login', {email:'dara@gmail.com', password:'123456'});
  console.log('\nScenario 2: login ->', res.status, JSON.stringify(res.body));
  const customerToken = res.body?.accessToken || res.body?.token;

  // Scenario 3: profile route - check if exists
  res = await req('GET','/api/users/profile', null, {'Authorization': customerToken?`Bearer ${customerToken}`:''});
  console.log('\nScenario 3: GET /api/users/profile ->', res.status, JSON.stringify(res.body));

  // Scenario 4: unauthorized product create
  res = await req('POST','/api/products', {name:'Khmer Scarf', price:20}, {'Authorization': customerToken?`Bearer ${customerToken}`:''});
  console.log('\nScenario 4a: create product as customer ->', res.status, JSON.stringify(res.body));

  // Login as admin seeded user
  res = await req('POST','/api/auth/login', {email:'admin@khmerpride.com', password:'admin123'});
  const adminToken = res.body?.accessToken || res.body?.token;
  console.log('\nAdmin login ->', res.status, JSON.stringify(res.body));
  // Try create as admin
  res = await req('POST','/api/products', {name:'Khmer Scarf', price:20}, {'Authorization': adminToken?`Bearer ${adminToken}`:''});
  console.log('\nScenario 4b: create product as admin ->', res.status, JSON.stringify(res.body));

  // Scenario 5: get products
  res = await req('GET','/api/products');
  console.log('\nScenario 5: GET /api/products ->', res.status, JSON.stringify(res.body));

  // Scenario 6: create order as customer
  res = await req('POST','/api/orders', {items:[{productId:1, quantity:2}]}, {'Authorization': customerToken?`Bearer ${customerToken}`:''});
  console.log('\nScenario 6: create order ->', res.status, JSON.stringify(res.body));
  const orderId = res.body?.id || res.body?.orderId;

  // Scenario 7: view customer orders
  res = await req('GET','/api/orders', null, {'Authorization': customerToken?`Bearer ${customerToken}`:''});
  console.log('\nScenario 7: GET /api/orders ->', res.status, JSON.stringify(res.body));

  // Scenario 8: staff update order status - staff not seeded; create staff user
  res = await req('POST','/api/auth/register', {fullName:'Staff User', email:'staff@khmerpride.com', password:'staff123', role:'staff'});
  console.log('\nSeed staff register ->', res.status, JSON.stringify(res.body));
  res = await req('POST','/api/auth/login', {email:'staff@khmerpride.com', password:'staff123'});
  const staffToken = res.body?.accessToken || res.body?.token;
  console.log('\nStaff login ->', res.status, JSON.stringify(res.body));
  // Update order status
  res = await req('PUT', `/api/orders/${orderId}/status`, {status:'approved'}, {'Authorization': staffToken?`Bearer ${staffToken}`:''});
  console.log('\nScenario 8: staff update order status ->', res.status, JSON.stringify(res.body));

  // Scenario 10: wrong password
  res = await req('POST','/api/auth/login', {email:'dara@gmail.com', password:'wrong'});
  console.log('\nScenario 10a: wrong password ->', res.status, JSON.stringify(res.body));

  // Invalid route
  res = await req('GET','/api/test123');
  console.log('\nScenario 10b: invalid route ->', res.status, JSON.stringify(res.body));

  console.log('\nScenario tests complete');
})();
