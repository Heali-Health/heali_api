import { Request, Response } from 'express';
import { container } from 'tsyringe';

import PushAllExamsToSearchService from '@modules/exams/services/PushAllExamsToSearchService';

export default class PushExamsToSearchProviderController {
  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const pushExamsToSearch = container.resolve(PushAllExamsToSearchService);
      const examsObjectIds = await pushExamsToSearch.execute();

      return res.json(examsObjectIds);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
