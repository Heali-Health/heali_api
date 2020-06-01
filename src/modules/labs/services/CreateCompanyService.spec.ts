import FakeCompaniesRepository from '@modules/labs/repositories/fakes/FakeCompaniesRepository';
import CreateCompanyService from './CreateCompanyService';

let fakeCompaniesRepository: FakeCompaniesRepository;
let createCompany: CreateCompanyService;

describe('CreateCompany', () => {
  beforeEach(() => {
    fakeCompaniesRepository = new FakeCompaniesRepository();
    createCompany = new CreateCompanyService(fakeCompaniesRepository);
  });

  it('should be able to create a new company', async () => {
    const company = await createCompany.execute({
      title: 'Sherlock`s company',
      logo: 'logo.img',
    });

    expect(company).toHaveProperty(`id`);
    expect(company.title).toBe('Sherlock`s company');
  });
});
