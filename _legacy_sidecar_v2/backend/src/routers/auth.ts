import { Router, Request, Response } from 'express';
import { USERS } from '../data/seed';
import { User } from '../types/index';

const router = Router();

// GET /api/auth/users — list all demo users for login screen
router.get('/users', (_req: Request, res: Response) => {
  const users: User[] = Object.values(USERS);
  res.json(users);
});

// POST /api/auth/login — demo login, returns token + user
router.post('/login', (req: Request, res: Response) => {
  const { user_id } = req.body as { user_id: string };
  const user = USERS[user_id];
  if (!user) {
    res.status(401).json({ status: 'error', message: 'User not found' });
    return;
  }
  res.json({
    status:  'ok',
    token:   `demo-token-${user_id}-${Date.now()}`,
    user,
    message: 'Demo login successful — CAC/PIV replaces this in Phase 1',
  });
});

export default router;
