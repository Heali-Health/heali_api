import path from 'path';
import { inject, injectable } from 'tsyringe';

// import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IQueueProvider from '@shared/container/providers/QueueProvider/models/IQueueProvider';
import User from '../infra/typeorm/entities/User';
// import User from '../infra/typeorm/entities/User';

@injectable()
export default class SendRegisteredEmailService {
  constructor(
    @inject('QueueProvider')
    private queueProvider: IQueueProvider,
  ) {}

  public async execute({ email, first_name, last_name }: User): Promise<void> {
    try {
      const queueJob = {
        to: {
          name: `${first_name} ${last_name}`,
          email,
        },
        subject: `Heali :: Parabéns, ${first_name}, seu cadastro foi concluiddo`,
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
