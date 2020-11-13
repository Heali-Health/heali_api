import { Router } from 'express';

import PricesController from '../controllers/PricesController';

const pricesRoutes = Router();
const pricesController = new PricesController();

pricesRoutes.get('/', pricesController.index);

export default pricesRoutes;
