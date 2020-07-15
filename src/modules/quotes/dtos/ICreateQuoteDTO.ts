import Price from '@modules/exams/infra/typeorm/entities/Price';

export default interface ICreateQuoteDTO {
  user_id: string;
  patient_id: string;
  patient_first_name: string;
  patient_last_name: string;
  price: Price[];
}
