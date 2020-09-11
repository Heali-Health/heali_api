import FakeExamsRepository from '@modules/exams/repositories/fakes/FakeExamsRepository';
import FakeOriginalExamsRepository from '@modules/exams/repositories/fakes/FakeOriginalExamsRepository';
import FakePricesRepository from '@modules/exams/repositories/fakes/FakePricesRepository';
import FakeLabsRepository from '@modules/labs/repositories/fakes/FakeLabsRepository';
import FakePatientsRepository from '@modules/users/repositories/fakes/FakePatientsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeQueueProvider from '@shared/container/providers/QueueProvider/fakes/FakeQueueProvider';
import SendScheduleRequestEmailService from './SendScheduleRequestEmailService';

let fakeOriginalExamsRepository: FakeOriginalExamsRepository;
let fakeExamsRepository: FakeExamsRepository;
let fakePricesRepository: FakePricesRepository;
let fakeLabsRepository: FakeLabsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakePatientsRepository: FakePatientsRepository;
let fakeQueueProvider: FakeQueueProvider;
let sendScheduleRequestEmail: SendScheduleRequestEmailService;

describe('SendScheduleRequestEmail', () => {
  beforeEach(() => {
    fakeOriginalExamsRepository = new FakeOriginalExamsRepository();
    fakeExamsRepository = new FakeExamsRepository();
    fakePricesRepository = new FakePricesRepository();
    fakeLabsRepository = new FakeLabsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakePatientsRepository = new FakePatientsRepository();
    fakeQueueProvider = new FakeQueueProvider();
    sendScheduleRequestEmail = new SendScheduleRequestEmailService(
      fakeQueueProvider,
    );
  });

  it('should be able to add user`s schedule request email to the queue', async () => {
    const addToQueue = jest.spyOn(fakeQueueProvider, 'add');

    const lab1 = await fakeLabsRepository.create({
      title: 'Pinheiros',
      slug: 'pinheiros',
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

    const lab2 = await fakeLabsRepository.create({
      title: 'Vila Mariana',
      slug: 'vila-mariana',
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

    const exam1 = await fakeExamsRepository.create({
      title: 'Hemograma',
      slug: 'hemograma',
      original_exams_ids: [originalExam1.id],
    });

    const exam2 = await fakeExamsRepository.create({
      title: 'Glicemia',
      slug: 'glicemia',
      original_exams_ids: [originalExam2.id],
    });

    const user = await fakeUsersRepository.create({
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const patient = await fakePatientsRepository.create({
      user_id: user.id,
      first_name: 'Mary',
      last_name: 'Doe',
      document_type: 'CPF',
      document_id: '1234567890',
      email: 'marydoe@example.com',
    });

    const prices = [price1, price2, price3, price4];

    await sendScheduleRequestEmail.execute({
      user,
      patient,
      prices,
    });

    expect(addToQueue).toHaveBeenCalled();
  });
});
