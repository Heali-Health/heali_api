import { Router } from 'express';

import ExamsController from '@modules/exams/infra/http/controllers/ExamsController';
import ExamsAssociationController from '../controllers/ExamsAssociationController';

const examsRouter = Router();
const examsController = new ExamsController();
const examsAssociationController = new ExamsAssociationController();

examsRouter.post('/', examsController.create);
examsRouter.post('/association', examsAssociationController.create);

export default examsRouter;
