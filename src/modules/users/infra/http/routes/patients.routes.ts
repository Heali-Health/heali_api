import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import UserPatientsController from '@modules/users/infra/http/controllers/UserPatientsController';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const usersRouter = Router();

const userPatientsController = new UserPatientsController();

usersRouter.get('/', ensureAuthenticated, userPatientsController.index);
usersRouter.get(
  '/:patient_id',
  ensureAuthenticated,
  userPatientsController.show,
);
usersRouter.post(
  '/',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      email: Joi.string().email(),
      document_id: Joi.string().required(),
      document_type: Joi.string().required(),
      height: Joi.number(),
      weight: Joi.number(),
      mobility_restrictions: Joi.string(),
    },
  }),
  userPatientsController.create,
);
usersRouter.put(
  '/:patient_id/update',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      email: Joi.string().email(),
      document_id: Joi.string().required(),
      document_type: Joi.string().required(),
      height: Joi.number(),
      weight: Joi.number(),
      mobility_restrictions: Joi.string(),
    },
  }),
  userPatientsController.update,
);

export default usersRouter;
