import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from 'shared/errors/AppError';
import ListUserCardsService from '@modules/payments/services/ListUserCardsService';

// import { ObjectID } from 'mongodb';
// import ListUserCardService from '@modules/payments/services/ListUserCardService';

export default class UserCardsController {
  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const { id: userId } = req.user;

      if (!userId) {
        throw new AppError('User must be logged in to perform this action');
      }

      const listUserCard = container.resolve(ListUserCardsService);

      const userCards = await listUserCard.execute(userId);

      return res.json(userCards);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
