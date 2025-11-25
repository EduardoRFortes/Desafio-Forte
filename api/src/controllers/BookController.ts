

import { Request, Response } from 'express';
import { listBooks } from '../services/book.service';

export class BookController {
    /**
     * GET /api/books - Lista livros com filtro opcional por ?available=true/false
     */
    async list(req: Request, res: Response): Promise<Response> {
        let availableStatus: boolean | undefined = undefined;
        
        
        if (req.query.available !== undefined) {
            
            availableStatus = req.query.available === 'true';
        }

        try {
            const books = await listBooks(availableStatus);
            return res.status(200).json(books);
        } catch (error) {
            
            console.error('Error listing books:', error.message);
            return res.status(500).json({ error: 'Failed to retrieve books.' });
        }
    }
}