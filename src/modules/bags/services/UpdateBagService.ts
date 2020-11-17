import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Price from '@modules/exams/infra/typeorm/entities/Price';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import { ObjectID } from 'typeorm';
import IPricesRepository from '@modules/exams/repositories/IPricesRepository';
import IBagsRepository from '../repositories/IBagsRepository';
import Bag from '../infra/typeorm/schemas/Bag';

interface IRequest {
  bagId: ObjectID;
  userId?: string;
  priceId?: string | string[];
}

@injectable()
export default class UpdateBagService {
  constructor(
    @inject('BagsRepository')
    private bagsRepository: IBagsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('PricesRepository')
    private pricesRepository: IPricesRepository,
  ) {}

  public async execute({ bagId, userId, priceId }: IRequest): Promise<Bag> {
    let user: User | undefined;
    let prices: Price[] | undefined;

    if (userId) user = await this.usersRepository.findById(userId);

    if (priceId) prices = await this.pricesRepository.findByIds(priceId);

    const bag = await this.bagsRepository.findById(bagId);

    if (!bag) throw new AppError('No bag was found with the informed id');

    if (user) bag.user = user;
    if (prices) bag.prices = prices;

    await this.bagsRepository.save(bag);

    return bag;
  }
}
