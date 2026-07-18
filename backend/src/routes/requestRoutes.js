import express from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import db from '../models/index.js';
import { updateProduct } from '../services/productService.js';

const router = express.Router();
const staffOnly = authorizeRoles('staff');
const adminOnly = authorizeRoles('admin');

const requesterId = (req) => req.user?.id ?? req.user?.userId;

router.post('/inventory', authenticate, staffOnly, async (req, res) => {
  try {
    const { productId, currentStock, requestedStock, reason } = req.body;
    if (!productId || requestedStock === undefined || !reason) return res.status(400).json({ message: 'Product, requested stock, and reason are required.' });
    const request = await db.InventoryRequest.create({ productId, staffId: requesterId(req), currentStock, requestedStock, reason });
    res.status(201).json(request);
  } catch (error) { res.status(400).json({ message: error.message }); }
});

router.post('/products', authenticate, staffOnly, async (req, res) => {
  try {
    const { requestType, reason, ...details } = req.body;
    if (!['Create', 'Delete'].includes(requestType) || !reason) return res.status(400).json({ message: 'A Create or Delete request and reason are required.' });
    const request = await db.ProductRequest.create({ ...details, requestType, reason, staffId: requesterId(req) });
    res.status(201).json(request);
  } catch (error) { res.status(400).json({ message: error.message }); }
});

router.get('/mine', authenticate, staffOnly, async (req, res) => {
  const staffId = requesterId(req);
  const [inventory, products] = await Promise.all([db.InventoryRequest.findAll({ where: { staffId } }), db.ProductRequest.findAll({ where: { staffId } })]);
  res.json({ inventory, products });
});

router.get('/', authenticate, adminOnly, async (_req, res) => {
  const [inventory, products] = await Promise.all([
    db.InventoryRequest.findAll({ include: [{ model: db.Product }, { model: db.User, as: 'staff' }] }),
    db.ProductRequest.findAll({ include: [{ model: db.Product }, { model: db.Category }, { model: db.User, as: 'staff' }] })
  ]);
  res.json({ inventory, products });
});

router.patch('/inventory/:id', authenticate, adminOnly, async (req, res) => {
  const request = await db.InventoryRequest.findByPk(req.params.id);
  if (!request || request.status !== 'Pending') return res.status(404).json({ message: 'Pending inventory request not found.' });
  const status = req.body.status;
  if (!['Approved', 'Rejected'].includes(status)) return res.status(400).json({ message: 'Invalid status.' });

  if (status === 'Approved') {
    await updateProduct(request.productId, { quantity: request.requestedStock });
  }

  await request.update({ status, reviewNote: req.body.reviewNote || null, reviewedBy: requesterId(req), reviewedAt: new Date() });
  res.json(request);
});

router.patch('/products/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const request = await db.ProductRequest.findByPk(req.params.id);
    if (!request || request.status !== 'Pending') return res.status(404).json({ message: 'Pending product request not found.' });

    const status = req.body.status;
    if (!['Approved', 'Rejected'].includes(status)) return res.status(400).json({ message: 'Invalid status.' });

    if (status === 'Approved') {
      if (request.requestType === 'Create') {
        const productData = {
          productName: request.productName,
          productDescription: request.productDescription,
          productPrice: request.productPrice,
          categoryId: request.categoryId,
          quantity: request.initialStock,
          imageUrl: request.imageUrl,
          slug: request.slug || null,
          isFeatured: request.isFeatured || false,
          isBestSeller: request.isBestSeller || false,
          isNewArrival: request.isNewArrival || false,
          createAt: new Date(),
        };

        await db.Product.create({
          productName: productData.productName,
          productDescription: productData.productDescription,
          productPrice: productData.productPrice,
          categoryId: productData.categoryId,
          slug: productData.slug,
          isFeatured: productData.isFeatured,
          isBestSeller: productData.isBestSeller,
          isNewArrival: productData.isNewArrival,
          createAt: productData.createAt,
        });

        const createdProduct = await db.Product.findOne({ where: { productName: request.productName }, order: [['productId', 'DESC']] });
        if (createdProduct && productData.quantity !== undefined) {
          await db.Inventory.create({ productId: createdProduct.productId, stockQuantity: Number(productData.quantity) || 0, lastUpdated: new Date() });
        }
        if (createdProduct && productData.imageUrl) {
          await db.Product_Image.create({ productId: createdProduct.productId, imageUrl: productData.imageUrl, publicId: null, isPrimary: true });
        }
      }

      if (request.requestType === 'Delete') {
        if (!request.productId) return res.status(400).json({ message: 'Product ID is required for delete requests.' });
        await db.Product.destroy({ where: { productId: request.productId } });
      }
    }

    await request.update({ status, reviewNote: req.body.reviewNote || null, reviewedBy: requesterId(req), reviewedAt: new Date() });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
