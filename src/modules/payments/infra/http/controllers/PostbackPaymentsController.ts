import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { stringify } from 'querystring';
import pagarme from 'pagarme';

import AppError from '@shared/errors/AppError';
import ICreatePaymentPostbackDTO from '@modules/payments/dtos/ICreatePaymentPostbackDTO';
import LogPostbackPaymentService from '@modules/payments/services/LogPostbackPaymentService';
import UpdateQuoteService from '@modules/quotes/services/UpdateQuoteStatusService';
import CreateUserCardService from '@modules/payments/services/CreateUserCardService';
import UpdateMainUserCardsService from '@modules/payments/services/UpdateMainUserCardService';
import CreateOrderService from '@modules/payments/services/CreateOrderService';
import SendScheduleRequestEmailService from '@modules/quotes/services/SendScheduleRequestEmailService';

export default class PostbackPaymentsController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const postbackPayment = req.body as ICreatePaymentPostbackDTO;
      console.log('body', req.body);
      console.log('headers', req.headers);

      const verifyBody = stringify(req.body);
      const headerSignature = req.headers['x-hub-signature'];
      const signature =
        headerSignature && headerSignature.toString().replace('sha1=', '');

      const hash = await pagarme.postback.calculateSignature(
        signature,
        verifyBody,
      );

      const verify = await pagarme.postback.verifySignature(
        signature,
        verifyBody,
        hash,
      );

      console.log('verify', verify);

      if (!headerSignature || !signature || !verify) {
        console.log('invalid postback request');
        throw new AppError('Invalid postback request');
      }

      console.log('valid postback request');

      const { transaction: payment } = postbackPayment;
      const userId = payment.customer.external_id;

      const updateQuote = container.resolve(UpdateQuoteService);
      const createUserCard = container.resolve(CreateUserCardService);
      const updateMainUserCard = container.resolve(UpdateMainUserCardsService);
      const createOrder = container.resolve(CreateOrderService);
      const logPostbackPayment = container.resolve(LogPostbackPaymentService);

      const {
        status,
        card,
        customer,
        billing,
        payment_method,
        boleto_barcode,
        boleto_expiration_date,
        boleto_url,
        metadata: { bagId, quoteId },
      } = payment;

      const { cardExists } = await logPostbackPayment.execute({
        postbackPayment,
        card,
        userId,
      });

      const { user, patient, price, dates, hours } = await updateQuote.execute({
        newStatus: payment.status,
        quoteId,
        paymentTrialId: payment.id,
      });

      if (status === 'paid') {
        if (!cardExists) {
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
        }

        if (card) {
          const cardId = card && card.id;

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

      console.log('success: true');

      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
