import { Router } from 'express';

import updateRouter from './updateFromApi.routes';
import searchRouter from './search.routes';
import usersRouter from './users.routes';
import sessionsRouter from './sessions.routes';

const routes = Router();

routes.use('/update', updateRouter);
routes.use('/users', usersRouter);
routes.use('/search', searchRouter);
routes.use('/sessions', sessionsRouter);

export default routes;
