import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ListPriceSearchResultsService from '@modules/exams/services/ListLabsSearchResultsService';

export default class PriceResultsController {
  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const { ids, add, lat, lng } = req.query;

      const isArray = (arr: any): arr is Array<string> => {
        return !!arr.length;
      };

      if (ids) {
        if (!isArray(ids)) {
          throw new AppError('Exam array informed incorrectly');
        }
      } else {
        throw new AppError('No exam was informed');
      }

      const parsedExamsIds = ids.map(exam_id => exam_id.toString());
      const parsedAddress = add.toString();
      const parsedLatitude = Number(lat.toString());
      const parsedLongitude = Number(lng.toString());

      const searchExam = container.resolve(ListPriceSearchResultsService);
      const exams = await searchExam.execute({
        exams_ids: parsedExamsIds,
        location: {
          address: parsedAddress,
          latitude: parsedLatitude,
          longitude: parsedLongitude,
        },
      });

      return res.json(exams);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
