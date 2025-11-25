

import { Router } from 'express';
import { BookController } from '../controllers/BookController';

const router = Router();
const bookController = new BookController();


router.get('/', bookController.list);

export default router;