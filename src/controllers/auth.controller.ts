import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { AuthRequest } from '../middleware/auth.middleware';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, passwordLength: password?.length });
    
    // Make email search case-insensitive
    const user = await User.findOne({ 
      where: { 
        email: { 
          [require('sequelize').Op.iLike]: email 
        } 
      } 
    });

    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('User found:', { id: user.id, email: user.email, hashedPasswordPrefix: user.password?.substring(0, 10) });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password validation result:', isPasswordValid);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    console.log('Registration attempt:', { email, passwordLength: password?.length });

    // Make email check case-insensitive
    const existingUser = await User.findOne({ 
      where: { 
        email: { 
          [require('sequelize').Op.iLike]: email 
        } 
      } 
    });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    console.log('Creating user with password:', password);
    const user = await User.create({
      email,
      password, // Let the model's beforeSave hook handle hashing
      firstName,
      lastName,
      phone,
      isAdmin: false // New users are not admins by default
    });
    console.log('User created with hashed password:', user.password?.substring(0, 10));

    const token = jwt.sign(
      { id: user.id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        phone: req.user.phone,
        isAdmin: req.user.isAdmin
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { firstName, lastName, phone } = req.body;
    
    await req.user.update({
      firstName,
      lastName,
      phone
    });

    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        phone: req.user.phone,
        isAdmin: req.user.isAdmin
      }
    });
  } catch (error) {
    next(error);
  }
};
