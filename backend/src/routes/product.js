import express from 'express';
import { db } from '../services/db.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const products = await db.products.list();
    res.json({ products });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await db.products.get(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ product });
  } catch (error) {
    next(error);
  }
});

export default router;
