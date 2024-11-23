import express from 'express';
import { createNewProductHandler, getAllProductsHandler } from '../controller/products.controller';
import { protect } from '../middleware/protectResource';
import { restrictTo } from '../middleware/restrictTo';
import validateResource from '../middleware/validateResource';
import { updateCategorySchema } from '../schema/categories.schema';
import { createProductSchema, deleteProductSchema } from '../schema/products.schema';

const router = express.Router();
router
  .route('/')
  .get(getAllProductsHandler)
  .post(validateResource(createProductSchema), protect, restrictTo('ADMIN', 'EMPLOYEE'), createNewProductHandler)
  .patch(validateResource(updateCategorySchema), protect, restrictTo('ADMIN', 'EMPLOYEE'))
  .delete(validateResource(deleteProductSchema), protect, restrictTo('ADMIN', 'EMPLOYEE'));

export default router;
