export interface ICard {
  object: string;
  id: string;
  date_created: Date;
  date_updated: Date;
  brand: string;
  holder_name: string;
  first_digits: string;
  last_digits: string;
  country: string;
  fingerprint: string;
  valid: boolean;
  expiration_date: string;
}

export default interface ICreateUserCardDTO {
  userId: string;
  card: ICard;
}
