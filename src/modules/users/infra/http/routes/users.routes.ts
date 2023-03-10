import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import multer from 'multer';
import uploadConfig from '@config/upload';
import UsersControllers from '../controllers/UsersController';
import { isAuthenticated } from '@shared/infra/http/middlewares/isAuthenticated';
import UserAvatarController from '../controllers/UserAvatarController';

const userRouter = Router();
const userController = new UsersControllers();
const avatarController = new UserAvatarController();

const upload = multer(uploadConfig.multer);

userRouter.get('/', isAuthenticated, userController.index);

userRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  userController.create,
);

userRouter.patch(
  '/avatar',
  isAuthenticated,
  upload.single('avatar'),
  avatarController.update,
);

export default userRouter;
