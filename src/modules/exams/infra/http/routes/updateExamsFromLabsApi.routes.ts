import { Router } from 'express';

import OriginalExamsFromApiController from '@modules/exams/infra/http/controllers/OriginalExamsFromApiController';

const updateExamsFromApiRouter = Router();
const originalExamsFromApiController = new OriginalExamsFromApiController();

updateExamsFromApiRouter.get('/', originalExamsFromApiController.update);

export default updateExamsFromApiRouter;
