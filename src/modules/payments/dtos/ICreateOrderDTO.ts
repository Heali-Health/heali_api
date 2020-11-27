import { IPagarmeLog } from './ICreatePaymentLogDTO';

export default interface ICreateOrderDTO {
  bagId: string;
  userId: string;
  payment: IPagarmeLog;
}
