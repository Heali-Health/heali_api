import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ListPriceSearchResultsService from '@modules/exams/services/ListLabsSearchResultsService';

export default class PriceResultsController {
  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const { exams_ids, address, latitude, longitude } = req.body;

      if (!exams_ids) {
        throw new AppError('No exam was informed');
      }

      const searchExam = container.resolve(ListPriceSearchResultsService);
      const exams = await searchExam.execute({
        exams_ids,
        location: {
          address,
          latitude,
          longitude,
        },
      });

      return res.json(exams);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
