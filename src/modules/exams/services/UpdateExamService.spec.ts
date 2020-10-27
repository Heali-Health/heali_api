import AppError from '@shared/errors/AppError';

import FakeExamsRepository from '@modules/exams/repositories/fakes/FakeExamsRepository';
import FakeOriginalExamsRepository from '@modules/exams/repositories/fakes/FakeOriginalExamsRepository';
import FakePricesRepository from '@modules/exams/repositories/fakes/FakePricesRepository';
import FakeSlugTransformationProvider from '@shared/container/providers/SlugTransformationProvider/fakes/FakeSlugTransformation';
import UpdateExamService from '@modules/exams/services/UpdateExamService';

let fakeExamsRepository: FakeExamsRepository;
let fakeOriginalExamsRepository: FakeOriginalExamsRepository;
let fakePricesRepository: FakePricesRepository;
let fakeSlugTransformationProvider: FakeSlugTransformationProvider;
let updateExam: UpdateExamService;

describe('UpdateExam', () => {
  beforeEach(() => {
    fakeExamsRepository = new FakeExamsRepository();
    fakeOriginalExamsRepository = new FakeOriginalExamsRepository();
    fakePricesRepository = new FakePricesRepository();
    fakeSlugTransformationProvider = new FakeSlugTransformationProvider();
    updateExam = new UpdateExamService(
      fakeExamsRepository,
      fakeOriginalExamsRepository,
      fakePricesRepository,
      fakeSlugTransformationProvider,
    );
  });

  it('should be able to update an exam´s title', async () => {
    const exam = await fakeExamsRepository.create({
      title: 'example',
    });

    const updatedExam = await updateExam.execute({
      id: exam.id,
      title: 'Hemograma completo',
    });

    const slug = fakeSlugTransformationProvider.transform('Hemograma completo');

    expect(updatedExam.title).toBe('Hemograma completo');
    expect(updatedExam.slug).toEqual(slug);
  });

  it('should not be able to update an non existent exam', async () => {
    await expect(
      updateExam.execute({
        id: 'non-existent-id',
        title: 'Hemograma completo',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update an exam´s slug', async () => {
    const exam = await fakeExamsRepository.create({
      title: 'example',
    });

    const updatedExam = await updateExam.execute({
      id: exam.id,
      slug: 'updated-slug',
    });

    expect(updatedExam.slug).toEqual('updated-slug');
  });

  it('should be able to associate an updated exam to their correspondent existent original exams and prices', async () => {
    const exam1 = await fakeExamsRepository.create({
      title: 'example',
    });

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

    const updatedExam1 = await updateExam.execute({
      id: exam1.id,
      title: 'Hemograma completo',
      slug: fakeSlugTransformationProvider.transform('Hemograma completo'),
      original_exams_ids: [originalExam1.id, originalExam2.id],
    });

    expect(originalExam1.exam.id).toBe(updatedExam1.id);
    expect(price1.exam.id).toBe(updatedExam1.id);
    expect(originalExam2.exam.id).toBe(updatedExam1.id);
    expect(price2.exam.id).toBe(updatedExam1.id);
  });
});
