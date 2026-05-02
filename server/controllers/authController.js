const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// ── Helper ────────────────────────────────────────────────────
const generateToken = (user) =>
  jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

// ── POST /api/auth/signup ─────────────────────────────────────
const signup = async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  try {
    // Check duplicate email
    const [existing] = await db.execute(
      'SELECT id FROM USERS WHERE email = ?',
      [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email is already registered.' });
    }

    // Hash password (salt rounds = 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user with role='user' (admins are seeded separately)
    const [result] = await db.execute(
      'INSERT INTO USERS (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'user']
    );

    const newUser = { id: result.insertId, name, email, role: 'user' };
    const token = generateToken(newUser);

    return res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: newUser,
    });
  } catch (err) {
    console.error('[signup]', err);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// ── POST /api/auth/login ──────────────────────────────────────
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Fetch user by email
    const [rows] = await db.execute(
      'SELECT id, name, email, password, role FROM USERS WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const user = rows[0];

    // Compare password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('[login]', err);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// ── GET /api/auth/me (verify token & return user) ─────────────
const getMe = async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, name, email, role FROM USERS WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.json({ user: rows[0] });
  } catch (err) {
    console.error('[getMe]', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { signup, login, getMe };
