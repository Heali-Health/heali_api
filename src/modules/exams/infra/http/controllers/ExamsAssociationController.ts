import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';
import { container } from 'tsyringe';

import AssociateExamToOriginalExamTitleService from '@modules/exams/services/AssociateExamToOriginalExamTitleService';

export default class ExamsAssociationController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { examTitle, originalExamTitle } = req.body;

      const associateExamToOriginalExamTitle = container.resolve(
        AssociateExamToOriginalExamTitleService,
      );
      const exam = await associateExamToOriginalExamTitle.execute({
        examTitle,
        originalExamTitle,
      });

      return res.json(classToClass(exam));
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
