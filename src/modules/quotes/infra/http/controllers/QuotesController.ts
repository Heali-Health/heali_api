import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateQuoteService from '@modules/quotes/services/CreateQuoteService';

export default class QuotesController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const {
        user_id,
        patient_id,
        patient_first_name,
        patient_last_name,
        price,
      } = req.body;

      const createQuote = container.resolve(CreateQuoteService);
      const quote = await createQuote.execute({
        user_id,
        patient_id,
        patient_first_name,
        patient_last_name,
        price,
      });

      return res.json(quote);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
