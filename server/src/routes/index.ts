import { Router } from 'express';
import userRoutes from '../modules/user/user.routes';
import productRoute from '../modules/product/product.routes';
import saleRoutes from '../modules/sale/sale.routes';
import purchaseRoutes from '../modules/purchase/purchase.routes';
import chemicalRoutes from '../modules/chemical/chemical.routes';
import orderRoute from '../modules/order/order.routes';

const rootRouter = Router();

rootRouter.use('/orders', orderRoute);
rootRouter.use('/chemicals', chemicalRoutes);
rootRouter.use('/users', userRoutes);
rootRouter.use('/products', productRoute);
rootRouter.use('/sales', saleRoutes);
rootRouter.use('/purchases', purchaseRoutes);

export default rootRouter;
