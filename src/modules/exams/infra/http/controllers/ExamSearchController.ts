import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SearchExamService from '@modules/exams/services/SearchExamService';

export default class ExamSearchController {
  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const { examQuery } = req.body;

      const searchExam = container.resolve(SearchExamService);
      const exams = await searchExam.execute(examQuery);

      return res.json(exams);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
