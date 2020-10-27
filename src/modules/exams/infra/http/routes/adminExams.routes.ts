import { Router } from 'express';

import ExamsController from '@modules/exams/infra/http/controllers/ExamsController';
import ExamsAssociationController from '../controllers/ExamsAssociationController';
import PushExamsToSearchProviderController from '../controllers/PushExamsToSearchProviderController';

const adminExamsRouter = Router();
const examsController = new ExamsController();
const examsAssociationController = new ExamsAssociationController();
const pushExamsToSearchProvider = new PushExamsToSearchProviderController();

adminExamsRouter.post('/', examsController.create);
adminExamsRouter.put('/', examsController.update);
adminExamsRouter.post('/association', examsAssociationController.create);
adminExamsRouter.get('/search-provider', pushExamsToSearchProvider.index);

export default adminExamsRouter;
