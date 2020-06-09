import { Router } from 'express';

import ExamSearchController from '@modules/exams/infra/http/controllers/ExamSearchController';
import PriceResultsController from '@modules/exams/infra/http/controllers/PriceResultsController';

const searchRouter = Router();

const examSearchController = new ExamSearchController();
const priceResultsController = new PriceResultsController();

searchRouter.get('/exam', examSearchController.index);
searchRouter.get('/results', priceResultsController.index);

export default searchRouter;
