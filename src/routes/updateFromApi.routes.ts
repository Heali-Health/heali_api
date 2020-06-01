import { Router } from 'express';

import GetLabsService from '../services/labs_data/Labi/GetLabsService';
import GetExamsService from '../services/labs_data/Labi/GetExamsService';
import DefineOfficialExamsRegistries from '../services/DefineOfficialExamsRegistries';
import GetPricesServices from '../services/labs_data/Labi/GetPricesService';

const updateRouter = Router();

updateRouter.get('/labs', async (request, response) => {
  const getLabs = new GetLabsService();

  const labs = await getLabs.execute();

  response.json(labs);
});

updateRouter.get('/exams', async (request, response) => {
  const getExams = new DefineOfficialExamsRegistries();

  const exams = await getExams.execute();

  response.json(exams);
});

updateRouter.get('/original-exams/labi', async (request, response) => {
  const getOriginalExams = new GetExamsService();

  const originalExams = await getOriginalExams.execute();

  response.json(originalExams);
});

updateRouter.get('/prices/labi', async (request, response) => {
  const getPrices = new GetPricesServices();

  const prices = await getPrices.run();

  response.json(prices);
});

export default updateRouter;
