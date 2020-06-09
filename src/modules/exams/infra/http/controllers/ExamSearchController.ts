import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import SearchExamService from '@modules/exams/services/SearchExamService';

export default class ExamSearchController {
  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const { exam } = req.query;

      if (!exam) {
        throw new AppError('No data was requested');
      }

      const searchExam = container.resolve(SearchExamService);
      const exams = await searchExam.execute(exam.toString());

      return res.json(exams);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
