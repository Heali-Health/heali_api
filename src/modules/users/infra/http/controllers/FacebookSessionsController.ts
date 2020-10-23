import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AuthenticateFacebookUserService from '@modules/users/services/AuthenticateFacebookUserService';
import SendRegisteredEmailService from '@modules/users/services/SendRegisteredEmailService';

export default class GoogleSessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { facebookTokenId } = req.body;

    const authenticateFacebookUserService = container.resolve(
      AuthenticateFacebookUserService,
    );

    const {
      user,
      token,
      new_user,
    } = await authenticateFacebookUserService.execute({
      facebookTokenId,
    });

    if (new_user) {
      const sendRegisteredEmail = container.resolve(SendRegisteredEmailService);

      sendRegisteredEmail.execute(user);
    }

    return res.send({ user: classToClass(user), token });
  }
}
