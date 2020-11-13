import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListPricesService from '@modules/exams/services/ListPricesService';
import AppError from '@shared/errors/AppError';

interface IRequestQuery {
  id?: string | string[];
}

export default class ExamsController {
  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.query as IRequestQuery;

      if (!id) {
        throw new AppError('You must provide at least one price id');
      }

      const listPrices = container.resolve(ListPricesService);

      const prices = await listPrices.execute(id);

      return res.json(prices);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
