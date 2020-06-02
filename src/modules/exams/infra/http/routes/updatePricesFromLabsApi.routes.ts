import { Router } from 'express';

import PricesFromApiController from '@modules/exams/infra/http/controllers/PricesFromApiController';

const updateExamsFromApiRouter = Router();
const pricesFromApiController = new PricesFromApiController();

updateExamsFromApiRouter.get('/', pricesFromApiController.update);

export default updateExamsFromApiRouter;
