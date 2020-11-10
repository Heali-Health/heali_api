import FakeExamsRepository from '@modules/exams/repositories/fakes/FakeExamsRepository';
import SearchExamByUserInputService from '@modules/exams/services/SearchExamByUserInputService';

let fakeExamsRepository: FakeExamsRepository;
let searchExamByUserInput: SearchExamByUserInputService;

describe('SearchExamByUserInput', () => {
  beforeEach(() => {
    fakeExamsRepository = new FakeExamsRepository();

    searchExamByUserInput = new SearchExamByUserInputService(
      fakeExamsRepository,
    );
  });

  it('should be able to search exam based on an user entry', async () => {
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

    const results1 = await searchExamByUserInput.execute('hemograma');
    const results2 = await searchExamByUserInput.execute('colesterol');
    const results3 = await searchExamByUserInput.execute('glicose');
    const results4 = await searchExamByUserInput.execute('e');

    expect(results1).toEqual([exam1]);
    expect(results2).toEqual([exam2]);
    expect(results3).toEqual([exam3]);
    expect(results4).toEqual([exam1, exam2, exam3]);
  });
});
