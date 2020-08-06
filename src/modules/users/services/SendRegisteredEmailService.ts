import { inject, injectable } from 'tsyringe';

import mailConfig from '@config/mail';
import IQueueProvider from '@shared/container/providers/QueueProvider/models/IQueueProvider';
import User from '../infra/typeorm/entities/User';

@injectable()
export default class SendRegisteredEmailService {
  constructor(
    @inject('QueueProvider')
    private queueProvider: IQueueProvider,
  ) {}

  public async execute({ email, first_name, last_name }: User): Promise<void> {
    const { email: emailDefault, name } = mailConfig.defaults.from;

    try {
      const queueJob = {
        to: {
          name: `${first_name} ${last_name}`,
          email,
        },
        bcc: {
          name,
          email: emailDefault,
        },
        subject: `Heali :: Parabéns, ${first_name}, seu cadastro foi concluído`,
        mailVariables: {
          name: first_name,
        },
        templateFile: 'user_registered.hbs',
      };

      await this.queueProvider.add(queueJob);
    } catch (err) {
      console.log(err);
    }
  }
}
