import FakePricesRepository from '@modules/exams/repositories/fakes/FakePricesRepository';
import FakeOriginalExamsRepository from '@modules/exams/repositories/fakes/FakeOriginalExamsRepository';
import FakeExamsRepository from '@modules/exams/repositories/fakes/FakeExamsRepository';
import FakeSlugTransformationProvider from '@shared/container/providers/SlugTransformationProvider/fakes/FakeSlugTransformation';

import CreateExamService from '@modules/exams/services/CreateExamService';
import ListPriceSearchResultsService from '@modules/exams/services/ListPriceSearchResultsService';

let fakeOriginalExamsRepository: FakeOriginalExamsRepository;
let fakeExamsRepository: FakeExamsRepository;
let fakePricesRepository: FakePricesRepository;
let fakeSlugTransformationProvider: FakeSlugTransformationProvider;
let listPriceSearchResults: ListPriceSearchResultsService;
let createExam: CreateExamService;

describe('ListPriceSearchResults', () => {
  beforeEach(() => {
    fakeOriginalExamsRepository = new FakeOriginalExamsRepository();
    fakeExamsRepository = new FakeExamsRepository();
    fakePricesRepository = new FakePricesRepository();
    fakeSlugTransformationProvider = new FakeSlugTransformationProvider();
    listPriceSearchResults = new ListPriceSearchResultsService(
      fakePricesRepository,
    );
    createExam = new CreateExamService(
      fakeExamsRepository,
      fakeOriginalExamsRepository,
      fakePricesRepository,
      fakeSlugTransformationProvider,
    );
  });

  it('should be able to list of selected exams prices', async () => {
    const originalExam1 = await fakeOriginalExamsRepository.create({
      title: 'Hemograma completo',
      exam_original_id: '006',
      lab_id: '007',
      lab_id_exam_original_id: '007006',
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 15, 12).getTime();
    });

    await fakePricesRepository.create({
      price: 11,
      original_exam_id: originalExam1.id,
      lab_id: '006',
      lab_id_exam_original_id: `006${originalExam1.id}`,
    });

    const price1 = await fakePricesRepository.create({
      price: 11,
      original_exam_id: originalExam1.id,
      lab_id: '006',
      lab_id_exam_original_id: `006${originalExam1.id}`,
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 15, 12).getTime();
    });

    await fakePricesRepository.create({
      price: 12,
      original_exam_id: originalExam1.id,
      lab_id: '007',
      lab_id_exam_original_id: `007${originalExam1.id}`,
    });

    const price2 = await fakePricesRepository.create({
      price: 12,
      original_exam_id: originalExam1.id,
      lab_id: '007',
      lab_id_exam_original_id: `007${originalExam1.id}`,
    });

    const originalExam2 = await fakeOriginalExamsRepository.create({
      title: 'Glicemia',
      exam_original_id: '007',
      lab_id: '006',
      lab_id_exam_original_id: '006007',
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 15, 12).getTime();
    });

    await fakePricesRepository.create({
      price: 13,
      original_exam_id: originalExam2.id,
      lab_id: '006',
      lab_id_exam_original_id: `006${originalExam2.id}`,
    });

    const price3 = await fakePricesRepository.create({
      price: 13,
      original_exam_id: originalExam2.id,
      lab_id: '006',
      lab_id_exam_original_id: `006${originalExam2.id}`,
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 15, 12).getTime();
    });

    await fakePricesRepository.create({
      price: 14,
      original_exam_id: originalExam2.id,
      lab_id: '007',
      lab_id_exam_original_id: `007${originalExam2.id}`,
    });

    const price4 = await fakePricesRepository.create({
      price: 14,
      original_exam_id: originalExam2.id,
      lab_id: '007',
      lab_id_exam_original_id: `007${originalExam2.id}`,
    });

    const exam1 = await createExam.execute({
      title: 'Hemograma',
      slug: 'hemograma',
      original_exams_ids: [originalExam1.id],
    });

    const exam2 = await createExam.execute({
      title: 'Glicemia',
      slug: 'glicemia',
      original_exams_ids: [originalExam2.id],
    });

    const priceSearchResults = await listPriceSearchResults.execute({
      exams_ids: [exam1.id, exam2.id],
      location: {
        address: '',
        latitude: 0,
        longitude: 0,
      },
    });

    console.log([price1, price2, price3, price4]);

    expect(priceSearchResults).toMatchObject([price1, price2, price3, price4]);
  });
});
