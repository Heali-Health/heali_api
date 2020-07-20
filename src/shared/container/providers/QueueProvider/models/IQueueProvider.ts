interface IJob {
  data: object;
}

export default interface IQueueProvider {
  add(data: object): Promise<void>;
  process(processFunction: (job: IJob) => Promise<void>): void;
}
