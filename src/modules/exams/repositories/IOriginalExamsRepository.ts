import ICreateOriginalExamDTO from '@modules/exams/dtos/ICreateOriginalExamDTO';
import OriginalExam from '@modules/exams/infra/typeorm/entities/OriginalExam';

export default interface IOriginalExamsRepository {
  create(examData: ICreateOriginalExamDTO): Promise<OriginalExam>;
  findAllByCompanyId(company_id: string): Promise<OriginalExam[]>;
  findAllByLabsIds(labIdData: string[]): Promise<OriginalExam[]>;
  upsertOriginalExams(
    originalExamData: ICreateOriginalExamDTO[],
  ): Promise<OriginalExam[]>;
}
