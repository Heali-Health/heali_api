export interface IOrderItem {
  id: string;
  title: string;
  unit_price: number;
  quantity: number;
  tangible: boolean;
  category?: string;
  venue?: string;
  date?: string;
}

export interface IOrderPayment {
  id: string;
  amount: number;
  items: IOrderItem[];
}

export default interface ICreateOrderDTO {
  userId: string;
  payment: IOrderPayment;
}
