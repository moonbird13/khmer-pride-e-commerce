import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import sequelize from './config/database.js';
import User from './models/User.js';
import authRoutes from './routes/authRoutes.js';
import productCategoryRoutes from './routes/productCategoryRoutes.js';
import cartOrderRoutes from './routes/cartOrderRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

global.dbAvailable = true;
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
app.use('/api', productCategoryRoutes);
app.use('/api', cartOrderRoutes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    global.dbAvailable = true;
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => console.log(`Khmer Pride backend running on port ${PORT}`));
  } catch (error) {
    global.dbAvailable = false;
    console.warn('MySQL is unavailable. Falling back to an in-memory store for local development.');
    app.listen(PORT, () => console.log(`Khmer Pride backend running on port ${PORT} in demo mode`));
  }
};

startServer();
