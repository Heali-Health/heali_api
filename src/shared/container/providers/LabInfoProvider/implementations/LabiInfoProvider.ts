import axios from 'axios';
import rateLimit from 'axios-rate-limit';

import { container } from 'tsyringe';

export default class LabiLabInfoProvider implements ILabInfoProvider {
  private api = axios;

  private http = rateLimit(axios.create(), {
    maxRequests: 1,
    perMilliseconds: 1000,
    // maxRPS: 2,
  });

  public async getLabsInfo(): Promise<ICreateLabDTO[]> {}

  public async getLabsInfo(): Promise<ICreateLabDTO[]> {}

  public async getLabsInfo(): Promise<ICreateLabDTO[]> {}
}
