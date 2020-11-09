import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';
import { container } from 'tsyringe';

import CreateExamService from '@modules/exams/services/CreateExamService';
import UpdateExamService from '@modules/exams/services/UpdateExamService';
import PushExamToSearchProviderService from '@modules/exams/services/PushExamToSearchProviderService';
import ListExamsService from '@modules/exams/services/ListExamsService';

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

      const pushExamToSearchProvider = container.resolve(
        PushExamToSearchProviderService,
      );

      pushExamToSearchProvider.execute(exam);

      return res.json(classToClass(exam));
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const listExams = container.resolve(ListExamsService);

      const exams = await listExams.execute();

      return res.json(exams);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
