import path from 'path';

import { injectable, inject } from 'tsyringe';
import IQueueProvider from '@shared/container/providers/QueueProvider/models/IQueueProvider';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUserEmailJob from '../dtos/UserEmailJob';

@injectable()
export default class ProcessUserEmailQueueService {
  constructor(
    @inject('QueueProvider')
    private queueProvider: IQueueProvider,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public execute(): void {
    this.queueProvider.process(async job => {
      const {
        to,
        subject,
        mailVariables,
        templateFile,
      } = job.data as IUserEmailJob;

      const mailTemplate = path.resolve(__dirname, '..', 'views', templateFile);

      try {
        await this.mailProvider.sendMail({
          to: {
            name: to.name,
            email: to.email,
          },
          subject,
          templateData: {
            file: mailTemplate,
            variables: mailVariables,
          },
        });

        console.log('email sent');
      } catch (err) {
        console.log(err);
      }
    });
  }
}
