import { Router } from 'express';

import searchRouter from '@modules/exams/infra/http/routes/search.routes';
import patientsRouter from '@modules/users/infra/http/routes/patients.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';
import examsRouter from '@modules/exams/infra/http/routes/exams.routes';
import updateLabsFromLabsApiRouter from '@modules/labs/infra/http/routes/updateLabsFromLabsApi.routes';
import updateExamsFromLabsApiRouter from '@modules/exams/infra/http/routes/updateExamsFromLabsApi.routes';
import updatePricesFromLabsApiRouter from '@modules/exams/infra/http/routes/updatePricesFromLabsApi.routes';
import quotesRouter from '@modules/quotes/infra/http/routes/quotes.routes';

const routes = Router();

routes.use('/search', searchRouter);
routes.use('/patients', patientsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);
routes.use('/quotes', quotesRouter);
routes.use('/admin/exam', examsRouter);
routes.use('/admin/update/labs', updateLabsFromLabsApiRouter);
routes.use('/admin/update/originalexams', updateExamsFromLabsApiRouter);
routes.use('/admin/update/prices', updatePricesFromLabsApiRouter);

export default routes;
