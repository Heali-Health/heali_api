import FakePricesRepository from '@modules/exams/repositories/fakes/FakePricesRepository';
import FakeOriginalExamsRepository from '@modules/exams/repositories/fakes/FakeOriginalExamsRepository';
import FakeLabsRepository from '@modules/labs/repositories/fakes/FakeLabsRepository';
import FakeExamsRepository from '@modules/exams/repositories/fakes/FakeExamsRepository';
import FakeSlugTransformationProvider from '@shared/container/providers/SlugTransformationProvider/fakes/FakeSlugTransformation';
import FakeDistanceProvider from '@shared/container/providers/DistanceProvider/fakes/FakeDistanceProvider';

import CreateExamService from '@modules/exams/services/CreateExamService';
import CreateLabService from '@modules/labs/services/CreateLabService';
import ListSelectedLatestPricesFromLabService from '@modules/exams/services/ListSelectedLatestPricesFromLabService';

let fakeOriginalExamsRepository: FakeOriginalExamsRepository;
let fakeExamsRepository: FakeExamsRepository;
let fakePricesRepository: FakePricesRepository;
let fakeLabsRepository: FakeLabsRepository;
let fakeDistanceProvider: FakeDistanceProvider;
let fakeSlugTransformationProvider: FakeSlugTransformationProvider;
let listSelectedLatestPricesFromLab: ListSelectedLatestPricesFromLabService;
let createLab: CreateLabService;
let createExam: CreateExamService;

describe('ListSelectedLatestPricesFromLabService', () => {
  beforeEach(() => {
    fakeOriginalExamsRepository = new FakeOriginalExamsRepository();
    fakeExamsRepository = new FakeExamsRepository();
    fakePricesRepository = new FakePricesRepository();
    fakeLabsRepository = new FakeLabsRepository();
    fakeDistanceProvider = new FakeDistanceProvider();
    fakeSlugTransformationProvider = new FakeSlugTransformationProvider();
    createLab = new CreateLabService(
      fakeLabsRepository,
      fakeSlugTransformationProvider,
    );
    listSelectedLatestPricesFromLab = new ListSelectedLatestPricesFromLabService(
      fakePricesRepository,
      fakeLabsRepository,
      fakeDistanceProvider,
    );
    createExam = new CreateExamService(
      fakeExamsRepository,
      fakeOriginalExamsRepository,
      fakePricesRepository,
      fakeSlugTransformationProvider,
    );
  });

  it('should be able to list labs search results from selected exams', async () => {
    const lab1 = await createLab.execute({
      title: 'Pinheiros',
      slug: await fakeSlugTransformationProvider.transform('Pinheiros'),
      company_id: '3b20687a-beec-4e83-b875-53c5f07c0e77',
      original_id: '3014',
      company_id_original_id: '3b20687a-beec-4e83-b875-53c5f07c0e773014',
      address: 'R. dos Pinheiros, 1392 - Pinheiros - 05422-002',
      city: 'São Paulo',
      state: 'SP',
      latitude: -23.567866,
      longitude: -46.6932762,
      collect_hour: 'Segunda a sexta das 7h às 16h e no sábado das 7h às 13h',
      open_hour: 'Segunda a sexta das 7h às 15h e no sábado das 7h às 12h',
    });

    const lab2 = await createLab.execute({
      title: 'Vila Mariana',
      slug: await fakeSlugTransformationProvider.transform('Vila Mariana'),
      company_id: '3b20687a-beec-4e83-b875-53c5f07c0e77',
      original_id: '3013',
      company_id_original_id: '3b20687a-beec-4e83-b875-53c5f07c0e773013',
      address: 'R. Domingos de Morais, 2104 - Vila Mariana - 04036-000',
      city: 'São Paulo',
      state: 'SP',
      latitude: -23.5945862,
      longitude: -46.6390806,
      collect_hour: 'Segunda a sexta das 7h às 16h e no sábado das 7h às 13h',
      open_hour: 'Segunda a sexta das 7h às 15h e no sábado das 7h às 12h',
    });

    const originalExam1 = await fakeOriginalExamsRepository.create({
      title: 'Hemograma completo',
      exam_original_id: '006',
      lab_id: lab2.id,
      lab_id_exam_original_id: `${lab2.id}006`,
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 15, 12).getTime();
    });

    await fakePricesRepository.create({
      price: 11,
      original_exam_id: originalExam1.id,
      lab_id: lab1.id,
      lab_id_exam_original_id: `${lab1.id}${originalExam1.id}`,
    });

    const price1 = await fakePricesRepository.create({
      price: 11,
      original_exam_id: originalExam1.id,
      lab_id: lab1.id,
      lab_id_exam_original_id: `${lab1.id}${originalExam1.id}`,
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 15, 12).getTime();
    });

    await fakePricesRepository.create({
      price: 12,
      original_exam_id: originalExam1.id,
      lab_id: lab2.id,
      lab_id_exam_original_id: `${lab2.id}${originalExam1.id}`,
    });

    const price2 = await fakePricesRepository.create({
      price: 12,
      original_exam_id: originalExam1.id,
      lab_id: lab2.id,
      lab_id_exam_original_id: `${lab2.id}${originalExam1.id}`,
    });

    const originalExam2 = await fakeOriginalExamsRepository.create({
      title: 'Glicemia',
      exam_original_id: '007',
      lab_id: lab1.id,
      lab_id_exam_original_id: `${lab1.id}007`,
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 15, 12).getTime();
    });

    await fakePricesRepository.create({
      price: 13,
      original_exam_id: originalExam2.id,
      lab_id: lab1.id,
      lab_id_exam_original_id: `${lab1.id}${originalExam2.id}`,
    });

    const price3 = await fakePricesRepository.create({
      price: 13,
      original_exam_id: originalExam2.id,
      lab_id: lab1.id,
      lab_id_exam_original_id: `${lab1.id}${originalExam2.id}`,
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 15, 12).getTime();
    });

    await fakePricesRepository.create({
      price: 14,
      original_exam_id: originalExam2.id,
      lab_id: lab2.id,
      lab_id_exam_original_id: `${lab2.id}${originalExam2.id}`,
    });

    const price4 = await fakePricesRepository.create({
      price: 14,
      original_exam_id: originalExam2.id,
      lab_id: lab2.id,
      lab_id_exam_original_id: `${lab2.id}${originalExam2.id}`,
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

    const priceSearchResults = await listSelectedLatestPricesFromLab.execute({
      exams_ids: [exam1.id, exam2.id],
      location: {
        address:
          'R. Conselheiro Brotero, 1092 - Santa Cecilia, São Paulo - SP, 01232-010, Brazil',
        latitude: -23.5358061,
        longitude: -46.6606631,
      },
      lab_id: lab1.id,
    });

    expect(priceSearchResults.prices).toHaveLength(2);
    expect(priceSearchResults.lab).toBe(lab1);
    expect(priceSearchResults.exams_found).toBe(2);
    expect(priceSearchResults.total_exams).toBe(2);
    expect(priceSearchResults.distance).toBeGreaterThan(0);
  });
});
