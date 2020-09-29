import FakeExamsRepository from '@modules/exams/repositories/fakes/FakeExamsRepository';
import ListExamsByExamIdsService from '@modules/exams/services/ListExamsByExamIdsService';

let fakeExamsRepository: FakeExamsRepository;
let listExamsByExamIds: ListExamsByExamIdsService;

describe('ListExamsByExamIds', () => {
  beforeEach(() => {
    fakeExamsRepository = new FakeExamsRepository();

    listExamsByExamIds = new ListExamsByExamIdsService(fakeExamsRepository);
  });

  it('should be able to list exams based on exam ids input', async () => {
    const exam1 = await fakeExamsRepository.create({
      title: 'Hemograma completo',
      slug: 'hemograma-completo',
    });

    const exam2 = await fakeExamsRepository.create({
      title: 'Colesterol Total e Frações',
      slug: 'colesterol-total-e-fracoes',
    });

    const exam3 = await fakeExamsRepository.create({
      title: 'Glicose',
      slug: 'glicose',
    });

    const results1 = await listExamsByExamIds.execute([exam1.id]);
    const results2 = await listExamsByExamIds.execute([exam1.id, exam2.id]);
    const results3 = await listExamsByExamIds.execute([exam3.id, exam1.id]);
    const results4 = await listExamsByExamIds.execute([
      exam1.id,
      exam2.id,
      exam3.id,
    ]);

    expect(results1).toEqual([exam1]);
    expect(results2).toEqual([exam2, exam1]);
    expect(results3).toEqual([exam3, exam1]);
    expect(results4).toEqual([exam2, exam3, exam1]);
  });
});
