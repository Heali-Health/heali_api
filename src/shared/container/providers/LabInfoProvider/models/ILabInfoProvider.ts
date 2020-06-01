import ICreateLabDTO from '@modules/labs/dtos/ICreateLabDTO';
import ICreateOriginalExamDTO from '@modules/exams/dtos/ICreateOriginalExamDTO';
import ICreatePriceDTO from '@modules/exams/dtos/ICreatePriceDTO';

export default interface ILabPartnerProvider {
  getLabsInfo(): Promise<ICreateLabDTO[]>;
  getOriginalExamsInfo(): Promise<ICreateOriginalExamDTO[]>;
  getPricesInfo(): Promise<ICreatePriceDTO[]>;
}
