import { Repository, getRepository, In, Not, IsNull } from 'typeorm';
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

  public async findAllByTitle(
    title: string | string[],
  ): Promise<OriginalExam[]> {
    const isArray = (arr: any): arr is Array<string> => {
      return !!arr.length;
    };

    if (!isArray(title)) {
      const originalExams = await this.ormRepository.find({
        where: {
          title,
        },
      });

      return originalExams;
    }

    const originalExams = await this.ormRepository.find({
      where: {
        title: In(title),
      },
    });

    return originalExams;
  }

  public async findAllByUserInput(query: string): Promise<OriginalExam[]> {
    const originalExams = await this.ormRepository.find({
      where: `title ILIKE '%${query}%'`,
    });

    return originalExams;
  }

  public async findAllByExamId(exam_id: string[]): Promise<OriginalExam[]> {
    const originalExams = await this.ormRepository.find({
      where: {
        exam_id: In(exam_id),
      },
    });

    return originalExams;
  }

  public async upsertOriginalExams(
    originalExamsData: ICreateOriginalExamDTO[],
  ): Promise<OriginalExam[]> {
    const chunk = (arr: string[], size: number): string[][] =>
      Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size),
      );

    const originalExamLabIdExamOriginalIds = originalExamsData.map(
      originalExam => originalExam.lab_id_exam_original_id,
    );

    const originalExamLabIdExamOriginalIdsArrays = chunk(
      originalExamLabIdExamOriginalIds,
      5000,
    );

    const existentOriginalExamsArrayPromise = originalExamLabIdExamOriginalIdsArrays.map(
      async item => {
        const existentOriginalExams = await this.ormRepository.find({
          where: {
            lab_id_exam_original_id: In(item),
          },
        });

        return existentOriginalExams;
      },
    );

    const existentOriginalExamsArray = await Promise.all(
      existentOriginalExamsArrayPromise,
    );

    const existentOriginalExams = existentOriginalExamsArray.reduce(
      (result, current) => {
        result.push(...current);

        return result;
      },
    );

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

    await this.ormRepository.save(addedOriginalExams, {
      chunk: 1000,
    });

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

    await this.ormRepository.save(updatedOriginalExams, {
      chunk: 5000,
    });

    const originalExams = [...addedOriginalExams, ...updatedOriginalExams];

    return originalExams;
  }

  public async findAllAssociatedToExams(): Promise<OriginalExam[]> {
    return this.ormRepository.find({
      join: {
        alias: 'originalExam',
        leftJoinAndSelect: {
          exam: 'originalExam.exam',
          lab: 'originalExam.lab',
        },
      },
      where: {
        exam_id: Not(IsNull()),
      },
    });
  }
}
