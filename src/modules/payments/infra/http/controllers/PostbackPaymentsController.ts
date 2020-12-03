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

export default class PostbackPaymentsController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const postbackPayment = req.body as ICreatePaymentPostbackDTO;

      console.log('request received in controller');
      console.log(req);

      const apiKey = process.env.PAGARME_API_KEY;
      const verifyBody = stringify(req.body);
      const headerSignature = req.headers['x-hub-signature'];
      const signature =
        headerSignature && headerSignature.toString().replace('sha1=', '');

      const verify = pagarme.postback.verifySignature(
        apiKey,
        verifyBody,
        signature,
      );

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
      } = payment;
      const cardId = card.id;

      const { bagId, quoteId, cardExists } = await logPostbackPayment.execute({
        postbackPayment,
        userId,
      });

      await updateQuote.execute({
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

        await updateMainUserCard.execute(userId, cardId);

        await createOrder.execute({
          bagId,
          userId,
          payment,
        });
      }

      return res.json({ success: true });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
