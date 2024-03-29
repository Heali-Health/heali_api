import AppError from '@shared/errors/AppError';

import FakeExamsRepository from '@modules/exams/repositories/fakes/FakeExamsRepository';
import FakeOriginalExamsRepository from '@modules/exams/repositories/fakes/FakeOriginalExamsRepository';
import FakePricesRepository from '@modules/exams/repositories/fakes/FakePricesRepository';
import FakeSlugTransformationProvider from '@shared/container/providers/SlugTransformationProvider/fakes/FakeSlugTransformation';
import CreateExamService from '@modules/exams/services/CreateExamService';
import FakeMailMarketingProvider from '@shared/container/providers/MailMarketingProvider/fakes/FakeMailMarketingProvider';

let fakeExamsRepository: FakeExamsRepository;
let fakeOriginalExamsRepository: FakeOriginalExamsRepository;
let fakePricesRepository: FakePricesRepository;
let fakeSlugTransformationProvider: FakeSlugTransformationProvider;
let fakeMailMarketingProvider: FakeMailMarketingProvider;
let createExam: CreateExamService;

describe('CreateExam', () => {
  beforeEach(() => {
    fakeExamsRepository = new FakeExamsRepository();
    fakeOriginalExamsRepository = new FakeOriginalExamsRepository();
    fakePricesRepository = new FakePricesRepository();
    fakeSlugTransformationProvider = new FakeSlugTransformationProvider();
    fakeMailMarketingProvider = new FakeMailMarketingProvider();
    createExam = new CreateExamService(
      fakeExamsRepository,
      fakeOriginalExamsRepository,
      fakePricesRepository,
      fakeSlugTransformationProvider,
      fakeMailMarketingProvider,
    );
  });

  it('should be able to create a new exam', async () => {
    const exam = await createExam.execute({
      title: 'Hemograma completo',
      slug: await fakeSlugTransformationProvider.transform(
        'Hemograma completo',
      ),
    });

    expect(exam.title).toBe('Hemograma completo');
    expect(exam).toHaveProperty('id');
  });

  it('should not be able to create an existent exam', async () => {
    const exam = await createExam.execute({
      title: 'Hemograma completo',
      slug: await fakeSlugTransformationProvider.transform(
        'Hemograma completo',
      ),
    });

    await expect(
      createExam.execute({ title: exam.title, slug: exam.slug }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to associate a newly created exam to their correspondent existent original exams and prices', async () => {
    const originalExam1 = await fakeOriginalExamsRepository.create({
      title: 'Hemograma completo',
      exam_original_id: '007',
      lab_id: '007',
      lab_id_exam_original_id: '007007',
    });

    const price1 = await fakePricesRepository.create({
      price: 10,
      original_exam_id: originalExam1.id,
      lab_id: '007',
      lab_id_exam_original_id: `007${originalExam1.id}`,
    });

    const originalExam2 = await fakeOriginalExamsRepository.create({
      title: 'Hemograma',
      exam_original_id: '007',
      lab_id: '006',
      lab_id_exam_original_id: '006007',
    });

    const price2 = await fakePricesRepository.create({
      price: 20,
      original_exam_id: originalExam2.id,
      lab_id: '006',
      lab_id_exam_original_id: `006${originalExam2.id}`,
    });

    const originalExam3 = await fakeOriginalExamsRepository.create({
      title: 'Colesterol Total e Frações',
      exam_original_id: '999',
      lab_id: '007',
      lab_id_exam_original_id: '007999',
    });

    await fakePricesRepository.create({
      price: 30,
      original_exam_id: originalExam3.id,
      lab_id: '007',
      lab_id_exam_original_id: `007${originalExam3.id}`,
    });

    const exam1 = await createExam.execute({
      title: 'Hemograma completo',
      slug: await fakeSlugTransformationProvider.transform(
        'Hemograma completo',
      ),
      original_exams_ids: [originalExam1.id, originalExam2.id],
    });

    expect(originalExam1.exam.id).toBe(exam1.id);
    expect(price1.exam.id).toBe(exam1.id);
    expect(originalExam2.exam.id).toBe(exam1.id);
    expect(price2.exam.id).toBe(exam1.id);
  });
});
