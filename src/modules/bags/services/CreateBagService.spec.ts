import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakePatientsRepository from '@modules/users/repositories/fakes/FakePatientsRepository';
import FakeExamsRepository from '@modules/exams/repositories/fakes/FakeExamsRepository';
import FakePricesRepository from '@modules/exams/repositories/fakes/FakePricesRepository';
import FakeLabsRepository from '@modules/labs/repositories/fakes/FakeLabsRepository';
import FakeOriginalExamsRepository from '@modules/exams/repositories/fakes/FakeOriginalExamsRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import Patient from '@modules/users/infra/typeorm/entities/Patient';
import Lab from '@modules/labs/infra/typeorm/entities/Lab';
import OriginalExam from '@modules/exams/infra/typeorm/entities/OriginalExam';
import Exam from '@modules/exams/infra/typeorm/entities/Exam';
import Price from '@modules/exams/infra/typeorm/entities/Price';
import FakeBagsRepository from '../repositories/fakes/FakeBagsRepository';
import CreateBagService from './CreateBagService';

let fakeUsersRepository: FakeUsersRepository;
let fakePatientsRepository: FakePatientsRepository;
let fakeLabsRepository: FakeLabsRepository;
let fakePricesRepository: FakePricesRepository;
let fakeOriginalExamsRepository: FakeOriginalExamsRepository;
let fakeExamsRepository: FakeExamsRepository;
let fakeBagsRepository: FakeBagsRepository;
let createBag: CreateBagService;

let user: User;
let patient: Patient;
let lab: Lab;
let originalExam: OriginalExam;
let exam: Exam;
let price: Price;

describe('CreateBag', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePatientsRepository = new FakePatientsRepository();
    fakeLabsRepository = new FakeLabsRepository();
    fakePricesRepository = new FakePricesRepository();
    fakeOriginalExamsRepository = new FakeOriginalExamsRepository();
    fakeExamsRepository = new FakeExamsRepository();
    fakeBagsRepository = new FakeBagsRepository();
    createBag = new CreateBagService(fakeBagsRepository, fakeUsersRepository);

    user = await fakeUsersRepository.create({
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@example.com',
      password: 'password',
    });

    patient = await fakePatientsRepository.create({
      user_id: user.id,
      first_name: 'Mary',
      last_name: 'Doe',
      document_id: '123456789',
      document_type: 'CPF',
      height: 1.69,
      weight: 70,
    });

    lab = await fakeLabsRepository.create({
      title: 'Lab',
      slug: 'lab',
      address: 'Lab St',
      city: 'Labville',
      open_hour: 'Always open',
      collect_hour: 'Anytime',
      company_id: 'Lab Company',
      company_id_original_id: '001',
      latitude: -23,
      longitude: -46,
      original_id: '001',
    });

    originalExam = await fakeOriginalExamsRepository.create({
      title: 'Test exam',
      exam_original_id: '001',
      lab_id: lab.id,
      lab_id_exam_original_id: `${lab.id}001`,
    });

    exam = await fakeExamsRepository.create({
      title: 'Test',
      slug: 'test',
      original_exams_ids: [originalExam.id],
    });

    price = await fakePricesRepository.create({
      exam_id: exam.id,
      price: 99.99,
      lab_id: lab.id,
      lab_id_exam_original_id: `${lab.id}`,
      original_exam_id: originalExam.id,
    });
  });

  it('should be able to create a new bag', async () => {
    const bag = await createBag.execute({
      userId: undefined,
      prices: undefined,
    });

    expect(bag).toHaveProperty('id');
  });

  it('should be able to create a new bag, informing its use', async () => {
    const bag = await createBag.execute({
      userId: user.id,
      prices: undefined,
    });

    expect(bag).toHaveProperty('id');
    expect(bag.user).toEqual(user);
  });

  it('should be able to create a new bag, informing its price', async () => {
    const bag = await createBag.execute({
      userId: undefined,
      prices: [price],
    });

    expect(bag).toHaveProperty('id');
    expect(bag.prices).toEqual([price]);
  });
});
