const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const sequelize = require('./config/database');
const User = require('./models/User');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

global.dbAvailable = true;
global.memoryUsers = [];

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
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
