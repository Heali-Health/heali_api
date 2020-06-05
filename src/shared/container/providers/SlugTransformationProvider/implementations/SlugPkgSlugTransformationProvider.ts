import slug from 'slug';

import ISlugTransformationProvider from '../models/ISlugTransformationProvider';

export default class SlugPkgSlugTransformationProvider
  implements ISlugTransformationProvider {
  public async transform(input: string): Promise<string> {
    const sluggedInput = slug(input, {
      lower: true,
    });

    return sluggedInput;
  }
}
