import { IPagarmeLog } from '@modules/payments/dtos/ICreatePaymentLogDTO';
import IPaymentsRepository from '@modules/payments/repositories/IPaymentsRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import { getMongoRepository, MongoRepository } from 'typeorm';
import Payment from '../schemas/Payment';

class PaymentsRepository implements IPaymentsRepository {
  private ormRepository: MongoRepository<Payment>;

  constructor() {
    this.ormRepository = getMongoRepository(Payment, 'mongo');
  }

  public async create(payment: IPagarmeLog, user: User): Promise<Payment> {
    const paymentTrialLog = this.ormRepository.create({
      user,
      ...payment,
    });

    await this.ormRepository.save(paymentTrialLog);

    return paymentTrialLog;
  }
}

export default PaymentsRepository;
