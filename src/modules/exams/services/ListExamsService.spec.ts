import FakeExamsRepository from '@modules/exams/repositories/fakes/FakeExamsRepository';
import ListExamsService from '@modules/exams/services/ListExamsService';

let fakeExamsRepository: FakeExamsRepository;
let listExams: ListExamsService;

describe('ListExams', () => {
  beforeEach(() => {
    fakeExamsRepository = new FakeExamsRepository();

    listExams = new ListExamsService(fakeExamsRepository);
  });

  it('should be able to list all exams', async () => {
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

    await expect(listExams.execute()).resolves.toEqual([exam1, exam2, exam3]);
  });
});
