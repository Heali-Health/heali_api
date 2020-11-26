import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { stringify } from 'querystring';
import pagarme from 'pagarme';

import AppError from '@shared/errors/AppError';
import ICreatePaymentPostbackDTO from '@modules/payments/dtos/ICreatePaymentPostbackDTO';
import LogPaymentTrialService from '@modules/payments/services/LogPaymentTrialService';
import LogPostbackPaymentService from '@modules/payments/services/LogPostbackPaymentService';

export default class PostbackPaymentsController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const postbackPayment = req.body as ICreatePaymentPostbackDTO;

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
        throw new AppError('Invalid postback request');
      }

      const { transaction: payment } = postbackPayment;
      const userId = payment.customer.external_id;

      const logPaymentTrial = container.resolve(LogPaymentTrialService);

      await logPaymentTrial.execute({
        payment,
        userId,
      });

      const logPostbackPayment = container.resolve(LogPostbackPaymentService);

      await logPostbackPayment.execute({
        postbackPayment,
        userId,
      });

      return res.json({ success: true });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
