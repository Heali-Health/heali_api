import { container } from 'tsyringe';
import providers from '../providers';

import ISearchProvider from './models/ISearchProvider';

container.registerInstance<ISearchProvider>(
  'SearchProvider',
  container.resolve(providers.search.algolia),
);
