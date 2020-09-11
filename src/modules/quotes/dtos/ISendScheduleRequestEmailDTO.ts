import Price from '@modules/exams/infra/typeorm/entities/Price';
import Patient from '@modules/users/infra/typeorm/entities/Patient';
import User from '@modules/users/infra/typeorm/entities/User';

export default interface ISendScheduleRequestEmailDTO {
  user: User;
  patient: Patient;
  prices: Price[];
}
