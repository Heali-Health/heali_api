import { ObjectId } from 'mongodb';
import Payment from '../../infra/typeorm/schemas/Payment';
import User from '../../../users/infra/typeorm/entities/User';
import IPaymentsRepository from '../IPaymentsRepository';

export default class FakePaymentsRepository implements IPaymentsRepository {
  private payments: Payment[] = [];

  public async create(
    payment: object,
    user: User,
    bagId: string,
    quoteId: string,
  ): Promise<Payment> {
    const paymentTrialLog = new Payment();

    Object.assign(paymentTrialLog, {
      id: new ObjectId(),
      user,
      ...payment,
      bagId,
      quoteId,
    });

    this.payments.push(paymentTrialLog);

    return paymentTrialLog;
  }

  public async findOneById(id: string): Promise<Payment | undefined> {
    return this.payments.find(payment => id === payment.id.toString());
  }
}
