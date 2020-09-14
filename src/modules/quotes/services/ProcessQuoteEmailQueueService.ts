import path from 'path';

import { injectable, inject } from 'tsyringe';
import IQueueProvider from '@shared/container/providers/QueueProvider/models/IQueueProvider';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUserEmailJob from '../dtos/IQuoteEmailJob';

@injectable()
export default class ProcessQuoteEmailQueueService {
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
        cc,
        bcc,
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
          cc: cc && {
            name: cc.name,
            email: cc.email,
          },
          bcc: bcc && {
            name: bcc.name,
            email: bcc.email,
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
