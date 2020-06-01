import { container } from 'tsyringe';

import LabInfoProvider from '@shared/container/providers/LabInfoProvider/implementations/LabInfoProvider';
import ILabInfoProvider from '@shared/container/providers/LabInfoProvider/models/ILabInfoProvider';

container.registerInstance<ILabInfoProvider>(
  'LabInfoProvider',
  container.resolve(LabInfoProvider),
);
