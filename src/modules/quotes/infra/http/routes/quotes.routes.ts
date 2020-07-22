import { Router } from 'express';

import QuotesController from '@modules/quotes/infra/http/controllers/QuotesController';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const quotesRouter = Router();
const quotesController = new QuotesController();

quotesRouter.post('/', ensureAuthenticated, quotesController.create);

export default quotesRouter;
