import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import IMailMarketingProvider from '@shared/container/providers/MailMarketingProvider/models/IMailMarketingProvider';

interface IRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_whatsapp?: string;
}

@injectable()
export default class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('MailMarketingProvider')
    private mailMarketingProvider: IMailMarketingProvider,
  ) {}

  public async execute({
    first_name,
    last_name,
    email,
    password,
    phone_whatsapp,
  }: IRequest): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email address already used', 400);
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      phone_whatsapp,
      defined_password: true,
    });

    await this.mailMarketingProvider.addCustomer({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email_address: user.email,
      opt_in_status: true,
    });

    return user;
  }
}
