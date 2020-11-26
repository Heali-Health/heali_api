import { ObjectId } from 'mongodb';
import PaymentPostback from '../../infra/typeorm/schemas/PaymentPostback';
import User from '../../../users/infra/typeorm/entities/User';
import IPostbacksPaymentsRepository from '../IPostbacksPaymentsRepository';

export default class FakePostbacksPaymentsRepository
  implements IPostbacksPaymentsRepository {
  private postbacksPayments: PaymentPostback[] = [];

  public async create(
    postbackPayment: object,
    user: User,
  ): Promise<PaymentPostback> {
    const postbackPaymentLog = new PaymentPostback();

    Object.assign(postbackPaymentLog, {
      id: new ObjectId(),
      user,
      ...postbackPayment,
    });

    this.postbacksPayments.push(postbackPaymentLog);

    return postbackPaymentLog;
  }
}
