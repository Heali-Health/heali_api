import Lab from '@modules/labs/infra/typeorm/entities/Lab';

export default interface ILabResultsDTO {
  lab: Lab;
  distance: number;
  exams_found: number;
  total_exams: number;
  total_price: number;
}
