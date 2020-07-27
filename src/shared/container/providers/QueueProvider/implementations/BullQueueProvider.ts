import Bull, { Queue, QueueOptions, ProcessPromiseFunction } from 'bull';
import IQueueProvider from '../models/IQueueProvider';

export default class BullQueueProvider implements IQueueProvider {
  private queue: Queue;

  // private key: string;

  constructor(queueConfig: QueueOptions) {
    this.queue = new Bull('mail-queue', queueConfig);
  }

  public async add(data: object | object[]): Promise<void> {
    if (Array.isArray(data)) {
      const parsedJobs = data.map(jobData => {
        return { data: jobData };
      });

      await this.queue.addBulk(parsedJobs);
    }

    await this.queue.add(data);
  }

  public process(processFunction: ProcessPromiseFunction<object>): void {
    this.queue.process(150, processFunction);
  }
}
