import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';
import { signToken } from '../middleware/auth.js';

const router: Router = Router();

router.post('/register', async (req, res) => {
  try {
    const {
      email,
      phone,
      password,
      role = 'broker',
      first_name_ar,
      last_name_ar,
      rega_license_number,
    } = req.body;

    if (!email || !phone || !password || !first_name_ar || !last_name_ar) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['email', 'phone', 'password', 'first_name_ar', 'last_name_ar'],
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await query<{ id: string; email: string }>(
      `INSERT INTO users (email, phone, password_hash, role, first_name_ar, last_name_ar, rega_license_number)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email`,
      [email, phone, passwordHash, role, first_name_ar, last_name_ar, rega_license_number || null]
    );

    const user = result.rows[0];
    const token = signToken({
      userId: user.id,
      email: user.email,
      role,
    });

    res.status(201).json({
      user: { id: user.id, email: user.email, role },
      token,
      expiresIn: '7d',
    });
  } catch (err: unknown) {
    const e = err as { code?: string };
    if (e.code === '23505') {
      return res.status(409).json({ error: 'Email or phone already registered' });
    }
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const result = await query<{
      id: string;
      email: string;
      password_hash: string;
      role: string;
      first_name_ar: string;
      last_name_ar: string;
      is_active: boolean;
    }>(
      'SELECT id, email, password_hash, role, first_name_ar, last_name_ar, is_active FROM users WHERE email = $1',
      [email]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'Account disabled' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        first_name_ar: user.first_name_ar,
        last_name_ar: user.last_name_ar,
      },
      token,
      expiresIn: '7d',
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
