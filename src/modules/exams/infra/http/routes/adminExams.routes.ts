import { Router } from 'express';

import ExamsController from '@modules/exams/infra/http/controllers/ExamsController';
import ExamsAssociationController from '../controllers/ExamsAssociationController';

const adminExamsRouter = Router();
const examsController = new ExamsController();
const examsAssociationController = new ExamsAssociationController();

adminExamsRouter.post('/', examsController.create);
adminExamsRouter.post('/association', examsAssociationController.create);

export default adminExamsRouter;
