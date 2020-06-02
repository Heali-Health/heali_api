import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';
import { container } from 'tsyringe';

import InsertPricesFromApiService from '@modules/exams/services/InsertPricesFromApiService';

export default class PricesFromApiController {
  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const insertPricesFromApi = container.resolve(InsertPricesFromApiService);
      const prices = await insertPricesFromApi.execute();

      return res.json(classToClass(prices));
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
