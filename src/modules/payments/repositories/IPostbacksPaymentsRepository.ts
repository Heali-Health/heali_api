import User from '@modules/users/infra/typeorm/entities/User';
import ICreatePaymentPostbackDTO from '../dtos/ICreatePaymentPostbackDTO';
import PaymentPostback from '../infra/typeorm/schemas/PaymentPostback';

export default interface IPostbacksPaymentsRepository {
  create(
    postbackPayment: ICreatePaymentPostbackDTO,
    user: User,
  ): Promise<PaymentPostback>;
}
