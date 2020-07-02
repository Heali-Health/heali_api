import Lab from '@modules/labs/infra/typeorm/entities/Lab';
import Price from '../infra/typeorm/entities/Price';

export default interface ILabPricesResultsDTO {
  lab: Lab;
  prices: Price[];
  distance: number;
  exams_found: number;
  total_exams: number;
  total_price: number;
}
