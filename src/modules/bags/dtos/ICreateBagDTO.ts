import Price from '@modules/exams/infra/typeorm/entities/Price';
import User from '@modules/users/infra/typeorm/entities/User';

export default interface ICreateBagDTO {
  user?: User;
  prices?: Price[];
}
