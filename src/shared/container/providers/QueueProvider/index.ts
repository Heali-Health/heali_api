import { container } from 'tsyringe';

import cacheConfig from '@config/cache';
import queueConfig from '@config/queue';
import IQueueProvider from './models/IQueueProvider';
import providers from '../providers';
// import BullQueueProvider from './implementations/BullQueueProvider';

const Queue = providers.queue[queueConfig.driver];

container.registerInstance<IQueueProvider>(
  'QueueProvider',
  new Queue({
    ...queueConfig.queue,
    redis: cacheConfig.config.redis,
  }),
);
