import AppError from '@shared/errors/AppError';

import FakeExamsRepository from '@modules/exams/repositories/fakes/FakeExamsRepository';
import CreateExamService from '@modules/exams/services/CreateExamService';

let fakeExamsRepository: FakeExamsRepository;
let createExam: CreateExamService;

describe('SearchExam', () => {
  beforeEach(() => {
    fakeExamsRepository = new FakeExamsRepository();
    createExam = new CreateExamService(fakeExamsRepository);
  });

  it('should be able to create a new exam', async () => {
    const exam = await createExam.execute({
      title: 'Hemograma completo',
    });

    expect(exam.title).toBe('Hemograma completo');
    expect(exam).toHaveProperty('id');
  });

  it('should not be able to create an existent exam', async () => {
    const exam = await createExam.execute({
      title: 'Hemograma completo',
    });

    console.log(exam);

    await expect(
      createExam.execute({ title: exam.title }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
