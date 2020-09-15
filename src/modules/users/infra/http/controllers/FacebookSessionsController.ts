import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AuthenticateFacebookUserService from '@modules/users/services/AuthenticateFacebookUserService';

export default class GoogleSessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { facebookTokenId } = req.body;

    const authenticateFacebookUserService = container.resolve(AuthenticateFacebookUserService);

    const { user, token } = await authenticateFacebookUserService.execute({
      facebookTokenId,
    });

    return res.send({ user: classToClass(user), token });
  }
}
