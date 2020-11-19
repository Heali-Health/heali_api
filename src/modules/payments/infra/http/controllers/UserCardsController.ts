import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from 'shared/errors/AppError';

// import { ObjectID } from 'mongodb';
// import ListUserCardService from '@modules/payments/services/ListUserCardService';

export default class UserCardsController {
  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const { id: userId } = req.user;

      if (!userId) {
        throw new AppError('User must be logged in to perform this action');
      }

      // const listUserCard = container.resolve(ListUserCardService);

      // const userCards = await listUserCard.execute(UserCardId);

      return res.json({ success: true });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
