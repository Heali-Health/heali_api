import ICreateOriginalExamDTO from '@modules/exams/dtos/ICreateOriginalExamDTO';
import OriginalExam from '@modules/exams/infra/typeorm/entities/OriginalExam';

export default interface IOriginalExamsRepository {
  create(examData: ICreateOriginalExamDTO): Promise<OriginalExam>;
  save(originalExam: OriginalExam): Promise<OriginalExam>;
  saveMany(originalExams: OriginalExam[]): Promise<OriginalExam[]>;
  findByIdArray(original_exams_ids: string[]): Promise<OriginalExam[]>;
  findAllByCompanyId(company_id: string): Promise<OriginalExam[]>;
  findAllByLabsIds(labIdData: string[]): Promise<OriginalExam[]>;
  findAllByTitle(title: string | string[]): Promise<OriginalExam[]>;
  findAllByUserInput(query: string): Promise<OriginalExam[]>;
  upsertOriginalExams(
    originalExamData: ICreateOriginalExamDTO[],
  ): Promise<OriginalExam[]>;
}
