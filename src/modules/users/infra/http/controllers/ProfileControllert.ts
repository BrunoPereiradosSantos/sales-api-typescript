import { Request, Response } from 'express';
import ShowProfileService from '@modules/users/services/ShowProfileService';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import { instanceToInstance } from 'class-transformer';

export default class ProfileController {
  public async showProfile(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const showProfile = new ShowProfileService();
    const userId = request.user.id;

    const user = await showProfile.execute({ userId });

    return response.json(instanceToInstance(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { name, email, password, oldPassword } = request.body;

    const userId = request.user.id;

    const updateProfile = new UpdateProfileService();

    const user = await updateProfile.execute({
      userId,
      name,
      email,
      password,
      oldPassword,
    });

    return response.json(instanceToInstance(user));
  }
}
