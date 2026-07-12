import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import db from './models/index.js';
import { mockUsers } from './data/mockData.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Phase 5: Use mock data by default
// Set ENABLE_DATABASE=true in .env to use real database
global.dbAvailable = process.env.ENABLE_DATABASE === 'true' ? true : false;
global.memoryUsers = [];

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Khmer Pride API',
      version: '1.0.0',
      description: 'Authentication and marketplace API for Khmer Pride.',
    },
    servers: [{ url: 'http://localhost:5000' }],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

const seedInitialData = async () => {
  const categoryCount = await db.Category.count();
  if (categoryCount > 0) {
    return;
  }

  const [snacks, tea, gifts] = await Promise.all([
    db.Category.create({ categoryName: 'Snacks', categoryStatus: 'Active' }),
    db.Category.create({ categoryName: 'Tea & Coffee', categoryStatus: 'Active' }),
    db.Category.create({ categoryName: 'Gifts', categoryStatus: 'Active' }),
  ]);

  await db.Product.bulkCreate([
    {
      productName: 'Honey Rice Crackers',
      productDescription: 'Crispy rice crackers with Cambodian honey glaze.',
      productPrice: 8.5,
      categoryId: snacks.categoryId,
      slug: 'honey-rice-crackers',
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: true,
      salesCount: 24,
      createAt: new Date(),
    },
    {
      productName: 'Bamboo Tea Blend',
      productDescription: 'A fragrant blend of local herbs and tea leaves.',
      productPrice: 12,
      categoryId: tea.categoryId,
      slug: 'bamboo-tea-blend',
      isFeatured: true,
      isBestSeller: false,
      isNewArrival: true,
      salesCount: 14,
      createAt: new Date(),
    },
    {
      productName: 'Khmer Gift Box',
      productDescription: 'A curated gift box featuring local treats and crafts.',
      productPrice: 25,
      categoryId: gifts.categoryId,
      slug: 'khmer-gift-box',
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      salesCount: 32,
      createAt: new Date(),
    },
  ]);
};

const seedMockUsers = async () => {
  global.memoryUsers = global.memoryUsers || [];
  if (global.memoryUsers.length > 0) {
    return;
  }

  global.memoryUsers = await Promise.all(mockUsers.map(async (user) => ({
    ...user,
    password: await bcrypt.hash(
      user.email === 'admin@khmerpride.com' ? 'admin123' : 'demo123',
      10,
    ),
  })));
};

// const startServer = async () => {
//   try {
//     await db.sequelize.authenticate();
//     global.dbAvailable = true;
//     await db.sequelize.sync();
//     await seedInitialData();
//     app.listen(PORT, () => console.log(`Khmer Pride backend running on port ${PORT}`));
//   } catch (error) {
//     global.dbAvailable = false;

//     console.error('Database connection failed:');
//     console.error(error);

//     console.warn('MySQL is unavailable. Falling back to an in-memory store for local development.');

//     await seedMockUsers();

//     app.listen(PORT, () =>
//       console.log(`Khmer Pride backend running on http://localhost:${PORT} in demo mode`)
//     );
//   }
// };

const startServer = async () => {

  // ===== MOCK MODE =====
  if (process.env.ENABLE_DATABASE !== 'true') {
    console.log("Running in MOCK MODE (database disabled)");

    global.dbAvailable = false;

    await seedMockUsers();

    app.listen(PORT, () => {
      console.log(`Khmer Pride backend running on http://localhost:${PORT}`);
    });

    return;
  }

  // ===== DATABASE MODE =====
  try {

    await db.sequelize.authenticate();

    global.dbAvailable = true;

    await db.sequelize.sync();

    await seedInitialData();

    app.listen(PORT, () => {
      console.log(`Khmer Pride backend running on http://localhost:${PORT}`);
    });

  } catch (error) {

    console.error(error);

    process.exit(1);

  }

};


startServer();


