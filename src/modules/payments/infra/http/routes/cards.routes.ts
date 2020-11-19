import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { Router } from 'express';

import UserCardsController from '../controllers/UserCardsController';

const cardsRouter = Router();
const usercardsController = new UserCardsController();

cardsRouter.get('/', ensureAuthenticated, usercardsController.index);

export default cardsRouter;
