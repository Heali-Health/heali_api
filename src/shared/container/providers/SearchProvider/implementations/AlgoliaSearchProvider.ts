import IPushExamsToSearchDTO from '@modules/exams/dtos/IPushExamsToSearchDTO';
import algoliasearch, { SearchIndex } from 'algoliasearch';
import ISearchProvider from '../models/ISearchProvider';

export default class AlgoliaSearchProvider implements ISearchProvider {
  private index: SearchIndex;

  private algoliaAppId = process.env.ALGOLIA_APP_ID
    ? process.env.ALGOLIA_APP_ID
    : '';

  private algoliaAppKey = process.env.ALGOLIA_APP_KEY
    ? process.env.ALGOLIA_APP_KEY
    : '';

  constructor() {
    const client = algoliasearch(this.algoliaAppId, this.algoliaAppKey);

    this.index = client.initIndex('exams');
  }

  public async addExamsToIndex(
    exams: IPushExamsToSearchDTO[],
  ): Promise<string[]> {
    const { objectIDs } = await this.index.saveObjects(exams);

    return objectIDs;
  }
}
