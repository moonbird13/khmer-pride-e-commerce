import express from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import db from '../models/index.js';

const router = express.Router();

router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await db.Review.findAll({
      where: { productId: req.params.productId },
      include: [{ model: db.User, attributes: ['fullName'] }],
      order: [['createAt', 'DESC']],
    });
    res.json(reviews.map((review) => ({ id: review.reviewId, rating: review.rating, comments: review.comments, createdAt: review.createAt, customerName: review.User?.fullName || 'Customer' })));
  } catch (error) { res.status(500).json({ message: error.message || 'Unable to load reviews.' }); }
});

router.post('/product/:productId', authenticate, authorizeRoles('customer'), async (req, res) => {
  try {
    const rating = Number(req.body.rating);
    const comments = String(req.body.comments || '').trim();
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    if (!comments) return res.status(400).json({ message: 'A review comment is required.' });
    const userId = req.user?.id ?? req.user?.userId;
    const existing = await db.Review.findOne({ where: { productId: req.params.productId, userId } });
    const review = existing
      ? await existing.update({ rating, comments, createAt: new Date() })
      : await db.Review.create({ productId: req.params.productId, userId, rating, comments, createAt: new Date() });
    res.status(existing ? 200 : 201).json({ id: review.reviewId, rating: review.rating, comments: review.comments, createdAt: review.createAt });
  } catch (error) { res.status(500).json({ message: error.message || 'Unable to save review.' }); }
});

export default router;
