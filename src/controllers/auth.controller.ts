import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../models';
import { AppError } from '../utils/appError';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, firstName, lastName, phone } = req.body;

      // Check if user already exists
      const existingUser = await db.User.findOne({ where: { email } });
      if (existingUser) {
        throw new AppError('Email already registered', 400);
      }

      // Create new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await db.User.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        isAdmin: false // Default to false for new users
      });

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          isAdmin: user.isAdmin
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      // Don't send password in response
      const { password: _, ...userWithoutPassword } = user.toJSON();

      res.status(201).json({
        status: 'success',
        token,
        data: {
          user: userWithoutPassword
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await db.User.findOne({ where: { email } });
      if (!user) {
        throw new AppError('Invalid email or password', 401);
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401);
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          isAdmin: user.isAdmin
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      // Don't send password in response
      const { password: _, ...userWithoutPassword } = user.toJSON();

      res.json({
        status: 'success',
        token,
        data: {
          user: userWithoutPassword
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('Not authenticated', 401);
      }

      const user = await db.User.findByPk(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Don't send password in response
      const { password: _, ...userWithoutPassword } = user.toJSON();

      res.json({
        status: 'success',
        data: {
          user: userWithoutPassword
        }
      });
    } catch (error) {
      next(error);
    }
  }
};
