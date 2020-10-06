import FakeCompaniesRepository from '@modules/labs/repositories/fakes/FakeCompaniesRepository';
import FakeLabsRepository from '@modules/labs/repositories/fakes/FakeLabsRepository';
import FakeExamsRepository from '@modules/exams/repositories/fakes/FakeExamsRepository';
import PushExamsToSearchService from './PushExamsToSearchService';
import FakeOriginalExamsRepository from '../repositories/fakes/FakeOriginalExamsRepository';
import IPushExamsToSearchDTO from '../dtos/IPushExamsToSearchDTO';

let fakeCompaniesRepository: FakeCompaniesRepository;
let fakeLabsRepository: FakeLabsRepository;
let fakeOriginalExamsRepository: FakeOriginalExamsRepository;
let fakeExamsRepository: FakeExamsRepository;
let pushExamsToSearch: PushExamsToSearchService;

describe('ListSearchableExams', () => {
  beforeEach(() => {
    fakeCompaniesRepository = new FakeCompaniesRepository();
    fakeLabsRepository = new FakeLabsRepository();
    fakeOriginalExamsRepository = new FakeOriginalExamsRepository();
    fakeExamsRepository = new FakeExamsRepository();
    pushExamsToSearch = new PushExamsToSearchService(
      fakeExamsRepository,
      fakeOriginalExamsRepository,
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

    const examColesterol = await fakeExamsRepository.create({
      title: 'Colesterol Total e Frações',
      original_exams_ids: [
        originalExamColesterol1.id,
        originalExamColesterol2.id,
      ],
      slug: 'colesterol-total-e-fracoes',
      synonyms: 'Estudo Lipídico',
    });

    const hemogramaIndex: IPushExamsToSearchDTO = {
      id: examHemograma.id,
      title: examHemograma.title,
      slug: examHemograma.slug,
      alternative_titles: ['Hemograma', 'HT COMPLETO'],
    };

    const colesterolIndex: IPushExamsToSearchDTO = {
      id: examColesterol.id,
      title: examColesterol.title,
      slug: examColesterol.slug,
      alternative_titles: [
        'Colesterol total e frações, soro',
        'Estudo Lipídico',
      ],
    };

    const index = [hemogramaIndex, colesterolIndex];

    const searchableExams = await pushExamsToSearch.execute();

    expect(searchableExams).toContain(index);
  });
});
