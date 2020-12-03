import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IMailMarketingProvider from '@shared/container/providers/MailMarketingProvider/models/IMailMarketingProvider';
import ICreateOrderDTO from '../dtos/ICreateOrderDTO';

interface IError {
  type: string;
  title: string;
  status: number;
  detail: string;
}
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

    const mailMarketingProducts = await this.mailMarketingProvider.listProducts();
    const mailMarketingProductsIds = mailMarketingProducts.map(
      product => product.id,
    );

    try {
      payment.items.map(async item => {
        if (!mailMarketingProductsIds.includes(item.id)) {
          await this.mailMarketingProvider.addProduct({
            id: item.id,
            title: item.title,
            variants: [
              {
                id: item.id,
                title: item.title,
              },
            ],
          });
        }
      });

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
          quantity: 1,
        })),
        order_total: Number(payment.amount),
      });

      await this.mailMarketingProvider.deleteCart(bagId);
    } catch (err) {
      console.log(err);
    }
  }
}
