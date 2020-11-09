import { Router } from 'express';

import OriginalExamsAssociatedController from '@modules/exams/infra/http/controllers/OriginalExamsAssociatedController';

const originalExamsRouter = Router();
const originalExamsAssociatedController = new OriginalExamsAssociatedController();

originalExamsRouter.get('/associated', originalExamsAssociatedController.index);

export default originalExamsRouter;
