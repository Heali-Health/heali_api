import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakePatientsRepository from '@modules/users/repositories/fakes/FakePatientsRepository';
import FakeExamsRepository from '@modules/exams/repositories/fakes/FakeExamsRepository';
import FakePricesRepository from '@modules/exams/repositories/fakes/FakePricesRepository';
import FakeLabsRepository from '@modules/labs/repositories/fakes/FakeLabsRepository';
import FakeOriginalExamsRepository from '@modules/exams/repositories/fakes/FakeOriginalExamsRepository';
import CreateQuoteService from './CreateQuoteService';
import FakeQuotesRepository from '../repositories/fakes/FakeQuotesRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakePatientsRepository: FakePatientsRepository;
let fakeLabsRepository: FakeLabsRepository;
let fakePricesRepository: FakePricesRepository;
let fakeOriginalExamsRepository: FakeOriginalExamsRepository;
let fakeExamsRepository: FakeExamsRepository;
let fakeQuotesRepository: FakeQuotesRepository;
let createQuote: CreateQuoteService;

describe('CreateQuote', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePatientsRepository = new FakePatientsRepository();
    fakeLabsRepository = new FakeLabsRepository();
    fakePricesRepository = new FakePricesRepository();
    fakeOriginalExamsRepository = new FakeOriginalExamsRepository();
    fakeExamsRepository = new FakeExamsRepository();
    fakeQuotesRepository = new FakeQuotesRepository();
    createQuote = new CreateQuoteService(fakeQuotesRepository);
  });

  it('should be able to create a new quote', async () => {
    const user = await fakeUsersRepository.create({
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@example.com',
      password: 'password',
    });

    const patient = await fakePatientsRepository.create({
      user_id: user.id,
      first_name: 'Mary',
      last_name: 'Doe',
      document_id: '123456789',
      document_type: 'CPF',
      height: 1.69,
      weight: 70,
    });

    const lab = await fakeLabsRepository.create({
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

    const originalExam = await fakeOriginalExamsRepository.create({
      title: 'Test exam',
      exam_original_id: '001',
      lab_id: lab.id,
      lab_id_exam_original_id: `${lab.id}001`,
    });

    const exam = await fakeExamsRepository.create({
      title: 'Test',
      slug: 'test',
      original_exams_ids: [originalExam.id],
    });

    const price = await fakePricesRepository.create({
      exam_id: exam.id,
      price: 99.99,
      lab_id: lab.id,
      lab_id_exam_original_id: `${lab.id}`,
      original_exam_id: originalExam.id,
    });

    const quote = await createQuote.execute({
      user_id: user.id,
      patient_id: patient.id,
      patient_first_name: patient.first_name,
      patient_last_name: patient.last_name,
      price: [price],
    });

    expect(quote).toHaveProperty('id');
    expect(quote.user_id).toBe(user.id);
    expect(quote.patient_first_name).toBe('Mary');
    expect(quote.price).toContain(price);
  });
});
