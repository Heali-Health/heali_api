import { container } from 'tsyringe';

import LocationProvider from '@shared/container/providers/LocationProvider/implementations/LocationProvider';
import ILocationProvider from '@shared/container/providers/LocationProvider/models/ILocationProvider';

container.registerInstance<ILocationProvider>(
  'LocationProvider',
  container.resolve(LocationProvider),
);
