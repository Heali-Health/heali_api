import BullQueueProvider from './QueueProvider/implementations/BullQueueProvider';

const providers = {
  queue: {
    bull: BullQueueProvider,
  },
};

export default providers;
