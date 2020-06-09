import { Client, Status } from '@googlemaps/google-maps-services-js';

import mapConfig from '@config/maps';
import AppError from '@shared/errors/AppError';

import ILocationDTO from '@shared/container/providers/LocationProvider/dtos/ILocationDTO';
import ILocationProvider from '../models/ILocationProvider';

export default class GMapsLocationProvider implements ILocationProvider {
  private client = new Client({});

  public async getLocationDetails(input: string): Promise<ILocationDTO> {
    const MapsResponse = await this.client.geocode({
      params: {
        key: mapConfig.config.google.key,
        address: input,
        region: 'BR',
        language: 'pt-BR',
      },
    });

    const { results, status, error_message } = MapsResponse.data;

    if (status === 'ZERO_RESULTS') {
      throw new AppError(`No result found for this request: ${error_message}`);
    } else if (
      status === 'OVER_QUERY_LIMIT' ||
      status === 'REQUEST_DENIED' ||
      status === 'UNKNOWN_ERROR'
    ) {
      throw new AppError(`Unknown error ocurred: ${error_message}`);
    } else if (status === 'INVALID_REQUEST') {
      throw new AppError(`Input is missing in the request: ${error_message}`);
    }

    const { geometry, formatted_address } = results[0];

    const { location } = geometry;

    const { lat, lng } = location;

    const response: ILocationDTO = {
      address: formatted_address,
      latitude: lat,
      longitude: lng,
    };

    return response;
  }
}
