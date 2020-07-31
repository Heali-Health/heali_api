import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import SearchOriginalExamsService from '@modules/exams/services/SearchOriginalExamsService';

export default class OriginalExamsSearchController {
  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const { originalExam } = req.query;

      if (!originalExam) {
        throw new AppError('No data was requested');
      }

      const searchOriginalExams = container.resolve(SearchOriginalExamsService);
      const originalExams = await searchOriginalExams.execute(
        originalExam.toString(),
      );

      return res.json(classToClass(originalExams));
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
