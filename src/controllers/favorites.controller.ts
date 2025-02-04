import { Request, Response } from 'express';
import { User, Product } from '../models';

export class FavoritesController {
  static async addFavorite(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { productSku } = req.body;

      // Check if product exists
      const product = await Product.findByPk(productSku);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Add to favorites
      await (user as any).addFavoriteProduct(product);

      res.status(200).json({ message: 'Product added to favorites' });
    } catch (error) {
      console.error('Add favorite error:', error);
      res.status(500).json({ message: 'Error adding product to favorites' });
    }
  }

  static async removeFavorite(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { productSku } = req.params;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const product = await Product.findByPk(productSku);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Remove from favorites
      await (user as any).removeFavoriteProduct(product);

      res.status(200).json({ message: 'Product removed from favorites' });
    } catch (error) {
      console.error('Remove favorite error:', error);
      res.status(500).json({ message: 'Error removing product from favorites' });
    }
  }

  static async getFavorites(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      const user = await User.findByPk(userId, {
        include: [{
          model: Product,
          as: 'favoriteProducts',
          through: { attributes: [] } // Exclude junction table attributes
        }]
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({
        favorites: user.get('favoriteProducts')
      });
    } catch (error) {
      console.error('Get favorites error:', error);
      res.status(500).json({ message: 'Error fetching favorites' });
    }
  }

  static async checkFavorite(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { productSku } = req.params;

      const user = await User.findByPk(userId, {
        include: [{
          model: Product,
          as: 'favoriteProducts',
          where: { sku: productSku },
          required: false,
          through: { attributes: [] }
        }]
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const favorites = user.get('favoriteProducts') as any[];
      const isFavorite = favorites.length > 0;

      res.status(200).json({ isFavorite });
    } catch (error) {
      console.error('Check favorite error:', error);
      res.status(500).json({ message: 'Error checking favorite status' });
    }
  }
}
