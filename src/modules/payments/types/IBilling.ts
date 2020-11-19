export interface IAddress {
  object: string;
  street: string;
  complementary: null;
  street_number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  id: number;
}

export default interface IBilling {
  address: IAddress;
  object: string;
  id: number;
  name: string;
}
