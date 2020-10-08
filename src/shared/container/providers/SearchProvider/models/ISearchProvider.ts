import IPushExamsToSearchDTO from '@modules/exams/dtos/IPushExamsToSearchDTO';

export default interface ISearchProvider {
  addExamsToIndex(exams: IPushExamsToSearchDTO[]): Promise<string[]>;
}
