import FakePricesRepository from '@modules/exams/repositories/fakes/FakePricesRepository';
import FakeOriginalExamsRepository from '@modules/exams/repositories/fakes/FakeOriginalExamsRepository';
import FakeLabsRepository from '@modules/labs/repositories/fakes/FakeLabsRepository';
import FakeExamsRepository from '@modules/exams/repositories/fakes/FakeExamsRepository';
import FakeSlugTransformationProvider from '@shared/container/providers/SlugTransformationProvider/fakes/FakeSlugTransformation';
import FakeDistanceProvider from '@shared/container/providers/DistanceProvider/fakes/FakeDistanceProvider';
import AppError from '@shared/errors/AppError';

import CreateExamService from '@modules/exams/services/CreateExamService';
import CreateLabService from '@modules/labs/services/CreateLabService';
import ListLabsSearchResultsService from '@modules/exams/services/ListLabsSearchResultsService';
import Lab from '@modules/labs/infra/typeorm/entities/Lab';
import Exam from '../infra/typeorm/entities/Exam';
import Price from '../infra/typeorm/entities/Price';

let fakeOriginalExamsRepository: FakeOriginalExamsRepository;
let fakeExamsRepository: FakeExamsRepository;
let fakePricesRepository: FakePricesRepository;
let fakeLabsRepository: FakeLabsRepository;
let fakeDistanceProvider: FakeDistanceProvider;
let fakeSlugTransformationProvider: FakeSlugTransformationProvider;
let listLabsSearchResults: ListLabsSearchResultsService;
let createLab: CreateLabService;
let createExam: CreateExamService;

let exam1: Exam;
let exam2: Exam;

let price1: Price;
let price2: Price;
let price3: Price;
let price4: Price;

let lab1: Lab;
let lab2: Lab;

describe('ListLabsSearchResultsService', () => {
  const initializePricesDatabase = async (): Promise<void> => {
    lab1 = await createLab.execute({
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

    lab2 = await createLab.execute({
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

    price1 = await fakePricesRepository.create({
      price: 11,
      original_exam_id: originalExam1.id,
      lab_id: lab1.id,
      lab_id_exam_original_id: `${lab1.id}${originalExam1.id}`,
    });

    price1.lab = lab1;

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 15, 12).getTime();
    });

    await fakePricesRepository.create({
      price: 12,
      original_exam_id: originalExam1.id,
      lab_id: lab2.id,
      lab_id_exam_original_id: `${lab2.id}${originalExam1.id}`,
    });

    price2 = await fakePricesRepository.create({
      price: 12,
      original_exam_id: originalExam1.id,
      lab_id: lab2.id,
      lab_id_exam_original_id: `${lab2.id}${originalExam1.id}`,
    });

    price2.lab = lab2;

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

    price3 = await fakePricesRepository.create({
      price: 13,
      original_exam_id: originalExam2.id,
      lab_id: lab1.id,
      lab_id_exam_original_id: `${lab1.id}${originalExam2.id}`,
    });

    price3.lab = lab1;

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 15, 12).getTime();
    });

    await fakePricesRepository.create({
      price: 14,
      original_exam_id: originalExam2.id,
      lab_id: lab2.id,
      lab_id_exam_original_id: `${lab2.id}${originalExam2.id}`,
    });

    price4 = await fakePricesRepository.create({
      price: 14,
      original_exam_id: originalExam2.id,
      lab_id: lab2.id,
      lab_id_exam_original_id: `${lab2.id}${originalExam2.id}`,
    });

    price4.lab = lab2;

    exam1 = await createExam.execute({
      title: 'Hemograma',
      original_exams_ids: [originalExam1.id],
    });

    exam2 = await createExam.execute({
      title: 'Glicemia',
      original_exams_ids: [originalExam2.id],
    });
  };

  beforeEach(async () => {
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
    listLabsSearchResults = new ListLabsSearchResultsService(
      fakePricesRepository,
      fakeDistanceProvider,
    );
    createExam = new CreateExamService(
      fakeExamsRepository,
      fakeOriginalExamsRepository,
      fakePricesRepository,
      fakeSlugTransformationProvider,
    );

    await initializePricesDatabase();
  });

  it('should be able to list labs search results from one selected exam id', async () => {
    const priceSearchResults = await listLabsSearchResults.execute({
      examsIds: exam1.id,
      location: {
        address:
          'R. Conselheiro Brotero, 1092 - Santa Cecilia, São Paulo - SP, 01232-010, Brazil',
        latitude: -23.5358061,
        longitude: -46.6606631,
      },
    });

    expect(priceSearchResults).toHaveLength(2);
    expect(priceSearchResults[0].lab).toEqual(lab1);
    expect(priceSearchResults[1].lab).toEqual(lab2);
  });

  it('should be able to list labs search results from more than one selected exam id', async () => {
    const priceSearchResults = await listLabsSearchResults.execute({
      examsIds: [exam1.id, exam2.id],
      location: {
        address:
          'R. Conselheiro Brotero, 1092 - Santa Cecilia, São Paulo - SP, 01232-010, Brazil',
        latitude: -23.5358061,
        longitude: -46.6606631,
      },
    });

    expect(priceSearchResults).toHaveLength(2);
  });

  it('should be able to list labs search results from one selected exam slug', async () => {
    const priceSearchResults = await listLabsSearchResults.execute({
      examsSlugs: exam1.slug,
      location: {
        address:
          'R. Conselheiro Brotero, 1092 - Santa Cecilia, São Paulo - SP, 01232-010, Brazil',
        latitude: -23.5358061,
        longitude: -46.6606631,
      },
    });

    expect(priceSearchResults).toHaveLength(2);
    expect(priceSearchResults[0].lab).toEqual(lab1);
    expect(priceSearchResults[1].lab).toEqual(lab2);
  });

  it('should be able to list labs search results from more than one selected exam slug', async () => {
    const priceSearchResults = await listLabsSearchResults.execute({
      examsSlugs: [exam1.slug, exam2.slug],
      location: {
        address:
          'R. Conselheiro Brotero, 1092 - Santa Cecilia, São Paulo - SP, 01232-010, Brazil',
        latitude: -23.5358061,
        longitude: -46.6606631,
      },
    });

    expect(priceSearchResults).toHaveLength(2);
  });

  it('should be able to throw an error if there is no appointed exam id nor exam slug', async () => {
    await expect(
      listLabsSearchResults.execute({
        location: {
          address:
            'R. Conselheiro Brotero, 1092 - Santa Cecilia, São Paulo - SP, 01232-010, Brazil',
          latitude: -23.5358061,
          longitude: -46.6606631,
        },
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
