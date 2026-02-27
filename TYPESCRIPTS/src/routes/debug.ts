import { Router } from 'express';
import * as Data from '../data/index';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      sailors: Data.SAILORS,
      billets: Data.BILLETS,
      orders: Data.ORDERS,
      users: Object.values(Data.USERS)
    }
  });
});

export default router;
