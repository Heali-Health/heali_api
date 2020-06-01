import { uuid } from 'uuidv4';

import ICreateCompanyDTO from '@modules/labs/dtos/ICreateCompanyDTO';
import ICompaniesRepository from '@modules/labs/repositories/ICompaniesRepository';

import Company from '@modules/labs/infra/typeorm/entities/Company';

export default class FakeCompaniesRepository implements ICompaniesRepository {
  private companies: Company[] = [];

  public async create(companyData: ICreateCompanyDTO): Promise<Company> {
    const company = new Company();

    Object.assign(company, { id: uuid() }, companyData);

    this.companies.push(company);

    return company;
  }

  public async save(company: Company): Promise<Company> {
    const findIndex = this.companies.findIndex(
      findCompany => findCompany.id === company.id,
    );

    this.companies[findIndex] = company;

    return company;
  }
}
