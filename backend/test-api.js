#!/usr/bin/env node
import http from 'http';

const BASE_URL = 'http://localhost:5000';

// Helper to make HTTP requests
function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data ? JSON.parse(data) : null,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
          });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting API Tests...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    let res = await makeRequest('GET', '/health');
    console.log(`   Status: ${res.status}`, res.body);

    // Test 2: Get Categories
    console.log('\n2. Testing GET /api/categories...');
    res = await makeRequest('GET', '/api/categories');
    console.log(`   Status: ${res.status}, Count: ${res.body?.length || 0}`);

    // Test 3: Get Products
    console.log('\n3. Testing GET /api/products...');
    res = await makeRequest('GET', '/api/products');
    console.log(`   Status: ${res.status}, Count: ${res.body?.length || 0}`);

    // Test 4: Filter by Category
    console.log('\n4. Testing GET /api/products?categoryId=1...');
    res = await makeRequest('GET', '/api/products?categoryId=1');
    console.log(`   Status: ${res.status}, Count: ${res.body?.length || 0}`);

    // Test 5: Search Products
    console.log('\n5. Testing GET /api/products?search=Silk...');
    res = await makeRequest('GET', '/api/products?search=Silk');
    console.log(`   Status: ${res.status}, Count: ${res.body?.length || 0}`);

    // Test 6: Register
    console.log('\n6. Testing POST /api/auth/register...');
    res = await makeRequest('POST', '/api/auth/register', {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'Test123!',
    });
    console.log(`   Status: ${res.status}`, res.body?.message || res.body);

    // Test 7: Login with demo user
    console.log('\n7. Testing POST /api/auth/login...');
    res = await makeRequest('POST', '/api/auth/login', {
      email: 'demo@khmerpride.com',
      password: 'demo123',
    });
    console.log(`   Status: ${res.status}`, res.body?.message || res.body);
    const accessToken = res.body?.accessToken;
    const refreshToken = res.body?.refreshToken;

    if (accessToken) {
      // Test 8: Add to Cart
      console.log('\n8. Testing POST /api/cart (add to cart)...');
      res = await makeRequest('POST', '/api/cart', {
        productId: 1,
        quantity: 2,
      }, { Authorization: `Bearer ${accessToken}` });
      console.log(`   Status: ${res.status}`, res.body?.message || res.body);

      // Test 9: Get Cart
      console.log('\n9. Testing GET /api/cart...');
      res = await makeRequest('GET', '/api/cart', null, { Authorization: `Bearer ${accessToken}` });
      console.log(`   Status: ${res.status}`, `Items in cart: ${res.body?.items?.length || 0}`);

      // Test 10: Create Order
      console.log('\n10. Testing POST /api/orders (create order)...');
      res = await makeRequest('POST', '/api/orders', {
        items: [{ productId: 1, quantity: 2 }],
        total: 84,
        shippingAddress: '123 Main St',
        shippingCity: 'Phnom Penh',
        paymentMethod: 'card',
      }, { Authorization: `Bearer ${accessToken}` });
      console.log(`   Status: ${res.status}`, res.body?.message || res.body);

      // Test 11: Get Orders
      console.log('\n11. Testing GET /api/orders...');
      res = await makeRequest('GET', '/api/orders', null, { Authorization: `Bearer ${accessToken}` });
      console.log(`   Status: ${res.status}`, `Orders: ${res.body?.length || 0}`);

      // Test 12: Refresh Token
      console.log('\n12. Testing POST /api/auth/refresh...');
      res = await makeRequest('POST', '/api/auth/refresh', {
        refreshToken: refreshToken,
      });
      console.log(`   Status: ${res.status}`, res.body?.message || res.body);
    }

    console.log('\n✅ API Tests Complete!');
  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

runTests();
