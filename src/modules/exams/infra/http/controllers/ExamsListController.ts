import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import GetExamsInfoService from '@modules/exams/services/GetExamsInfoService';

interface IQueryType {
  ids?: string | string[];
  slg?: string | string[];
}

export default class ExamsListController {
  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const { ids, slg } = req.query as IQueryType;

      if (!ids && !slg) {
        throw new AppError('No exam was informed');
      }

      const getExamsInfo = container.resolve(GetExamsInfoService);
      const exams = await getExamsInfo.execute({
        exam_ids: ids,
        slugs: slg,
      });

      return res.json(exams);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
