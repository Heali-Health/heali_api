import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakePatientsRepository from '@modules/users/repositories/fakes/FakePatientsRepository';
import FakeExamsRepository from '@modules/exams/repositories/fakes/FakeExamsRepository';
import FakePricesRepository from '@modules/exams/repositories/fakes/FakePricesRepository';
import FakeLabsRepository from '@modules/labs/repositories/fakes/FakeLabsRepository';
import FakeOriginalExamsRepository from '@modules/exams/repositories/fakes/FakeOriginalExamsRepository';
import FakeQuotesRepository from '../repositories/fakes/FakeQuotesRepository';
import UpdateQuoteService from './UpdateQuoteStatusService';

let fakeUsersRepository: FakeUsersRepository;
let fakePatientsRepository: FakePatientsRepository;
let fakeLabsRepository: FakeLabsRepository;
let fakePricesRepository: FakePricesRepository;
let fakeOriginalExamsRepository: FakeOriginalExamsRepository;
let fakeExamsRepository: FakeExamsRepository;
let fakeQuotesRepository: FakeQuotesRepository;
let updateQuote: UpdateQuoteService;

describe('UpdateQuote', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePatientsRepository = new FakePatientsRepository();
    fakeLabsRepository = new FakeLabsRepository();
    fakePricesRepository = new FakePricesRepository();
    fakeOriginalExamsRepository = new FakeOriginalExamsRepository();
    fakeExamsRepository = new FakeExamsRepository();
    fakeQuotesRepository = new FakeQuotesRepository();
    updateQuote = new UpdateQuoteService(fakeQuotesRepository);
  });

  it('should be able to update an existent quote', async () => {
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

    const quote = await fakeQuotesRepository.create({
      user,
      patient,
      price: [price],
      dates: {
        from: '23/10/2020',
        to: '26/10/2020',
      },
      hours: ['das 9h às 12h', 'das 15h às 18h'],
    });

    await updateQuote.execute({
      quoteId: quote.id.toString(),
      newStatus: 'paid',
      paymentTrialId: 123,
    });

    expect(quote).toHaveProperty('id');
    expect(quote.user.id).toBe(user.id);
    expect(quote.patient.first_name).toBe('Mary');
    expect(quote.price).toContain(price);
    expect(quote.dates).toEqual({
      from: '23/10/2020',
      to: '26/10/2020',
    });
    expect(quote.hours).toEqual(['das 9h às 12h', 'das 15h às 18h']);
    expect(quote.status).toEqual('paid');
  });
});
