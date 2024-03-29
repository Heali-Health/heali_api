import FakeCompaniesRepository from '@modules/labs/repositories/fakes/FakeCompaniesRepository';
import FakeLabsRepository from '@modules/labs/repositories/fakes/FakeLabsRepository';
import FakeOriginalExamsRepository from '@modules/exams/repositories/fakes/FakeOriginalExamsRepository';
import ListOriginalExamsFromLabsService from './ListOriginalExamsFromLabsService';

let fakeCompaniesRepository: FakeCompaniesRepository;
let fakeLabsRepository: FakeLabsRepository;
let fakeOriginalExamsRepository: FakeOriginalExamsRepository;
let listOriginalExamsFromLabs: ListOriginalExamsFromLabsService;

describe('ListOriginalExamsFromLabs', () => {
  beforeEach(() => {
    fakeCompaniesRepository = new FakeCompaniesRepository();
    fakeLabsRepository = new FakeLabsRepository();
    fakeOriginalExamsRepository = new FakeOriginalExamsRepository();
    listOriginalExamsFromLabs = new ListOriginalExamsFromLabsService(
      fakeOriginalExamsRepository,
    );
  });

  it('should be able to list all the original exams linked to a company', async () => {
    const company1 = await fakeCompaniesRepository.create({
      title: 'Right Company',
      logo: '',
      slug: 'right-company',
    });

    const company2 = await fakeCompaniesRepository.create({
      title: 'Wrong Company',
      logo: '',
      slug: 'wrong-company',
    });

    const lab1 = await fakeLabsRepository.create({
      title: 'Right Test1',
      slug: 'right-test1',
      company_id: company1.id,
      original_id: '007',
      company_id_original_id: `${company1.id}007`,
      address: 'Address',
      city: 'Test City',
      latitude: -22,
      longitude: -46,
      collect_hour: 'Whenever',
      open_hour: 'Always',
    });

    const lab2 = await fakeLabsRepository.create({
      title: 'Right Test2',
      slug: 'right-test2',
      company_id: company1.id,
      original_id: '006',
      company_id_original_id: `${company1.id}006`,
      address: 'Address',
      city: 'Test City',
      latitude: -22,
      longitude: -46,
      collect_hour: 'Whenever',
      open_hour: 'Always',
    });

    const lab3 = await fakeLabsRepository.create({
      title: 'Wrong Test1',
      slug: 'wrong-test1',
      company_id: company2.id,
      original_id: '007',
      company_id_original_id: `${company2.id}007`,
      address: 'Address',
      city: 'Test City',
      latitude: -22,
      longitude: -46,
      collect_hour: 'Whenever',
      open_hour: 'Always',
    });

    const lab4 = await fakeLabsRepository.create({
      title: 'Wrong Test2',
      slug: 'wrong-test2',
      company_id: company2.id,
      original_id: '006',
      company_id_original_id: `${company2.id}006`,
      address: 'Address',
      city: 'Test City',
      latitude: -22,
      longitude: -46,
      collect_hour: 'Whenever',
      open_hour: 'Always',
    });

    const originalExam1 = await fakeOriginalExamsRepository.create({
      title: 'Hemograma',
      exam_original_id: '007',
      lab_id: lab1.id,
      lab_id_exam_original_id: `${lab1.id}007`,
    });

    const originalExam2 = await fakeOriginalExamsRepository.create({
      title: 'Glicose',
      exam_original_id: '006',
      lab_id: lab2.id,
      lab_id_exam_original_id: `${lab2.id}007`,
    });

    await fakeOriginalExamsRepository.create({
      title: 'Colesterol Total e Frações',
      exam_original_id: '004',
      lab_id: lab3.id,
      lab_id_exam_original_id: `${lab3.id}007`,
    });

    await fakeOriginalExamsRepository.create({
      title: 'Contagem de hemáceas',
      exam_original_id: '003',
      lab_id: lab4.id,
      lab_id_exam_original_id: `${lab4.id}007`,
    });

    const rightCompanyOriginalExams = await listOriginalExamsFromLabs.execute([
      lab1.id,
      lab2.id,
    ]);

    expect(rightCompanyOriginalExams).toEqual([originalExam1, originalExam2]);
  });
});
