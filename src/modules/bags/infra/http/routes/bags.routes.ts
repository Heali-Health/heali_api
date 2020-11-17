import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { Router } from 'express';

import BagsController from '../controllers/BagsController';

const bagsRouter = Router();
const bagsController = new BagsController();

bagsRouter.post('/', bagsController.create);
bagsRouter.get('/:id', bagsController.show);
bagsRouter.put('/:id', ensureAuthenticated, bagsController.update);

export default bagsRouter;
