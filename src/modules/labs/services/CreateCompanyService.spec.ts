import FakeCompaniesRepository from '@modules/labs/repositories/fakes/FakeCompaniesRepository';
import FakeSlugTransformationProvider from '@shared/container/providers/SlugTransformationProvider/fakes/FakeSlugTransformation';
import CreateCompanyService from './CreateCompanyService';

let fakeCompaniesRepository: FakeCompaniesRepository;
let fakeSlugTransformationProvider: FakeSlugTransformationProvider;
let createCompany: CreateCompanyService;

describe('CreateCompany', () => {
  beforeEach(() => {
    fakeCompaniesRepository = new FakeCompaniesRepository();
    fakeSlugTransformationProvider = new FakeSlugTransformationProvider();
    createCompany = new CreateCompanyService(
      fakeCompaniesRepository,
      fakeSlugTransformationProvider,
    );
  });

  it('should be able to create a new company', async () => {
    const company = await createCompany.execute({
      title: 'Sherlock`s company',
      logo: 'logo.img',
      slug: await fakeSlugTransformationProvider.transform(
        'Sherlock`s company',
      ),
    });

    expect(company).toHaveProperty(`id`);
    expect(company.title).toBe('Sherlock`s company');
    expect(company.slug).toBe('sherlocks-company');
  });
});
