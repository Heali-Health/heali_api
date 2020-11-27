import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IMailMarketingProvider from '@shared/container/providers/MailMarketingProvider/models/IMailMarketingProvider';
import ICreateOrderDTO from '../dtos/ICreateOrderDTO';

@injectable()
export default class CreateOrderService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailMarketingProvider')
    private mailMarketingProvider: IMailMarketingProvider,
  ) {}

  public async execute({
    bagId,
    userId,
    payment,
  }: ICreateOrderDTO): Promise<void> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('Not valid credentials');
    }

    await this.mailMarketingProvider.addOrder({
      id: payment.id.toString(),
      currency_code: 'BRL',
      customer: {
        id: user.id,
        email_address: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        opt_in_status: true,
      },
      lines: payment.items.map(item => ({
        id: item.id,
        price: item.unit_price,
        product_id: item.id,
        product_title: item.title,
        product_variant_id: item.id,
        product_variant_title: item.title,
        quantity: item.quantity,
      })),
      order_total: payment.amount,
    });

    await this.mailMarketingProvider.deleteCart(bagId);
  }
}
