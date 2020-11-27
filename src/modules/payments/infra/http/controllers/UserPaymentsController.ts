import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

// import { ObjectID } from 'mongodb';
import ManagePaymentStatusService from '@modules/payments/services/ManagePaymentStatusService';
import LogPaymentTrialService from '@modules/payments/services/LogPaymentTrialService';
import UpdateQuoteService from '@modules/quotes/services/UpdateQuoteStatusService';
import CreateUserCardService from '@modules/payments/services/CreateUserCardService';
import UpdateMainUserCardsService from '@modules/payments/services/UpdateMainUserCardService';
import CreateOrderService from '@modules/payments/services/CreateOrderService';
import LogPostbackPaymentService from '@modules/payments/services/LogPostbackPaymentService';
// import ListUserPaymentsService from '@modules/payments/services/ListUserPaymentsService';

export default class UserPaymentsController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { id: userId } = req.user;
      const { payment, bagId, quoteId } = req.body;

      if (!userId) {
        throw new AppError('User must be logged in to perform this action');
      }

      // const managePaymentStatus = container.resolve(ManagePaymentStatusService);

      // const paymentTrialLog = managePaymentStatus.execute({
      //   data: {
      //     type: 'payment',
      //     bagId,
      //     quoteId,
      //     userId,
      //     payment,
      //   },
      // });

      const logPaymentTrial = container.resolve(LogPaymentTrialService);
      const updateQuote = container.resolve(UpdateQuoteService);
      const createUserCard = container.resolve(CreateUserCardService);
      const updateMainUserCard = container.resolve(UpdateMainUserCardsService);
      const createOrder = container.resolve(CreateOrderService);

      const { status, card, customer, billing } = payment;
      const cardId = card.id;

      const paymentTrialLog = await logPaymentTrial.execute({
        payment,
        userId,
        bagId,
        quoteId,
      });

      await updateQuote.execute({
        newStatus: payment.status,
        quoteId,
        paymentTrialId: payment.id,
      });

      if (status === 'paid') {
        await createUserCard.execute({
          card,
          userId,
          paying_customer: customer,
          billing_address: billing,
        });

        await updateMainUserCard.execute(userId, cardId);

        await createOrder.execute({
          bagId,
          userId,
          payment,
        });
      }

      return res.json(paymentTrialLog);
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
