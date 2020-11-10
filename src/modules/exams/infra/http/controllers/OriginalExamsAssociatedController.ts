import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListAssociatedOriginalExamsService from '@modules/exams/services/ListAssociatedOriginalExamsService';

export default class OriginalExamsSearchController {
  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const listAssociatedOriginalExamsService = container.resolve(
        ListAssociatedOriginalExamsService,
      );

      const associatedOriginalExams = await listAssociatedOriginalExamsService.execute();

      return res.json(associatedOriginalExams);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
