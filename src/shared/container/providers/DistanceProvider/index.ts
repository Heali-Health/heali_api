import { container } from 'tsyringe';

import IDistanceProvider from '@shared/container/providers/DistanceProvider/models/IDistanceProvider';

import FormulaDistanceProvider from '@shared/container/providers/DistanceProvider/implementations/FormulaDistanceProvider';

const providers = {
  formula: FormulaDistanceProvider,
};

container.registerSingleton<IDistanceProvider>(
  'DistanceProvider',
  providers.formula,
);
