import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import orderValidator from './order.validator';
import orderControllers from './order.controllers';
import verifyAuth from '../../middlewares/verifyAuth';

const orderRoute = Router();

// Apply authentication middleware to all order routes
orderRoute.use(verifyAuth);

// Basic CRUD routes
orderRoute.post('/', validateRequest(orderValidator.createSchema), orderControllers.create);
orderRoute.get('/', orderControllers.readAll);
orderRoute.get('/:id', orderControllers.readSingle);
orderRoute.patch('/:id', validateRequest(orderValidator.updateSchema), orderControllers.update);
orderRoute.delete('/:id', orderControllers.delete);
orderRoute.post('/bulk-delete', orderControllers.bulkDelete);

// Dashboard statistics routes
orderRoute.get('/stats/total', orderControllers.getTotalOrders);
orderRoute.get('/stats/completed', orderControllers.getCompletedOrders);
orderRoute.get('/stats/pending', orderControllers.getPendingOrders);
orderRoute.get('/stats/revenue/completed', orderControllers.getCompletedRevenue);
orderRoute.get('/stats/ready', orderControllers.getReadyOrders);
orderRoute.get('/stats/summary', orderControllers.getOrderStats);
orderRoute.get('/stats/trends/monthly', orderControllers.getMonthlyOrderTrends);

export default orderRoute;