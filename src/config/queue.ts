import { QueueOptions } from 'bull';

interface IQueueConfig {
  driver: 'bull';

  queue: QueueOptions;
}

export default {
  driver: 'bull',

  queue: {
    defaultJobOptions: {
      removeOnComplete: true,
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
    },
    limiter: {
      max: 150,
      duration: 1000,
    },
  },
} as IQueueConfig;
