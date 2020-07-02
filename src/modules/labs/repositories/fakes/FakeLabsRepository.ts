import { uuid } from 'uuidv4';

import ICreateLabDTO from '@modules/labs/dtos/ICreateLabDTO';
import ILabsRepository, {
  IFindSameLab,
} from '@modules/labs/repositories/ILabsRepository';

import Lab from '@modules/labs/infra/typeorm/entities/Lab';

export default class FakeLabsRepository implements ILabsRepository {
  private labs: Lab[] = [];

  public async create(labData: ICreateLabDTO): Promise<Lab> {
    const lab = new Lab();

    Object.assign(lab, { id: uuid() }, labData);

    this.labs.push(lab);

    return lab;
  }

  public async save(lab: Lab): Promise<Lab> {
    const findIndex = this.labs.findIndex(findLab => findLab.id === lab.id);

    this.labs[findIndex] = lab;

    return lab;
  }

  public async saveMany(labs: Lab[]): Promise<Lab[]> {
    const savedLabs = labs.map(lab => {
      const findIndex = this.labs.findIndex(findLab => findLab.id === lab.id);

      this.labs[findIndex] = lab;

      return lab;
    });

    return savedLabs;
  }

  public async findAll(): Promise<Lab[]> {
    return this.labs;
  }

  public async findAllByCompanyId(company_id: string): Promise<Lab[]> {
    const labs = this.labs.filter(lab => lab.company_id === company_id);

    return labs;
  }

  public async findById(lab_id: string): Promise<Lab | undefined> {
    const lab = this.labs.find(eachLab => eachLab.id === lab_id);

    return lab;
  }

  public async findSameLab({
    original_id,
    company_id,
  }: IFindSameLab): Promise<Lab | undefined> {
    const checkSameLab = this.labs.find(
      lab => lab.original_id === original_id && lab.company_id === company_id,
    );

    return checkSameLab;
  }

  public async upsertLabs(labData: ICreateLabDTO[]): Promise<Lab[]> {
    const upsertedLabs = labData.map(labToUpsert => {
      const existentLab = this.labs.find(
        lab =>
          lab.company_id_original_id === labToUpsert.company_id_original_id,
      );

      if (existentLab) {
        existentLab.title = labToUpsert.title;
        existentLab.address = labToUpsert.address;
        existentLab.city = labToUpsert.city;
        existentLab.latitude = labToUpsert.latitude;
        existentLab.longitude = labToUpsert.longitude;
        existentLab.open_hour = labToUpsert.open_hour;
        existentLab.collect_hour = labToUpsert.collect_hour;

        const findIndex = this.labs.findIndex(
          findLab => findLab.id === existentLab.id,
        );

        this.labs[findIndex] = existentLab;

        return existentLab;
      }

      const newLab = new Lab();

      Object.assign(newLab, { id: uuid() }, labToUpsert);

      this.labs.push(newLab);

      return newLab;
    });

    return upsertedLabs;
  }
}
