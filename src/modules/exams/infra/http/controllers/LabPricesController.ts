import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ListSelectedLatestPricesFromLabService from '@modules/exams/services/ListSelectedLatestPricesFromLabService';
import { isUuid } from 'uuidv4';

interface IQueryType {
  ids?: string | string[];
  eSlg?: string | string[];
  add?: string;
  lat?: string;
  lng?: string;
}

export default class LabPricesController {
  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const { ids, add, lat, lng, eSlg } = req.query as IQueryType;
      const { lab } = req.params;

      if (!ids && !eSlg) {
        throw new AppError('No exam info was provided');
      }

      if (!add) {
        throw new AppError('Address was not informed');
      }

      if (!lat || !lng) {
        throw new AppError('Coordinates were not informed');
      }

      const checkIfIsId = isUuid(lab);

      let labId: string | undefined;
      let labSlug: string | undefined;

      if (checkIfIsId) {
        labId = lab;
      } else {
        labSlug = lab;
      }

      const searchPrices = container.resolve(
        ListSelectedLatestPricesFromLabService,
      );

      const priceResults = await searchPrices.execute({
        examIds: ids,
        examSlugs: eSlg,
        labId,
        labSlug,
        location: {
          address: add,
          latitude: Number(lat.toString()),
          longitude: Number(lng.toString()),
        },
      });

      return res.json(priceResults);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
