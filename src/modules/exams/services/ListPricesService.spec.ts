import FakePricesRepository from '@modules/exams/repositories/fakes/FakePricesRepository';
import FakeOriginalExamsRepository from '@modules/exams/repositories/fakes/FakeOriginalExamsRepository';
import FakeLabsRepository from '@modules/labs/repositories/fakes/FakeLabsRepository';
import FakeExamsRepository from '@modules/exams/repositories/fakes/FakeExamsRepository';
import FakeSlugTransformationProvider from '@shared/container/providers/SlugTransformationProvider/fakes/FakeSlugTransformation';

import CreateExamService from '@modules/exams/services/CreateExamService';
import CreateLabService from '@modules/labs/services/CreateLabService';
import ListSelectedLatestPricesFromLabService from '@modules/exams/services/ListSelectedLatestPricesFromLabService';
import Lab from '@modules/labs/infra/typeorm/entities/Lab';
import Exam from '../infra/typeorm/entities/Exam';
import Price from '../infra/typeorm/entities/Price';
import OriginalExam from '../infra/typeorm/entities/OriginalExam';
import ListPricesService from './ListPricesService';

let fakeOriginalExamsRepository: FakeOriginalExamsRepository;
let fakeExamsRepository: FakeExamsRepository;
let fakePricesRepository: FakePricesRepository;
let fakeLabsRepository: FakeLabsRepository;
let fakeSlugTransformationProvider: FakeSlugTransformationProvider;
let listSelectedLatestPricesFromLab: ListSelectedLatestPricesFromLabService;
let createLab: CreateLabService;
let createExam: CreateExamService;
let listPrices: ListPricesService;

let exam1: Exam;
let exam2: Exam;

let originalExam1: OriginalExam;
let originalExam2: OriginalExam;

let price1: Price;
let price1b: Price;
let price2: Price;
let price2b: Price;
let price3: Price;
let price3b: Price;
let price4: Price;
let price4b: Price;

let lab1: Lab;
let lab2: Lab;

describe('ListPricesService', () => {
  const initializePricesDatabase = async (): Promise<void> => {
    lab1 = await createLab.execute({
      title: 'Pinheiros',
      slug: fakeSlugTransformationProvider.transform('Pinheiros'),
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
      slug: fakeSlugTransformationProvider.transform('Vila Mariana'),
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

    originalExam1 = await fakeOriginalExamsRepository.create({
      title: 'Hemograma completo',
      exam_original_id: '006',
      lab_id: lab2.id,
      lab_id_exam_original_id: `${lab2.id}006`,
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 15, 12).getTime();
    });

    price1b = await fakePricesRepository.create({
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

    price1.original_exam = originalExam1;

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 15, 12).getTime();
    });

    price2b = await fakePricesRepository.create({
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

    price2.original_exam = originalExam1;

    originalExam2 = await fakeOriginalExamsRepository.create({
      title: 'Glicemia',
      exam_original_id: '007',
      lab_id: lab1.id,
      lab_id_exam_original_id: `${lab1.id}007`,
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 15, 12).getTime();
    });

    price3b = await fakePricesRepository.create({
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

    price3.original_exam = originalExam2;

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 15, 12).getTime();
    });

    price4b = await fakePricesRepository.create({
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
    price4.original_exam = originalExam2;

    exam1 = await createExam.execute({
      title: 'Hemograma',
      slug: 'hemograma',
      original_exams_ids: [originalExam1.id],
    });

    exam2 = await createExam.execute({
      title: 'Glicemia',
      slug: 'glicemia',
      original_exams_ids: [originalExam2.id],
    });

    price1.exam = exam1;
    price2.exam = exam1;
    price3.exam = exam2;
    price4.exam = exam2;

    price1.lab = lab1;
    price1b.lab = lab1;
    price2.lab = lab2;
    price2b.lab = lab2;
    price3.lab = lab1;
    price3b.lab = lab1;
    price4.lab = lab2;
    price4b.lab = lab2;
  };

  beforeEach(async () => {
    fakeOriginalExamsRepository = new FakeOriginalExamsRepository();
    fakeExamsRepository = new FakeExamsRepository();
    fakePricesRepository = new FakePricesRepository();
    fakeLabsRepository = new FakeLabsRepository();
    fakeSlugTransformationProvider = new FakeSlugTransformationProvider();
    createLab = new CreateLabService(
      fakeLabsRepository,
      fakeSlugTransformationProvider,
    );
    createExam = new CreateExamService(
      fakeExamsRepository,
      fakeOriginalExamsRepository,
      fakePricesRepository,
      fakeSlugTransformationProvider,
    );
    listPrices = new ListPricesService(fakePricesRepository);

    await initializePricesDatabase();
  });

  it('should be able to list all prices by informing an id', async () => {
    const price = await listPrices.execute(price1.id);

    expect(price).toHaveLength(1);
    expect(price[0]).toEqual(price1);
  });

  it('should be able to list all prices by informing an id list', async () => {
    const prices = await listPrices.execute([price1.id, price2.id, price3.id]);

    expect(prices).toHaveLength(3);
    expect(prices).toEqual([price1, price2, price3]);
  });
});
