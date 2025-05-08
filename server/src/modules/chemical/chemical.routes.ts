import { Router } from 'express';
import verifyAuth from '../../middlewares/verifyAuth';
import validateRequest from '../../middlewares/validateRequest';
import chemicalValidator from './chemical.validator';
import chemicalController from './chemical.controllers';

const chemicalRoutes = Router();

chemicalRoutes.use(verifyAuth);

chemicalRoutes.get('/total', chemicalController.getTotalChemical);
chemicalRoutes.post('/bulk-delete', chemicalController.bulkDelete);
chemicalRoutes.post('/', validateRequest(chemicalValidator.createSchema), chemicalController.create);
chemicalRoutes.get('/', chemicalController.readAll);
chemicalRoutes.patch('/:id/add', validateRequest(chemicalValidator.addStockSchema), chemicalController.addStock);
chemicalRoutes.patch('/:id', validateRequest(chemicalValidator.updateSchema), chemicalController.update);
chemicalRoutes.get('/:id', chemicalController.readSingle);
chemicalRoutes.delete('/:id', chemicalController.delete);


export default chemicalRoutes;



