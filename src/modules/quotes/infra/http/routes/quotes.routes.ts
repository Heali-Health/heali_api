import { Router } from 'express';

import QuotesController from '@modules/quotes/infra/http/controllers/QuotesController';

const quotesRouter = Router();
const quotesController = new QuotesController();

quotesRouter.post('/', quotesController.create);

export default quotesRouter;
