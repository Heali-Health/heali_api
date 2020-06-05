import { Router } from 'express';

import ExamsController from '@modules/exams/infra/http/controllers/ExamsController';

const examsRouter = Router();
const examsController = new ExamsController();

examsRouter.post('/', examsController.create);

export default examsRouter;
