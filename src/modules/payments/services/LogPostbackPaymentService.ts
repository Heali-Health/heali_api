import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import PaymentPostback from '../infra/typeorm/schemas/PaymentPostback';
import IPostbacksPaymentsRepository from '../repositories/IPostbacksPaymentsRepository';
import ICreatePaymentPostbackDTO from '../dtos/ICreatePaymentPostbackDTO';

interface IRequest {
  postbackPayment: ICreatePaymentPostbackDTO;
  userId: string;
}

@injectable()
export default class LogPostbackPaymentService {
  constructor(
    @inject('PostbacksPaymentsRepository')
    private postbacksPaymentsRepository: IPostbacksPaymentsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    postbackPayment,
    userId,
  }: IRequest): Promise<PaymentPostback> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('No user found with this userId');
    }

    const postbackPaymentLog = await this.postbacksPaymentsRepository.create(
      postbackPayment,
      user,
    );

    return postbackPaymentLog;
  }
}
