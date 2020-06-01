import { Repository, getRepository } from 'typeorm';

import ICompaniesRepository from '@modules/labs/repositories/ICompaniesRepository';
import ICreateCompanyDTO from '@modules/labs/dtos/ICreateCompanyDTO';

import Company from '@modules/labs/infra/typeorm/entities/Company';

class CompaniesRepository implements ICompaniesRepository {
  private ormRepository: Repository<Company>;

  constructor() {
    this.ormRepository = getRepository(Company);
  }

  public async create(companyData: ICreateCompanyDTO): Promise<Company> {
    const company = this.ormRepository.create(companyData);

    await this.ormRepository.save(company);

    return company;
  }

  public async save(company: Company): Promise<Company> {
    return this.ormRepository.save(company);
  }
}

export default CompaniesRepository;
