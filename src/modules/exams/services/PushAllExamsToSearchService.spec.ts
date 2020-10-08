import FakeExamsRepository from '@modules/exams/repositories/fakes/FakeExamsRepository';
import FakeSearchProvider from '@shared/container/providers/SearchProvider/fakes/FakeSearchProvider';
import PushAllExamsToSearchService from './PushAllExamsToSearchService';
import FakeOriginalExamsRepository from '../repositories/fakes/FakeOriginalExamsRepository';
import IPushExamsToSearchDTO from '../dtos/IPushExamsToSearchDTO';

let fakeOriginalExamsRepository: FakeOriginalExamsRepository;
let fakeExamsRepository: FakeExamsRepository;
let pushExamsToSearch: PushAllExamsToSearchService;
let fakeSearchProvider: FakeSearchProvider;

describe('ListSearchableExams', () => {
  beforeEach(() => {
    fakeOriginalExamsRepository = new FakeOriginalExamsRepository();
    fakeExamsRepository = new FakeExamsRepository();
    pushExamsToSearch = new PushAllExamsToSearchService(
      fakeExamsRepository,
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

    const originalExamColesterol1 = await fakeOriginalExamsRepository.create({
      title: 'Colesterol total e frações, soro',
      exam_original_id: '003',
      lab_id: '003',
      lab_id_exam_original_id: '003003',
    });

    const originalExamColesterol2 = await fakeOriginalExamsRepository.create({
      title: 'COLESTEROL TOTAL E FRACOES COM TRIGLICERIDES',
      exam_original_id: '004',
      lab_id: '004',
      lab_id_exam_original_id: '004004',
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

    const examColesterol = await fakeExamsRepository.create({
      title: 'Colesterol Total e Frações',
      original_exams_ids: [
        originalExamColesterol1.id,
        originalExamColesterol2.id,
      ],
      slug: 'colesterol-total-e-fracoes',
      synonyms: 'Estudo Lipídico',
    });

    originalExamColesterol1.exam_id = examColesterol.id;
    originalExamColesterol1.exam = examColesterol;
    originalExamColesterol2.exam_id = examColesterol.id;
    originalExamColesterol2.exam = examColesterol;

    const hemogramaIndex: IPushExamsToSearchDTO = {
      objectID: examHemograma.id,
      title: examHemograma.title,
      slug: examHemograma.slug,
      alternative_titles: ['Hemograma', 'HT COMPLETO'],
    };

    const colesterolIndex: IPushExamsToSearchDTO = {
      objectID: examColesterol.id,
      title: examColesterol.title,
      slug: examColesterol.slug,
      alternative_titles: [
        'Colesterol total e frações, soro',
        'COLESTEROL TOTAL E FRACOES COM TRIGLICERIDES',
      ],
    };

    const index = [hemogramaIndex, colesterolIndex];

    const indexObjectIds = index.map(item => item.objectID);

    const examsObjectIds = await pushExamsToSearch.execute();

    expect(examsObjectIds).toEqual(indexObjectIds);
  });
});
