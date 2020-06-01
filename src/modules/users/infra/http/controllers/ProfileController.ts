import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';
import { container } from 'tsyringe';

import ShowProfileService from '@modules/users/services/ShowProfileService';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';

export default class ProfileController {
  public async show(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;

    const showProfile = container.resolve(ShowProfileService);

    const user = await showProfile.execute({ user_id });

    return res.json(classToClass(user));
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const user_id = req.user.id;

      const {
        first_name,
        last_name,
        email,
        phone_whatsapp,
        password,
        old_password,
      } = req.body;

      const updateProfile = container.resolve(UpdateProfileService);
      const user = await updateProfile.execute({
        user_id,
        first_name,
        last_name,
        email,
        phone_whatsapp,
        password,
        old_password,
      });

      // por questões de segurança, após a criação do usuário, deletar a senha dos dados trafegados

      return res.json(classToClass(user));
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
