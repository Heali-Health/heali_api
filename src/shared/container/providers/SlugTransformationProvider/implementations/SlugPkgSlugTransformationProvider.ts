import slug from 'slug';

import ISlugTransformationProvider from '../models/ISlugTransformationProvider';

export default class SlugPkgSlugTransformationProvider
  implements ISlugTransformationProvider {
  public transform(input: string): string {
    const sluggedInput = slug(input, {
      lower: true,
    });

    return sluggedInput;
  }
}
