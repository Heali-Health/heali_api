import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPaymentsRepository from '@modules/payments/repositories/IPaymentsRepository';
import ICreatePaymentLogDTO from '../dtos/ICreatePaymentLogDTO';
import Payment from '../infra/typeorm/schemas/Payment';

@injectable()
export default class LogPaymentTrialService {
  constructor(
    @inject('PaymentsRepository')
    private paymentsRepository: IPaymentsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    payment,
    userId,
  }: ICreatePaymentLogDTO): Promise<Payment> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('No user found with this userId');
    }

    const paymentTrialLog = await this.paymentsRepository.create(payment, user);

    return paymentTrialLog;
  }
}
