import express, { Request, Response, Router } from 'express';
import user from './user.routes';
import categories from './categories.routes';
import products from './products.routes';

import log from '../utils/logger';

const router: Router = express.Router();

router.get('/healthCheck', (_: Request, res: Response) => {
  log.info('The Api is Working');
  res.sendStatus(200);
});

router.use('/api/users', user);
router.use('/api/categories', categories);
router.use('/api/products', products);

export default router;
