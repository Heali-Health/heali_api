import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import LogPaymentTrialService from '@modules/payments/services/LogPaymentTrialService';
import UpdateQuoteService from '@modules/quotes/services/UpdateQuoteStatusService';
import CreateUserCardService from '@modules/payments/services/CreateUserCardService';
import UpdateMainUserCardsService from '@modules/payments/services/UpdateMainUserCardService';
import CreateOrderService from '@modules/payments/services/CreateOrderService';
import SendScheduleRequestEmailService from '@modules/quotes/services/SendScheduleRequestEmailService';

export default class UserPaymentsController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { id: userId } = req.user;
      const { payment, bagId, quoteId } = req.body;

      if (!userId) {
        throw new AppError('User must be logged in to perform this action');
      }

      const logPaymentTrial = container.resolve(LogPaymentTrialService);
      const updateQuote = container.resolve(UpdateQuoteService);
      const createUserCard = container.resolve(CreateUserCardService);
      const updateMainUserCard = container.resolve(UpdateMainUserCardsService);
      const createOrder = container.resolve(CreateOrderService);

      const {
        status,
        card,
        customer,
        billing,
        payment_method,
        boleto_barcode,
        boleto_expiration_date,
        boleto_url,
      } = payment;
      const cardId = card && card.id;

      const paymentTrialLog = await logPaymentTrial.execute({
        payment,
        userId,
        bagId,
        quoteId,
      });

      const { user, patient, price, dates, hours } = await updateQuote.execute({
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
          payment_method,
          boleto_barcode,
          boleto_expiration_date,
          boleto_url,
        });

        if (card) {
          await updateMainUserCard.execute(userId, cardId);
        }

        await createOrder.execute({
          bagId,
          userId,
          payment,
        });

        const sendScheduleRequestEmail = container.resolve(
          SendScheduleRequestEmailService,
        );
        await sendScheduleRequestEmail.execute({
          user,
          patient,
          prices: price,
          dates,
          hours,
        });
      }

      return res.json(paymentTrialLog);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
