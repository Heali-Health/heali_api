import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateQuoteService from '@modules/quotes/services/CreateQuoteService';
import ShowProfileService from '@modules/users/services/ShowProfileService';
import { classToClass } from 'class-transformer';

export default class QuotesController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { patient, price, dates, hours } = req.body;
      const user_id = req.user.id;

      const showProfile = container.resolve(ShowProfileService);
      const user = await showProfile.execute({ user_id });

      const createQuote = container.resolve(CreateQuoteService);
      const quote = await createQuote.execute({
        user,
        patient,
        price,
        dates,
        hours,
      });

      quote.user = classToClass(quote.user);

      return res.json(quote);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
