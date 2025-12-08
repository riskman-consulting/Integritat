import bcrypt from 'bcryptjs';
import { query } from '../db/connection.js';
import { generateTokens, verifyRefreshToken } from '../utils/tokenUtils.js';
import { asyncHandler } from '../utils/errorHandler.js';

export const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, role, department } = req.body;

  // Check if user exists
  const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (existingUser.rows.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Email already registered'
    });
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Insert user
  const result = await query(
    `INSERT INTO users (email, password_hash, first_name, last_name, role, department, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, true)
     RETURNING id, email, first_name, last_name, role`,
    [email, passwordHash, firstName, lastName, role || 'junior_auditor', department]
  );

  const user = result.rows[0];
  const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.role);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user,
      accessToken,
      refreshToken
    }
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  // Find user
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rows.length === 0) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  const user = result.rows[0];

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check if user is active
  if (!user.is_active) {
    return res.status(403).json({
      success: false,
      message: 'User account is disabled'
    });
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.role);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      },
      accessToken,
      refreshToken
    }
  });
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: 'Refresh token is required'
    });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const { accessToken: newAccessToken } = generateTokens(decoded.userId, decoded.email, 'user');

    res.json({
      success: true,
      accessToken: newAccessToken
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const result = await query('SELECT id, email, first_name, last_name, role, department FROM users WHERE id = $1', [req.user.userId]);
  
  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const user = result.rows[0];
  res.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      department: user.department
    }
  });
});
