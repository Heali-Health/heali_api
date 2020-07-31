import { Router } from 'express';

import ExamSearchController from '@modules/exams/infra/http/controllers/ExamSearchController';
import PriceResultsController from '@modules/exams/infra/http/controllers/PriceResultsController';
import LabPricesController from '@modules/exams/infra/http/controllers/LabPricesController';
import OriginalExamsSearchController from '../controllers/OriginalExamsSearchController';

const searchRouter = Router();

const examSearchController = new ExamSearchController();
const priceResultsController = new PriceResultsController();
const labPricesController = new LabPricesController();
const originalExamSearchController = new OriginalExamsSearchController();

searchRouter.get('/exam', examSearchController.index);
searchRouter.get('/results', priceResultsController.index);
searchRouter.get('/:lab/results', labPricesController.index);
searchRouter.get('/original-exam/', originalExamSearchController.index);

export default searchRouter;
