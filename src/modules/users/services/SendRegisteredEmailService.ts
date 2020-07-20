import path from 'path';
import { inject, injectable } from 'tsyringe';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IQueueProvider from '@shared/container/providers/QueueProvider/models/IQueueProvider';
// import User from '../infra/typeorm/entities/User';

@injectable()
export default class SendRegisteredEmailService {
  constructor(
    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('QueueProvider')
    private queueProvider: IQueueProvider,
  ) {}

  public async execute(): Promise<void> {
    try {
      // await this.mailProvider.sendMail({
      //   to: {
      //     name,
      //     email,
      //   },
      //   subject: 'Heali :: Cadastrado com sucesso',
      //   templateData: {
      //     file: forgotPasswordMailTemplate,
      //     variables: {
      //       name,
      //     },
      //   },
      // });

      const queueJob = {
        to: {
          name: 'teste',
          email: 'teste@example.com',
        },
        subject: 'Email teste',
        mailVariables: {
          name: 'teste',
        },
        templateFile: 'user_registered.hbs',
      };

      await this.queueProvider.add(queueJob);
    } catch (err) {
      console.log(err);
    }
  }
}
