import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

// Verify token and return user info
router.get('/me', authMiddleware, (req: AuthRequest, res) => {
  res.json({
    uid: req.uid,
    email: req.userEmail,
  });
});

export default router;
