import IQueueProvider from '../models/IQueueProvider';

export default class FakeQueueProvider implements IQueueProvider {
  private queue: object[] = [];

  public async add(data: object | object[]): Promise<void> {
    if (this.queue.length === 0) {
      this.queue = [];
    }

    if (Array.isArray(data)) {
      const parsedJobs = data.map(jobData => {
        return { data: jobData };
      });

      await this.queue.push(parsedJobs);
    }

    await this.queue.push(data);
  }

  public process(process: object): void {
    const index = this.queue.findIndex(item => item === process);

    this.queue.splice(index);
  }
}
