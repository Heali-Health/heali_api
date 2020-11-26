import { ObjectId } from 'mongodb';
import Payment from '../../infra/typeorm/schemas/Payment';
import User from '../../../users/infra/typeorm/entities/User';
import IPaymentsRepository from '../IPaymentsRepository';

export default class FakePaymentsRepository implements IPaymentsRepository {
  private payments: Payment[] = [];

  public async create(payment: object, user: User): Promise<Payment> {
    const paymentTrialLog = new Payment();

    Object.assign(paymentTrialLog, {
      id: new ObjectId(),
      user,
      ...payment,
    });

    this.payments.push(paymentTrialLog);

    return paymentTrialLog;
  }
}
