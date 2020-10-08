import FakeExamsRepository from '@modules/exams/repositories/fakes/FakeExamsRepository';
import FakeSearchProvider from '@shared/container/providers/SearchProvider/fakes/FakeSearchProvider';
import PushExamToSearchProviderService from './PushExamToSearchProviderService';
import FakeOriginalExamsRepository from '../repositories/fakes/FakeOriginalExamsRepository';
import IPushExamsToSearchDTO from '../dtos/IPushExamsToSearchDTO';

let fakeOriginalExamsRepository: FakeOriginalExamsRepository;
let fakeExamsRepository: FakeExamsRepository;
let pushExamToSearch: PushExamToSearchProviderService;
let fakeSearchProvider: FakeSearchProvider;

describe('ListSearchableExams', () => {
  beforeEach(() => {
    fakeOriginalExamsRepository = new FakeOriginalExamsRepository();
    fakeExamsRepository = new FakeExamsRepository();
    pushExamToSearch = new PushExamToSearchProviderService(
      fakeOriginalExamsRepository,
      fakeSearchProvider,
    );
  });

  it('should be able to push all searchable exams to search provider', async () => {
    const originalExamHemograma1 = await fakeOriginalExamsRepository.create({
      title: 'Hemograma',
      exam_original_id: '001',
      lab_id: '001',
      lab_id_exam_original_id: '001001',
    });

    const originalExamHemograma2 = await fakeOriginalExamsRepository.create({
      title: 'HT COMPLETO',
      exam_original_id: '002',
      lab_id: '002',
      lab_id_exam_original_id: '002002',
    });

    const examHemograma = await fakeExamsRepository.create({
      title: 'Hemograma completo',
      original_exams_ids: [
        originalExamHemograma1.id,
        originalExamHemograma2.id,
      ],
      slug: 'hemograma',
      synonyms: 'Hemograma',
    });

    originalExamHemograma1.exam_id = examHemograma.id;
    originalExamHemograma1.exam = examHemograma;
    originalExamHemograma2.exam_id = examHemograma.id;
    originalExamHemograma2.exam = examHemograma;

    const hemogramaIndex: IPushExamsToSearchDTO = {
      objectID: examHemograma.id,
      title: examHemograma.title,
      slug: examHemograma.slug,
      alternative_titles: ['Hemograma', 'HT COMPLETO'],
    };

    const index = [hemogramaIndex];

    const indexObjectIds = index.map(item => item.objectID);

    const examsObjectIds = await pushExamToSearch.execute(examHemograma);

    expect(examsObjectIds).toEqual(indexObjectIds);
  });
});
