import FakeCompaniesRepository from '@modules/labs/repositories/fakes/FakeCompaniesRepository';
import FakeLabsRepository from '@modules/labs/repositories/fakes/FakeLabsRepository';
import ListLabsFromCompanyService from './ListLabsFromCompanyService';

let fakeCompaniesRepository: FakeCompaniesRepository;
let fakeLabsRepository: FakeLabsRepository;
let listLabsFromCompany: ListLabsFromCompanyService;

describe('ListLabsFromCompany', () => {
  beforeEach(() => {
    fakeCompaniesRepository = new FakeCompaniesRepository();
    fakeLabsRepository = new FakeLabsRepository();
    listLabsFromCompany = new ListLabsFromCompanyService(fakeLabsRepository);
  });

  it('should be able to list labs from a company', async () => {
    const company = await fakeCompaniesRepository.create({
      title: 'Test Company',
      logo: '',
    });

    await fakeLabsRepository.create({
      title: 'Test',
      company_id: company.id,
      original_id: '007',
      company_id_original_id: `${company.id}007`,
      address: 'Address',
      city: 'Test City',
      latitude: -22,
      longitude: -46,
      collect_hour: 'Whenever',
      open_hour: 'Always',
    });

    await fakeLabsRepository.create({
      title: 'Test2',
      company_id: company.id,
      original_id: '006',
      company_id_original_id: `${company.id}006`,
      address: 'Address',
      city: 'Test City',
      latitude: -22,
      longitude: -46,
      collect_hour: 'Whenever',
      open_hour: 'Always',
    });

    const labs = await listLabsFromCompany.execute(company.id);

    expect(labs).toHaveLength(2);
  });
});
