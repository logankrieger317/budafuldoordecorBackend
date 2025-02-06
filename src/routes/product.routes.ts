import { Router } from 'express';
import {
  ProductController,
  RibbonProductController,
  MumProductController,
  BraidProductController,
  WreathProductController,
  SeasonalProductController,
} from '../controllers/product.controller';
import { authenticateAdmin } from '../middleware/auth.middleware';
import { validateProduct } from '../middleware/validation.middleware';

const router = Router();

// Initialize controllers
const productController = new ProductController();
const ribbonController = new RibbonProductController();
const mumController = new MumProductController();
const braidController = new BraidProductController();
const wreathController = new WreathProductController();
const seasonalController = new SeasonalProductController();

// General product routes
router.get('/all', productController.getAllProducts);
router.get('/search', productController.searchProducts);

// Ribbon product routes
router.get('/ribbons', ribbonController.getAll);
router.get('/ribbons/:id', ribbonController.getById);
router.post('/ribbons', authenticateAdmin, validateProduct('ribbon'), ribbonController.create);
router.put('/ribbons/:id', authenticateAdmin, validateProduct('ribbon'), ribbonController.update);
router.delete('/ribbons/:id', authenticateAdmin, ribbonController.delete);

// Mum product routes
router.get('/mums', mumController.getAll);
router.get('/mums/:id', mumController.getById);
router.post('/mums', authenticateAdmin, validateProduct('mum'), mumController.create);
router.put('/mums/:id', authenticateAdmin, validateProduct('mum'), mumController.update);
router.delete('/mums/:id', authenticateAdmin, mumController.delete);

// Braid product routes
router.get('/braids', braidController.getAll);
router.get('/braids/:id', braidController.getById);
router.post('/braids', authenticateAdmin, validateProduct('braid'), braidController.create);
router.put('/braids/:id', authenticateAdmin, validateProduct('braid'), braidController.update);
router.delete('/braids/:id', authenticateAdmin, braidController.delete);

// Wreath product routes
router.get('/wreaths', wreathController.getAll);
router.get('/wreaths/:id', wreathController.getById);
router.post('/wreaths', authenticateAdmin, validateProduct('wreath'), wreathController.create);
router.put('/wreaths/:id', authenticateAdmin, validateProduct('wreath'), wreathController.update);
router.delete('/wreaths/:id', authenticateAdmin, wreathController.delete);

// Seasonal product routes
router.get('/seasonal', seasonalController.getAll);
router.get('/seasonal/:id', seasonalController.getById);
router.post('/seasonal', authenticateAdmin, validateProduct('seasonal'), seasonalController.create);
router.put('/seasonal/:id', authenticateAdmin, validateProduct('seasonal'), seasonalController.update);
router.delete('/seasonal/:id', authenticateAdmin, seasonalController.delete);

export default router;
