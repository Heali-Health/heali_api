import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AuthenticateGoogleUserService from '@modules/users/services/AuthenticateGoogleUserService';

export default class GoogleSessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { googleTokenId } = req.body;

    const authenticateGoogleUserService = container.resolve(AuthenticateGoogleUserService);

    const { user, token } = await authenticateGoogleUserService.execute({
      googleTokenId,
    });

    return res.send({ user: classToClass(user), token });
  }
}
