import { Router } from 'express';

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../controller';

const router = Router();

export const categoryRouter = (app: Router) => {
  app.use('/category', router);

  router.get('/', getCategories);
  router.post('/', createCategory);
  router.put('/', updateCategory);
  router.delete('/', deleteCategory);
};
