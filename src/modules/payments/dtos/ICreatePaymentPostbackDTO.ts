import { IPagarmeLog } from './ICreatePaymentLogDTO';

export interface IPagarmePostbackDelivery {
  object: string;
  status: string;
  status_reason: string;
  status_code: string;
  response_time: number;
  response_headers: string;
  response_body: string;
  date_created: Date;
  date_updated: Date;
  id: string;
}

export default interface ICreatePaymentPostbackDTO {
  id: string;
  fingerprint: string;
  event: string;
  old_status: string;
  desired_status: string;
  current_status: string;
  object: string;
  transaction: IPagarmeLog;
}
