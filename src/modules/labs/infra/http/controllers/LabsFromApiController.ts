import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';
import { container } from 'tsyringe';

import UpsertLabsFromApiService from '@modules/labs/services/UpsertLabsFromApiService';

export default class LabsFromApiController {
  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const upsertLabsFromApi = container.resolve(UpsertLabsFromApiService);
      const labs = await upsertLabsFromApi.execute();

      return res.json(classToClass(labs));
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
