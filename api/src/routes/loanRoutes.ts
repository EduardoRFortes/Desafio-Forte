import { Router } from 'express';
import { LoanController } from '../controllers/LoanController';

const router = Router();
const loanController = new LoanController();


router.get('/', loanController.list);


router.post('/', loanController.create); 


router.patch('/:id/return', loanController.return);


router.patch('/:id/lost', loanController.markAsLost);


router.delete('/:id', loanController.delete);

export default router;