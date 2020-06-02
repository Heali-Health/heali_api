import { Router } from 'express';

import searchRouter from '@modules/exams/infra/http/routes/search.routes';
import patientsRouter from '@modules/users/infra/http/routes/patients.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';
import updateLabsFromApiRouter from '@modules/labs/infra/http/routes/updateLabsFromLabsApi.routes';
import updateExamsFromApiRouter from '@modules/exams/infra/http/routes/updateExamsFromLabsApi.routes';
import updatePricesFromApiRouter from '@modules/exams/infra/http/routes/updatePricesFromLabsApi.routes';

const routes = Router();

routes.use('/search', searchRouter);
routes.use('/patients', patientsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);
routes.use('/update/labs', updateLabsFromApiRouter);
routes.use('/update/originalexams', updateExamsFromApiRouter);
routes.use('/update/prices', updatePricesFromApiRouter);

export default routes;
