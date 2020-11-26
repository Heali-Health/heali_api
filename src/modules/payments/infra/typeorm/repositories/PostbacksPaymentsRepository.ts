import { IPagarmeLog } from '@modules/payments/dtos/ICreatePaymentLogDTO';
import ICreatePaymentPostbackDTO from '@modules/payments/dtos/ICreatePaymentPostbackDTO';
import IPostbacksPaymentsRepository from '@modules/payments/repositories/IPostbacksPaymentsRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import { getMongoRepository, MongoRepository } from 'typeorm';
import PaymentPostback from '../schemas/PaymentPostback';

class PostbacksPaymentsRepository implements IPostbacksPaymentsRepository {
  private ormRepository: MongoRepository<PaymentPostback>;

  constructor() {
    this.ormRepository = getMongoRepository(PaymentPostback, 'mongo');
  }

  public async create(
    postbackPayment: ICreatePaymentPostbackDTO,
    user: User,
  ): Promise<PaymentPostback> {
    const postbackPaymentLog = this.ormRepository.create({
      user,
      ...postbackPayment,
    });

    await this.ormRepository.save(postbackPaymentLog);

    return postbackPaymentLog;
  }
}

export default PostbacksPaymentsRepository;
