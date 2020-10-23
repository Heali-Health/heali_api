import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AuthenticateGoogleUserService from '@modules/users/services/AuthenticateGoogleUserService';
import SendRegisteredEmailService from '@modules/users/services/SendRegisteredEmailService';

export default class GoogleSessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { googleTokenId } = req.body;

    const authenticateGoogleUserService = container.resolve(
      AuthenticateGoogleUserService,
    );

    const {
      user,
      token,
      new_user,
    } = await authenticateGoogleUserService.execute({
      googleTokenId,
    });

    if (new_user) {
      const sendRegisteredEmail = container.resolve(SendRegisteredEmailService);

      sendRegisteredEmail.execute(user);
    }

    return res.send({ user: classToClass(user), token });
  }
}
