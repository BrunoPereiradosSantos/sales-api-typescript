import AppError from '@shared/errors/AppError';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';
import { ICreateSession } from '../domain/models/iCreateSession';
import { IUserAuthenticated } from '../domain/models/IUserAuthenticated';
import { inject, injectable } from 'tsyringe';

@injectable()
class CreateSessionsService {
  constructor(
    @inject('UsersRepository') private usersRepository: UsersRepository,
  ) {}
  public async execute({
    email,
    password,
  }: ICreateSession): Promise<IUserAuthenticated> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const passwordConfirmed = await compare(password, user.password);

    if (!passwordConfirmed) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const token = sign({}, process.env.SECRET_KEY as string, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    });

    return { user, token };
  }
}

export default CreateSessionsService;
