import axios from 'axios';
import rateLimit from 'axios-rate-limit';
import { container } from 'tsyringe';

import ICreateLabDTO from '@modules/labs/dtos/ICreateLabDTO';
import SlugPkgSlugTransformationProvider from '../../SlugTransformationProvider/implementations/SlugPkgSlugTransformationProvider';
import ILabInfoProvider from '../models/ILabInfoProvider';
import ILabiLabInfoDTO from '../dtos/ILabiLabInfoDTO';

export default class LabiLabInfoProvider implements ILabInfoProvider {
  private api = axios;

  private http = rateLimit(axios.create(), {
    maxRequests: 1,
    perMilliseconds: 1000,
    // maxRPS: 2,
  });

  public async getLabsInfo(): Promise<ICreateLabDTO[]> {
    const labiLabsApiResponse = await this.api.get(
      'https://wp.labiexames.com.br//wp-json/api/units',
    );
    const labiLabs: ILabiLabInfoDTO[] = labiLabsApiResponse.data;

    const slugTransformation = container.resolve(
      SlugPkgSlugTransformationProvider,
    );

    const labiPromise = labiLabs.map(async labiLab => {
      const lab: ICreateLabDTO = {
        title: labiLab.title,
        slug: `labi-exames-${slugTransformation.transform(labiLab.title)}`,
        company_id: '3b20687a-beec-4e83-b875-53c5f07c0e77',
        original_id: labiLab.id.toString(),
        company_id_original_id: `3b20687a-beec-4e83-b875-53c5f07c0e77${labiLab.id.toString()}`,
        address: `${labiLab.address.r} - ${labiLab.address.b} - ${labiLab.address.cep}`,
        city: labiLab.address.city,
        latitude: labiLab.address.location.lat,
        longitude: labiLab.address.location.lng,
        collect_hour: labiLab.collect_hour,
        open_hour: labiLab.results_hour,
      };

      return lab;
    });

    const labs = await Promise.all(labiPromise);

    return labs;
  }

  public async getOriginalExamsInfo(): Promise<ICreateLabDTO[]> {}

  public async getPricesInfo(): Promise<ICreateLabDTO[]> {}
}
