import IPushExamsToSearchDTO from '@modules/exams/dtos/IPushExamsToSearchDTO';
import ISearchProvider from '../models/ISearchProvider';

export default class FakeSearchProvider implements ISearchProvider {
  private objectIds: string[] = [];

  public async addExamsToIndex(
    exams: IPushExamsToSearchDTO[],
  ): Promise<string[]> {
    exams.map(exam => {
      this.objectIds.push(exam.objectID);
      return exam.objectID;
    });

    return this.objectIds;
  }
}
