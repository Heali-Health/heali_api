import FakeExamsRepository from '@modules/exams/repositories/fakes/FakeExamsRepository';
import SearchExamService from '@modules/exams/services/SearchExamService';

let fakeExamsRepository: FakeExamsRepository;
let searchExam: SearchExamService;

describe('SearchExam', () => {
  beforeEach(() => {
    fakeExamsRepository = new FakeExamsRepository();

    searchExam = new SearchExamService(fakeExamsRepository);
  });

  it('should be able to search exam based on an user entry', async () => {
    const exam1 = await fakeExamsRepository.create({
      title: 'Hemograma completo',
    });

    const exam2 = await fakeExamsRepository.create({
      title: 'Colesterol Total e Frações',
    });

    const exam3 = await fakeExamsRepository.create({
      title: 'Glicose',
    });

    const results1 = await searchExam.execute('hemograma');
    const results2 = await searchExam.execute('colesterol');
    const results3 = await searchExam.execute('glicose');
    const results4 = await searchExam.execute('e');

    expect(results1).toEqual([exam1]);
    expect(results2).toEqual([exam2]);
    expect(results3).toEqual([exam3]);
    expect(results4).toEqual([exam1, exam2, exam3]);
  });
});
