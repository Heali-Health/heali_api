import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ObjectID } from 'mongodb';
import CreateBagService from '@modules/bags/services/CreateBagService';
import ShowBagService from '@modules/bags/services/ShowBagService';
import UpdateBagService from '@modules/bags/services/UpdateBagService';

export default class BagsController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user && req.user.id;

      const { prices } = req.body;

      const createBag = container.resolve(CreateBagService);

      const bag = await createBag.execute({
        userId,
        prices,
      });

      return res.json(bag);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  public async show(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const bagId = new ObjectID(id);

      const showBag = container.resolve(ShowBagService);

      const bag = await showBag.execute(bagId);

      return res.json(bag);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user && req.user.id;
      const { id } = req.params;
      const { priceId } = req.body;

      const bagId = new ObjectID(id);

      const updateBag = container.resolve(UpdateBagService);

      const bag = await updateBag.execute({
        bagId,
        userId,
        priceId,
      });

      return res.json(bag);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
