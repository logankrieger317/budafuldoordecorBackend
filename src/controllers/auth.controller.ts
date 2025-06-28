import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { AuthRequest } from '../middleware/auth.middleware';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    // Make email search case-insensitive
    const user = await User.findOne({ 
      where: { 
        email: { 
          [require('sequelize').Op.iLike]: email 
        } 
      } 
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
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

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      isAdmin: false // New users are not admins by default
    });

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
