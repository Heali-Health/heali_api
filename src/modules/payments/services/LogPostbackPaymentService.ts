import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import PaymentPostback from '../infra/typeorm/schemas/PaymentPostback';
import IPostbacksPaymentsRepository from '../repositories/IPostbacksPaymentsRepository';
import ICreatePaymentPostbackDTO from '../dtos/ICreatePaymentPostbackDTO';
import IPaymentsRepository from '../repositories/IPaymentsRepository';
import IUserCardsRepository from '../repositories/IUserCardsRepository';

interface IRequest {
  postbackPayment: ICreatePaymentPostbackDTO;
  userId: string;
}

interface IResponse {
  postbackPaymentLog: PaymentPostback;
  bagId: string;
  quoteId: string;
  cardExists: boolean;
}

@injectable()
export default class LogPostbackPaymentService {
  constructor(
    @inject('PostbacksPaymentsRepository')
    private postbacksPaymentsRepository: IPostbacksPaymentsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('PaymentsRepository')
    private paymentsRepository: IPaymentsRepository,

    @inject('UserCardsRepository')
    private userCardsRepository: IUserCardsRepository,
  ) {}

  public async execute({
    postbackPayment,
    userId,
  }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('No user found with this userId');
    }

    const lastPayment = await this.paymentsRepository.findOneById(
      postbackPayment.id,
    );

    if (!lastPayment) {
      throw new AppError('No transaction was found with the informed id');
    }

    const { bagId, quoteId, card } = lastPayment;

    const postbackPaymentLog = await this.postbacksPaymentsRepository.create(
      postbackPayment,
      user,
    );

    const cardId = card.id;

    const cardExists = !!this.userCardsRepository.findUserCardByForeignId(
      cardId.toString(),
    );

    return {
      postbackPaymentLog,
      bagId,
      quoteId,
      cardExists,
    };
  }
}
