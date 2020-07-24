import { injectable, inject } from 'tsyringe';
import IQueueProvider from '@shared/container/providers/QueueProvider/models/IQueueProvider';

@injectable()
export default class ProcessUserEmailQueueService {
  constructor(
    @inject('QueueProvider')
    private queueProvider: IQueueProvider,
  ) {}

  public execute(): void {
    this.queueProvider.process(async job => {
      const {} = job.data as IUserEmailJob;

      try {
        await this.mailProvider.sendMail();

        console.log('email sent');
      } catch (err) {
        console.log(err);
      }
    });
  }
}
