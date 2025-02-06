import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models';
import { AuthRequest } from '../middleware/auth.middleware';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;

      const admin = await Admin.findOne({ where: { username } });
      if (!admin) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isPasswordValid = await bcrypt.compare(password, admin.get('password'));
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { 
          id: admin.get('id'),
          username: admin.get('username'),
          role: 'admin'
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({ token });
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;

      const existingAdmin = await Admin.findOne({ where: { username } });
      if (existingAdmin) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = await Admin.create({
        username,
        password: hashedPassword
      });

      const token = jwt.sign(
        { 
          id: admin.get('id'),
          username: admin.get('username'),
          role: 'admin'
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({ token });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const admin = await Admin.findByPk(req.user.id);
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }

      res.json({
        id: admin.get('id'),
        username: admin.get('username'),
        role: req.user.role
      });
    } catch (error) {
      next(error);
    }
  }
}
