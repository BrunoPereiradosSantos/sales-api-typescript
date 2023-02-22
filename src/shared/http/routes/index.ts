import { Router } from 'express';
import productsRouter from '@modules/products/routes/products.routes';
import userRouter from '@modules/users/routes/users.routes';
import sessionsRouter from '@modules/users/routes/sessions.routes';
import passwordRoutes from '@modules/users/routes/password.routes';
import profileRouter from '@modules/users/routes/profile.routes';

const routes = Router();
routes.use('/products', productsRouter);
routes.use('/users', userRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRoutes);
routes.use('/profile', profileRouter);

export default routes;
