import express from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

const products = [
  {
    id: 1,
    name: 'Khmer Silk Scarf',
    price: 24,
    description: 'Handwoven silk scarf inspired by Cambodian heritage.',
    category: 'Textiles',
  },
  {
    id: 2,
    name: 'Bamboo Toothbrush Set',
    price: 12,
    description: 'Eco-friendly bamboo toothbrushes crafted in Cambodia.',
    category: 'Lifestyle',
  },
  {
    id: 3,
    name: 'Palm Sugar Syrup',
    price: 18,
    description: 'Naturally sourced palm sugar syrup from local farms.',
    category: 'Food',
  },
];

router.get('/', authenticate, (req, res) => {
  res.json(products);
});

router.post('/', authenticate, authorizeRoles('admin', 'staff'), (req, res) => {
  const product = { id: Date.now(), ...req.body };
  products.push(product);
  res.status(201).json(product);
});

export default router;
