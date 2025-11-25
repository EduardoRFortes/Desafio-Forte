

import { Router } from 'express';
import { ClientController } from '../controllers/ClientController';

const router = Router();
const clientController = new ClientController();


router.post('/', clientController.create); 


router.get('/', clientController.list); 

export default router;