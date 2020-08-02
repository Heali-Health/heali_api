// import path from 'path';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
// import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IQueueProvider from '@shared/container/providers/QueueProvider/models/IQueueProvider';

interface IRequest {
  email: string;
}

@injectable()
export default class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    // @inject('MailProvider')
    // private mailProvider: IMailProvider,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('QueueProvider')
    private queueProvider: IQueueProvider,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User does not exists.');
    }

    const { token } = await this.userTokensRepository.generate(user.id);

    try {
      const queueJob = {
        to: {
          name: user.first_name,
          email: user.email,
        },
        subject: 'Heali :: Recuperação de senha',
        mailVariables: {
          name: user.first_name,
          link: `${process.env.APP_WEB_URL}/reset-password?token=${token}`,
        },
        templateFile: 'forgot_password.hbs',
      };

      await this.queueProvider.add(queueJob);
    } catch (err) {
      console.log(err);
    }
  }
}
