import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from 'shared/errors/AppError';

// import { ObjectID } from 'mongodb';
import CreateUserCardService from '@modules/payments/services/CreateUserCardService';
// import CreateUserPaymentService from '@modules/payments/services/CreateUserPaymentService';
// import ListUserPaymentsService from '@modules/payments/services/ListUserPaymentsService';

export default class UserPaymentsController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { id: userId } = req.user;
      const payment = req.body;

      const { card } = payment;

      if (!userId) {
        throw new AppError('User must be logged in to perform this action');
      }

      // const createUserPayment = container.resolve(CreateUserPaymentService);
      const createUserCard = container.resolve(CreateUserCardService);

      // const userPayment = await createUserPayment.execute({
      //   userId,
      //   payment,
      // });

      const userCard = createUserCard.execute({
        userId,
        card,
      });

      return res.json({ userCard });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  public async index(req: Request, res: Response): Promise<Response> {
    try {
      // const { id } = req.params;

      // const userId = new ObjectID(id);

      // const listUserPayments = container.resolve(ListUserPaymentsService);

      // const userPayments = await listUserPayments.execute(userId);

      return res.json({ success: true });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}