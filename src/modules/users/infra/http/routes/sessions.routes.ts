import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import SessionsControler from '../controllers/SessionsController';

const sessionsRouter = Router();
const sessionsController = new SessionsControler();

sessionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  sessionsController.create,
);

export default sessionsRouter;
