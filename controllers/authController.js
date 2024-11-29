import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// User Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ message: `Welcome ${user.role}`, token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// REGISTER USER ////////////////

export const registerUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

     // Validate email format
     const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
     if (!emailRegex.test(email)) {
       return res.status(400).json({ message: 'Invalid email format' });
     }
 
     // Validate password: Minimum 4 and maximum 10 characters
     if (password.length < 4 || password.length > 10) {
       return res.status(400).json({ message: 'Password must be between 4 and 10 characters long' });
     }
 
     // Validate role: must be one of 'admin', 'user', or 'driver'
     const validRoles = ['admin', 'user', 'driver'];
     if (!validRoles.includes(role)) {
       return res.status(400).json({ message: 'Invalid role. It must be one of admin, user, or driver' });
     }

    const newUser = new User({ email, password, role });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
