import { Repository, getRepository, In } from 'typeorm';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IOriginalExamsRepository from '@modules/exams/repositories/IOriginalExamsRepository';
import ICreateOriginalExamDTO from '@modules/exams/dtos/ICreateOriginalExamDTO';

import OriginalExam from '@modules/exams/infra/typeorm/entities/OriginalExam';

import ListLabsFromCompanyService from '@modules/labs/services/ListLabsFromCompanyService';

export default class OriginalExamsRepository
  implements IOriginalExamsRepository {
  private ormRepository: Repository<OriginalExam>;

  constructor() {
    this.ormRepository = getRepository(OriginalExam);
  }

  public async create(examData: ICreateOriginalExamDTO): Promise<OriginalExam> {
    const originalExam = this.ormRepository.create(examData);

    await this.ormRepository.save(originalExam);

    return originalExam;
  }

  public async save(originalExam: OriginalExam): Promise<OriginalExam> {
    return this.ormRepository.save(originalExam);
  }

  public async saveMany(
    originalExams: OriginalExam[],
  ): Promise<OriginalExam[]> {
    return this.ormRepository.save(originalExams);
  }

  public async findByIdArray(
    original_exams_ids: string[],
  ): Promise<OriginalExam[]> {
    const originalExams = await this.ormRepository.findByIds(
      original_exams_ids,
    );

    return originalExams;
  }

  public async findAllByCompanyId(company_id: string): Promise<OriginalExam[]> {
    const listLabsFromCompany = container.resolve(ListLabsFromCompanyService);
    const companylabs = await listLabsFromCompany.execute(company_id);
    const companylabsIds = companylabs.map(companyLab => companyLab.id);

    const originalExams = await this.ormRepository.find({
      where: {
        lab_id: In(companylabsIds),
      },
    });

    return originalExams;
  }

  public async findAllByLabsIds(labIdData: string[]): Promise<OriginalExam[]> {
    const originalExams = await this.ormRepository.find({
      where: {
        lab_id: In(labIdData),
      },
    });

    return originalExams;
  }

  public async upsertOriginalExams(
    originalExamsData: ICreateOriginalExamDTO[],
  ): Promise<OriginalExam[]> {
    const originalExamLabIdExamOriginalIds = originalExamsData.map(
      originalExam => originalExam.lab_id_exam_original_id,
    );

    const existentOriginalExams = await this.ormRepository.find({
      where: {
        lab_id_exam_original_id: In(originalExamLabIdExamOriginalIds),
      },
    });

    const existentOriginalExamsLabIdExamOriginalIds = existentOriginalExams.map(
      originalExam => originalExam.lab_id_exam_original_id,
    );

    const originalExamsToAdd = originalExamsData.filter(
      originalExam =>
        !existentOriginalExamsLabIdExamOriginalIds.includes(
          originalExam.lab_id_exam_original_id,
        ),
    );

    const addedOriginalExams = this.ormRepository.create(originalExamsToAdd);

    await this.ormRepository.save(addedOriginalExams);

    const originalExamsToUpdate = originalExamsData.filter(originalExam =>
      existentOriginalExamsLabIdExamOriginalIds.includes(
        originalExam.lab_id_exam_original_id,
      ),
    );

    const updatedOriginalExams = originalExamsToUpdate.map(
      originalExamToUpdate => {
        const existentOriginalExam = existentOriginalExams.find(
          originalExam =>
            originalExam.lab_id_exam_original_id ===
            originalExamToUpdate.lab_id_exam_original_id,
        );

        if (!existentOriginalExam) {
          throw new AppError('Unknown error on trying to upsert lab');
        }

        existentOriginalExam.title = originalExamToUpdate.title;

        return existentOriginalExam;
      },
    );

    await this.ormRepository.save(updatedOriginalExams);

    const labs = [...addedOriginalExams, ...updatedOriginalExams];

    return labs;
  }
}
