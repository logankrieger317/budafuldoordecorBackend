import { Router } from 'express';
import { FavoritesController } from '../controllers/favorites.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Add a product to favorites
router.post('/', FavoritesController.addFavorite);

// Remove a product from favorites
router.delete('/:productSku', FavoritesController.removeFavorite);

// Get all favorite products
router.get('/', FavoritesController.getFavorites);

// Check if a product is in favorites
router.get('/:productSku', FavoritesController.checkFavorite);

export default router;
