import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';
import { container } from 'tsyringe';

import UpsertOriginalExamsFromApiService from '@modules/exams/services/UpsertOriginalExamsFromApiService';

export default class OriginalExamsFromApiController {
  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const upsertOriginalExamsFromApi = container.resolve(
        UpsertOriginalExamsFromApiService,
      );
      const originalExams = await upsertOriginalExamsFromApi.execute();

      return res.json(classToClass(originalExams));
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
