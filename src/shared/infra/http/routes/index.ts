import { Router } from 'express';
import productsRouter from '@modules/products/infra/http/routes/products.routes';
import userRouter from '@modules/users/infra/http/routes/users.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import passwordRoutes from '@modules/users/infra/http/routes/password.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';
import customerRouter from '@modules/customers/infra/http/routes/cutomer.routes';
import ordersRouter from '@modules/orders/infra/http/routes/order.routes';

const routes = Router();
routes.use('/products', productsRouter);
routes.use('/users', userRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRoutes);
routes.use('/profile', profileRouter);
routes.use('/customers', customerRouter);
routes.use('/orders', ordersRouter);

export default routes;
