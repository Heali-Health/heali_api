import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import PaymentPostback from '../infra/typeorm/schemas/PaymentPostback';
import IPostbacksPaymentsRepository from '../repositories/IPostbacksPaymentsRepository';
import ICreatePaymentPostbackDTO from '../dtos/ICreatePaymentPostbackDTO';
import IPaymentsRepository from '../repositories/IPaymentsRepository';
import IUserCardsRepository from '../repositories/IUserCardsRepository';
import { ICard } from '../dtos/ICreateUserCardDTO';

interface IRequest {
  postbackPayment: ICreatePaymentPostbackDTO;
  userId: string;
  card: ICard | null;
}

interface IResponse {
  postbackPaymentLog: PaymentPostback;
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
    card,
  }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('No user found with this userId');
    }

    // const lastPayment = await this.paymentsRepository.findOneById(
    //   postbackPayment.id,
    // );

    // if (!lastPayment) {
    //   throw new AppError('No transaction was found with the informed id');
    // }

    // const { card } = lastPayment;

    const postbackPaymentLog = await this.postbacksPaymentsRepository.create(
      postbackPayment,
      user,
    );

    const userCards = await this.userCardsRepository.findAllByUserId(userId);

    let cardExists: boolean;

    if (card) {
      cardExists = !!userCards.find(
        userCard => card.id === userCard.foreign_id,
      );
    } else {
      cardExists = !!userCards.find(
        userCard => userCard.payment_method === 'boleto',
      );
    }

    return {
      postbackPaymentLog,
      cardExists,
    };
  }
}
