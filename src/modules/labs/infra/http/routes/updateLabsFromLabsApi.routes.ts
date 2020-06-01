import { Router } from 'express';

import LabsFromApiController from '@modules/labs/infra/http/controllers/LabsFromApiController';

const updateLabsFromApiRouter = Router();
const labsFromApiController = new LabsFromApiController();

updateLabsFromApiRouter.get('/', labsFromApiController.update);

export default updateLabsFromApiRouter;
