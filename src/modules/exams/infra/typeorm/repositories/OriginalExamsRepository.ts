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

  public async findAllByUserInput(query: string): Promise<OriginalExam[]> {
    const originalExams = await this.ormRepository.find({
      where: `title ILIKE '%${query}%'`,
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

    // const originalExamsPromise = originalExamsData.map(async originalExam => {
    //   const originalExamExists = await this.ormRepository.findOne({
    //     where: {
    //       lab_id_exam_original_id: originalExam.lab_id_exam_original_id,
    //     },
    //   });

    //   if (originalExamExists) {
    //     originalExamExists.title = originalExam.title;

    //     return originalExamExists;
    //   }
    //   const addedOriginalExam = this.ormRepository.create(originalExam);

    //   return addedOriginalExam;
    // });

    // const originalExams = await Promise.all(originalExamsPromise);

    // await this.ormRepository.save(originalExams, {
    //   chunk: 5000,
    // });

    // return originalExams;

    // const teste = originalExamsData.map(exam => {
    //   exam.exam_original_id,
    //   exam.lab_id,
    //   exam.lab_id_exam_original_id,
    //   exam.title,
    // })

    // const originalExams = await this.ormRepository
    //   .createQueryBuilder()
    //   .insert()
    //   .into(OriginalExam)
    //   .values(originalExamsData)
    //   .orUpdate({
    //     conflict_target: ['lab_id_exam_original_id'],
    //     overwrite: ['title', 'lab_id', 'exam_original_id'],
    //   })
    //   .execute();

    // const originalExamsIds = originalExams.identifiers;

    // const originalExamsReturn = await this.ormRepository.findByIds(
    //   originalExamsIds,
    // );

    // return originalExamsReturn;
  }
}
