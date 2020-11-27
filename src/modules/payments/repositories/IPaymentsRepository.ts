import User from '@modules/users/infra/typeorm/entities/User';
import Payment from '../infra/typeorm/schemas/Payment';

export default interface IPaymentsRepository {
  create(
    payment: object,
    user: User,
    bagId: string,
    quoteId: string,
  ): Promise<Payment>;
  findOneById(id: string): Promise<Payment | undefined>;
}
