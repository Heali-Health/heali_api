import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { Router } from 'express';
import PostbackPaymentsController from '../controllers/PostbackPaymentsController';

import UserPaymentsController from '../controllers/UserPaymentsController';

const paymentsRouter = Router();
const userPaymentsController = new UserPaymentsController();
const postbackPaymentsController = new PostbackPaymentsController();

paymentsRouter.post('/', ensureAuthenticated, userPaymentsController.create);
paymentsRouter.post('/postback', postbackPaymentsController.create);
paymentsRouter.get('/', ensureAuthenticated, userPaymentsController.index);

export default paymentsRouter;
