import { Router, Request, Response, NextFunction } from 'express';
import { processCart } from '../controllers/cartController';

const router = Router();

router.post('/cart', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await processCart(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;