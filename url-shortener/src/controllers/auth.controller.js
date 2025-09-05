import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function register(req, res) {
  try {
    console.log('=== REGISTRATION REQUEST ===');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('Method:', req.method);
    
    const { email, password } = req.body;
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Email and password required' });
    }
    
    console.log('Checking if user exists:', email);
    const exists = await User.findOne({ email });
    if (exists) {
      console.log('User already exists:', email);
      return res.status(409).json({ message: 'Email already registered' });
    }
    
    console.log('Hashing password...');
    const passwordHash = await bcrypt.hash(password, 12);
    
    console.log('Creating user...');
    const user = await User.create({ email, passwordHash });
    console.log('User created:', user._id);
    
    console.log('Generating JWT token...');
    const token = jwt.sign({ sub: user._id.toString(), email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log('Token generated successfully');
    
    console.log('Registration successful for:', email);
    res.status(201).json({ token });
  } catch (error) {
    console.error('=== REGISTRATION ERROR ===');
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
}

export async function login(req, res) {
  try {
    console.log('=== LOGIN REQUEST ===');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('Method:', req.method);
    
    const { email, password } = req.body;
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Email and password required' });
    }
    
    console.log('Finding user:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    console.log('Comparing password...');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      console.log('Password mismatch for:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    console.log('Generating JWT token...');
    const token = jwt.sign({ sub: user._id.toString(), email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log('Login successful for:', email);
    res.json({ token });
  } catch (error) {
    console.error('=== LOGIN ERROR ===');
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
}