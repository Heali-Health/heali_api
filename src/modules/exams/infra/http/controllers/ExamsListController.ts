import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ListExamsByExamIdsService from '@modules/exams/services/ListExamsByExamIdsService';

export default class ExamsListController {
  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const { exam_ids } = req.query;

      const isArray = (arr: any): arr is Array<string> => {
        return !!arr.length;
      };

      if (exam_ids) {
        if (!isArray(exam_ids)) {
          throw new AppError('Exam array informed incorrectly');
        }
      } else {
        throw new AppError('No exam was informed');
      }

      const listExamsByExamIds = container.resolve(ListExamsByExamIdsService);
      const exams = await listExamsByExamIds.execute(exam_ids);

      return res.json(exams);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
