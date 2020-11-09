import ICreateLabDTO from '@modules/labs/dtos/ICreateLabDTO';

import Lab from '@modules/labs/infra/typeorm/entities/Lab';

export interface IFindSameLab {
  company_id: string;
  original_id: string;
}

export interface IFindSameLabs {
  company_id: string;
  original_id: string[];
}

export default interface ILabsRepository {
  create(data: ICreateLabDTO): Promise<Lab>;
  save(lab: Lab): Promise<Lab>;
  saveMany(labs: Lab[]): Promise<Lab[]>;
  findAll(): Promise<Lab[]>;
  findAllByCompanyId(company_id: string): Promise<Lab[]>;
  findById(lab_id: string): Promise<Lab | undefined>;
  findBySlug(lab_slug: string): Promise<Lab | undefined>;
  findSameLab(labData: IFindSameLab): Promise<Lab | undefined>;
  upsertLabs(labData: ICreateLabDTO[]): Promise<Lab[]>;
}
