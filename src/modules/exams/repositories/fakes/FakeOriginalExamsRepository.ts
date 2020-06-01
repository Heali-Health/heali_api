import { uuid } from 'uuidv4';
import { container } from 'tsyringe';

import OriginalExam from '@modules/exams/infra/typeorm/entities/OriginalExam';
import IOriginalExamsRepository from '@modules/exams/repositories/IOriginalExamsRepository';
import ICreateOriginalExamDTO from '@modules/exams/dtos/ICreateOriginalExamDTO';

import ListLabsFromCompanyService from '@modules/labs/services/ListLabsFromCompanyService';

export default class FakeOriginalExamsRepository
  implements IOriginalExamsRepository {
  private originalExams: OriginalExam[] = [];

  public async create(examData: ICreateOriginalExamDTO): Promise<OriginalExam> {
    const originalExam = new OriginalExam();

    Object.assign(originalExam, { id: uuid() }, examData);

    this.originalExams.push(originalExam);

    return originalExam;
  }

  public async findAllByCompanyId(company_id: string): Promise<OriginalExam[]> {
    const listLabsFromCompany = container.resolve(ListLabsFromCompanyService);
    const companylabs = await listLabsFromCompany.execute(company_id);
    const companylabsIds = companylabs.map(companyLab => companyLab.id);

    const originalExams = this.originalExams.filter(originalExam =>
      companylabsIds.includes(originalExam.lab_id),
    );

    return originalExams;
  }

  public async upsertOriginalExams(
    originalExamData: ICreateOriginalExamDTO[],
  ): Promise<OriginalExam[]> {
    const upsertedOriginalExams = originalExamData.map(originalExamToUpsert => {
      const existentOriginalExam = this.originalExams.find(
        originalExam =>
          originalExam.lab_id_exam_original_id ===
          originalExamToUpsert.lab_id_exam_original_id,
      );

      if (existentOriginalExam) {
        existentOriginalExam.title = originalExamToUpsert.title;
        existentOriginalExam.exam_original_id =
          originalExamToUpsert.exam_original_id;
        existentOriginalExam.lab_id = originalExamToUpsert.lab_id;

        const findIndex = this.originalExams.findIndex(
          findOriginalExam => findOriginalExam.id === existentOriginalExam.id,
        );

        this.originalExams[findIndex] = existentOriginalExam;

        return existentOriginalExam;
      }

      const newOriginalExam = new OriginalExam();

      Object.assign(newOriginalExam, { id: uuid() }, originalExamToUpsert);

      this.originalExams.push(newOriginalExam);

      return newOriginalExam;
    });

    return upsertedOriginalExams;
  }
}
