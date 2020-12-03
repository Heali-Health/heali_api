import { IPagarmeLog } from '@modules/payments/dtos/ICreatePaymentLogDTO';
import IPaymentsRepository from '@modules/payments/repositories/IPaymentsRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import { getMongoRepository, MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import Payment from '../schemas/Payment';

class PaymentsRepository implements IPaymentsRepository {
  private ormRepository: MongoRepository<Payment>;

  constructor() {
    this.ormRepository = getMongoRepository(Payment, 'mongo');
  }

  public async create(
    payment: IPagarmeLog,
    user: User,
    bagId: string,
    quoteId: string,
  ): Promise<Payment> {
    const paymentTrialLog = this.ormRepository.create({
      user,
      ...payment,
      bagId,
      quoteId,
    });

    await this.ormRepository.save(paymentTrialLog);

    return paymentTrialLog;
  }

  public async findOneById(id: string): Promise<Payment | undefined> {
    const idObject = new ObjectId(id);

    return this.ormRepository.findOne({ where: { id: idObject } });
  }
}

export default PaymentsRepository;
