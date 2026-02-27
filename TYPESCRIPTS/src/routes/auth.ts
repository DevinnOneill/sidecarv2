import { Router, Request, Response } from 'express';
import { USERS } from '../data/index';
import type { LoginRequest, LoginResponse } from '../types/index';

const router = Router();

router.post('/login', (req: Request<{}, {}, LoginRequest>, res: Response) => {
  const { userId } = req.body;
  const user = USERS[userId];
  if (!user) {
    res.status(401).json({ success: false, message: 'User not found' });
    return;
  }
  const response: LoginResponse = {
    token: `sidecar-demo-${userId}-${Date.now()}`,
    user,
  };
  res.json({ success: true, data: response });
});

router.get('/users', (_req: Request, res: Response) => {
  const users = Object.values(USERS).map(u => ({
    id: u.id,
    name: u.name,
    role: u.role,
    rateCommunity: u.rateCommunity,
    email: u.email,
  }));
  res.json({ success: true, data: { users } });
});

export default router;
