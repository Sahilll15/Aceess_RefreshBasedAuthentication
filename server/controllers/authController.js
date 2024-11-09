const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateAccessToken = (user) => jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
const generateRefreshToken = (user) => jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

exports.register = async (req, res) => {
  try {
    console.log('Registering new user:', req.body.username);
    const { username, password } = req.body;
    const newUser = new User({ username, password });
    await newUser.save();
    console.log('User registered successfully:', username);
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('Login attempt for user:', req.body.username);
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      console.warn('Failed login attempt for user:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken({ id: user._id });
    const refreshToken = generateRefreshToken({ id: user._id });

    console.log('User logged in successfully:', username);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });
    res.json({ accessToken });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.refreshToken = (req, res) => {
  console.log('Token refresh request received');
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    console.warn('No refresh token provided');
    return res.sendStatus(403);
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.sendStatus(403);
    }
    const accessToken = generateAccessToken({ id: user.id });
    console.log('Access token refreshed for user ID:', user.id);
    res.json({ accessToken });
  });
};

exports.logout = (req, res) => {
  console.log('User logout');
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
};
