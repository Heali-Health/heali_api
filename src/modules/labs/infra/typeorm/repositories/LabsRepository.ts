import { Repository, getRepository, In } from 'typeorm';
import { injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ILabsRepository, {
  IFindSameLab,
} from '@modules/labs/repositories/ILabsRepository';
import ICreateLabDTO from '@modules/labs/dtos/ICreateLabDTO';

import Lab from '@modules/labs/infra/typeorm/entities/Lab';

@injectable()
class LabsRepository implements ILabsRepository {
  private ormRepository: Repository<Lab>;

  constructor() {
    this.ormRepository = getRepository(Lab);
  }

  public async findAll(): Promise<Lab[]> {
    const labs = await this.ormRepository.find();

    return labs;
  }

  public async findAllByCompanyId(company_id: string): Promise<Lab[]> {
    const labs = await this.ormRepository.find({
      where: {
        company_id,
      },
    });

    return labs;
  }

  public async findById(lab_id: string): Promise<Lab | undefined> {
    const lab = await this.ormRepository.findOne(lab_id);

    return lab;
  }

  public async findSameLab({
    original_id,
    company_id,
  }: IFindSameLab): Promise<Lab | undefined> {
    const checkSameLab = await this.ormRepository.findOne({
      where: {
        original_id,
        company_id,
      },
    });

    return checkSameLab;
  }

  public async create(labData: ICreateLabDTO): Promise<Lab> {
    const lab = this.ormRepository.create(labData);

    await this.ormRepository.save(lab);

    return lab;
  }

  public async save(lab: Lab): Promise<Lab> {
    return this.ormRepository.save(lab);
  }

  public async saveMany(labs: Lab[]): Promise<Lab[]> {
    return this.ormRepository.save(labs);
  }

  public async upsertLabs(labsData: ICreateLabDTO[]): Promise<Lab[]> {
    const labCompanyIdOriginalId = labsData.map(
      lab => lab.company_id_original_id,
    );

    const existentLabs = await this.ormRepository.find({
      where: {
        company_id_original_id: In(labCompanyIdOriginalId),
      },
    });

    const existentLabsCompanyIdOriginalId = existentLabs.map(
      lab => lab.company_id_original_id,
    );

    const labsToAdd = labsData.filter(
      lab =>
        !existentLabsCompanyIdOriginalId.includes(lab.company_id_original_id),
    );

    const addedLabs = this.ormRepository.create(labsToAdd);

    await this.ormRepository.save(addedLabs);

    const labsToUpdate = labsData.filter(lab =>
      existentLabsCompanyIdOriginalId.includes(lab.company_id_original_id),
    );

    const updatedLabs = labsToUpdate.map(labToUpdate => {
      const existentLab = existentLabs.find(
        lab =>
          lab.company_id_original_id === labToUpdate.company_id_original_id,
      );

      if (!existentLab) {
        throw new AppError('Unknown error on trying to upsert lab');
      }

      existentLab.title = labToUpdate.title;
      existentLab.slug = labToUpdate.slug;
      existentLab.address = labToUpdate.address;
      existentLab.city = labToUpdate.city;
      existentLab.latitude = labToUpdate.latitude;
      existentLab.longitude = labToUpdate.longitude;
      existentLab.open_hour = labToUpdate.open_hour;
      existentLab.collect_hour = labToUpdate.collect_hour;

      return existentLab;
    });

    await this.ormRepository.save(updatedLabs);

    const labs = [...addedLabs, ...updatedLabs];

    return labs;
  }
}

export default LabsRepository;
