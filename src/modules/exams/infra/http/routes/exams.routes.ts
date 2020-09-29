import { Router } from 'express';

import ExamsListController from '@modules/exams/infra/http/controllers/ExamsListController';

const examsRouter = Router();
const examsListController = new ExamsListController();

examsRouter.get('/list', examsListController.index);

export default examsRouter;
