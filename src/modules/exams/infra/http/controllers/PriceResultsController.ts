import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ListPriceSearchResultsService from '@modules/exams/services/ListLabsSearchResultsService';

interface IQueryType {
  ids?: string | string[];
  slg?: string | string[];
  add?: string;
  lat?: string;
  lng?: string;
}

export default class PriceResultsController {
  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const { ids, add, lat, lng, slg } = req.query as IQueryType;

      if (!ids && !slg) {
        throw new AppError('No exam info was provided');
      }

      if (!add) {
        throw new AppError('Address was not informed');
      }

      if (!lat || !lng) {
        throw new AppError('Coordinates were not informed');
      }

      const searchExam = container.resolve(ListPriceSearchResultsService);
      const exams = await searchExam.execute({
        examsIds: ids,
        examsSlugs: slg,
        location: {
          address: add,
          latitude: Number(lat.toString()),
          longitude: Number(lng.toString()),
        },
      });

      return res.json(exams);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
