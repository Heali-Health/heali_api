import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';
import { container } from 'tsyringe';

import CreateExamService from '@modules/exams/services/CreateExamService';
import UpdateExamService from '@modules/exams/services/UpdateExamService';

export default class ExamsController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { title, synonyms, original_exams_ids } = req.body;

      const createExam = container.resolve(CreateExamService);
      const exam = await createExam.execute({
        title,
        synonyms,
        original_exams_ids,
      });

      return res.json(classToClass(exam));
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id, title, original_exams_ids, slug } = req.body;

      const updateExam = container.resolve(UpdateExamService);

      const exam = await updateExam.execute({
        id,
        title,
        original_exams_ids,
        slug,
      });

      return res.json(classToClass(exam));
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
