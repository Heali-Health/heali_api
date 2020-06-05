import { container } from 'tsyringe';

import ISlugTransformationProvider from '@shared/container/providers/SlugTransformationProvider/models/ISlugTransformationProvider';

import SlugPkgSlugTransformationProvider from '@shared/container/providers/SlugTransformationProvider/implementations/SlugPkgSlugTransformationProvider';

container.registerInstance<ISlugTransformationProvider>(
  'SlugTransformationProvider',
  container.resolve(SlugPkgSlugTransformationProvider),
);
