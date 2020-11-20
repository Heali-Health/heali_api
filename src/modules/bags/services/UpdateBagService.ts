import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Price from '@modules/exams/infra/typeorm/entities/Price';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import { ObjectID } from 'typeorm';
import IPricesRepository from '@modules/exams/repositories/IPricesRepository';
import IMailMarketingProvider from '@shared/container/providers/MailMarketingProvider/models/IMailMarketingProvider';
import IBagsRepository from '../repositories/IBagsRepository';
import Bag from '../infra/typeorm/schemas/Bag';

interface IRequest {
  bagId: ObjectID;
  userId: string;
  priceId: string | string[];
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

    @inject('MailMarketingProvider')
    private mailMarketingProvider: IMailMarketingProvider,
  ) {}

  public async execute({ bagId, userId, priceId }: IRequest): Promise<Bag> {
    const user = await this.usersRepository.findById(userId);

    if (!user) throw new AppError('No user found with this credentials');

    const prices = await this.pricesRepository.findByIds(priceId);

    const bag = await this.bagsRepository.findById(bagId);

    if (!bag) throw new AppError('No bag was found with the informed id');

    bag.user = user;
    bag.prices = prices;

    await this.bagsRepository.save(bag);

    const cartIdString = bag.id.toString();

    await this.mailMarketingProvider.addCart({
      id: cartIdString,
      customer: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email_address: user.email,
        opt_in_status: true,
      },
      lines: prices.map(price => ({
        id: price.exam.id,
        title: price.exam.title,
        price: price.price,
        product_id: price.exam.id,
        product_variant_id: price.exam.id,
        quantity: 1,
      })),
      checkout_url: `https://heali.me/carrinho?id=${bag.id}`,
      currency_code: 'BRL',
      order_total: prices.map(price => price.price).reduce((a, b) => a + b, 0),
    });

    return bag;
  }
}
