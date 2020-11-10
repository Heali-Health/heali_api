import { Router } from 'express';

import ExamsListController from '@modules/exams/infra/http/controllers/ExamsListController';
import ExamsController from '../controllers/ExamsController';

const examsRouter = Router();
const examsListController = new ExamsListController();
const examsController = new ExamsController();

examsRouter.get('/list', examsListController.index);
examsRouter.get('/', examsController.index);

export default examsRouter;
