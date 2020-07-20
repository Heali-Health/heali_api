import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';
import SendRegisteredEmailService from '@modules/users/services/SendRegisteredEmailService';

export default class UsersController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const {
        first_name,
        last_name,
        email,
        password,
        phone_whatsapp,
      } = req.body;

      const createUser = container.resolve(CreateUserService);
      const user = await createUser.execute({
        first_name,
        last_name,
        email,
        password,
        phone_whatsapp,
      });

      const sendRegisteredEmail = container.resolve(SendRegisteredEmailService);
      await sendRegisteredEmail.execute(user);

      return res.json(classToClass(user));
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
