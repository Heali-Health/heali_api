import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import SessionsController from '@modules/users/infra/http/controllers/SessionsController';
import GoogleSessionsController from '@modules/users/infra/http/controllers/GoogleSessionsController';
import FacebookSessionsController from '@modules/users/infra/http/controllers/FacebookSessionsController';

const sessionsRouter = Router();
const sessionsController = new SessionsController();
const googleSessionsController = new GoogleSessionsController()
const facebookSessionsController = new FacebookSessionsController()

sessionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  sessionsController.create,
);
sessionsRouter.post(
  '/google',
  celebrate({
    [Segments.BODY]: {
      googleTokenId: Joi.string().required(),
    },
  }),
  googleSessionsController.create,
);
sessionsRouter.post(
  '/facebook',
  celebrate({
    [Segments.BODY]: {
      facebookTokenId: Joi.string().required(),
    },
  }),
  facebookSessionsController.create,
);

export default sessionsRouter;
