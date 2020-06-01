import ICreateCompanyDTO from '@modules/labs/dtos/ICreateCompanyDTO';
import Company from '@modules/labs/infra/typeorm/entities/Company';

export default interface ICompaniesRepository {
  create(companyData: ICreateCompanyDTO): Promise<Company>;
  save(company: Company): Promise<Company>;
}
