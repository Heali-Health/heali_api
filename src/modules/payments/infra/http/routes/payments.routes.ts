import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { Router } from 'express';

import UserPaymentsController from '../controllers/UserPaymentsController';

const paymentsRouter = Router();
const userPaymentsController = new UserPaymentsController();

paymentsRouter.post('/', ensureAuthenticated, userPaymentsController.create);
paymentsRouter.get('/', ensureAuthenticated, userPaymentsController.index);

export default paymentsRouter;
