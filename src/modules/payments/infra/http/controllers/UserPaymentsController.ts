import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

// import { ObjectID } from 'mongodb';
import CreateUserCardService from '@modules/payments/services/CreateUserCardService';
import UpdateMainUserCardService from '@modules/payments/services/UpdateMainUserCardService';
import LogPaymentTrialService from '@modules/payments/services/LogPaymentTrialService';
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

      const createUserCard = container.resolve(CreateUserCardService);

      const userCard = await createUserCard.execute({
        userId,
        card,
      });

      const logPaymentTrial = container.resolve(LogPaymentTrialService);

      const paymentTrialLog = await logPaymentTrial.execute({
        payment,
        userId,
      });

      const updateMainUserCard = container.resolve(UpdateMainUserCardService);

      await updateMainUserCard.execute(userId, userCard.foreign_id);

      return res.json({ paymentTrialLog });
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
