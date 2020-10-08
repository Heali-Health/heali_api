import BullQueueProvider from './QueueProvider/implementations/BullQueueProvider';
import AlgoliaSearchProvider from './SearchProvider/implementations/AlgoliaSearchProvider';

const providers = {
  queue: {
    bull: BullQueueProvider,
  },
  search: {
    algolia: AlgoliaSearchProvider,
  },
};

export default providers;
