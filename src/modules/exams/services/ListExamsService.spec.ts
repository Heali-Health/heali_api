import FakeExamsRepository from '@modules/exams/repositories/fakes/FakeExamsRepository';
import ListExamsService from '@modules/exams/services/ListExamsService';

let fakeExamsRepository: FakeExamsRepository;
let listExams: ListExamsService;

describe('ListExams', () => {
  beforeEach(() => {
    fakeExamsRepository = new FakeExamsRepository();

    listExams = new ListExamsService(fakeExamsRepository);
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

    const results1 = await listExams.execute({ exam_ids: exam1.id });
    const results2 = await listExams.execute({ exam_ids: [exam1.id] });
    const results3 = await listExams.execute({
      exam_ids: [exam1.id, exam2.id],
    });
    const results4 = await listExams.execute({
      exam_ids: [exam3.id, exam1.id],
    });
    const results5 = await listExams.execute({
      exam_ids: [exam1.id, exam2.id, exam3.id],
    });

    expect(results1).toEqual([exam1]);
    expect(results2).toEqual([exam1]);
    expect(results3).toEqual([exam2, exam1]);
    expect(results4).toEqual([exam3, exam1]);
    expect(results5).toEqual([exam2, exam3, exam1]);
  });

  it('should be able to list exams based on exam slugs input', async () => {
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

    const results1 = await listExams.execute({ slugs: exam1.slug });
    const results2 = await listExams.execute({ slugs: [exam1.slug] });
    const results3 = await listExams.execute({
      slugs: [exam1.slug, exam2.slug],
    });
    const results4 = await listExams.execute({
      slugs: [exam3.slug, exam1.slug],
    });
    const results5 = await listExams.execute({
      slugs: [exam1.slug, exam2.slug, exam3.slug],
    });

    expect(results1).toEqual([exam1]);
    expect(results2).toEqual([exam1]);
    expect(results3).toEqual([exam2, exam1]);
    expect(results4).toEqual([exam3, exam1]);
    expect(results5).toEqual([exam2, exam3, exam1]);
  });
});
