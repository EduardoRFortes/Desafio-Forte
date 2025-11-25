import { Request, Response } from 'express';

import { createLoan, returnLoan, listLoans, markLoanAsLost, deleteLoan } from '../services/LoanService'; 

export class LoanController {
  
  /**
   * POST /api/loans
   */
  async create(req: Request, res: Response): Promise<Response> {
    const { clientId, bookId } = req.body;

    if (!clientId || !bookId) {
      return res.status(400).json({ error: 'clientId and bookId are required.' });
    }
    
    if (typeof clientId !== 'number' || typeof bookId !== 'number') {
        return res.status(400).json({ error: 'clientId and bookId must be numbers.' });
    }

    try {
      const newLoan = await createLoan({ clientId, bookId });
      return res.status(201).json(newLoan);
    } catch (error) {
      
      return res.status(500).json({ error: 'Failed to create loan.', details: error.message });
    }
  }

  /**
   * PATCH /api/loans/:id/return
   */
  async return(req: Request, res: Response): Promise<Response> {
    const loanId = parseInt(req.params.id);

    if (isNaN(loanId)) {
        return res.status(400).json({ error: 'Loan ID must be a valid number.' });
    }

    try {
        const result = await returnLoan(loanId);
        
        return res.status(200).json({
            message: 'Loan successfully returned.',
            loan: result.updatedLoan,
            fine: result.fine
        });
    } catch (error) {
        
        const message = error.message;
        let statusCode = 500;
        
        if (message.includes('not found')) statusCode = 404;
        else if (message.includes('already marked')) statusCode = 409;
        
        
        return res.status(statusCode).json({ error: message });
    }
  }

  /**
   * GET /api/loans
   */
  async list(req: Request, res: Response): Promise<Response> {
      try {
          const loans = await listLoans(); 
          return res.status(200).json(loans);
      } catch (error) {
          
          console.error('Error listing loans:', error.message);
          return res.status(500).json({ error: 'Failed to retrieve loans.' });
      }
  }

  

  /**
   * PATCH /api/loans/:id/lost
   */
  async markAsLost(req: Request, res: Response): Promise<Response> {
    const loanId = parseInt(req.params.id);

    if (isNaN(loanId)) {
      return res.status(400).json({ error: 'Loan ID must be a valid number.' });
    }

    try {
      const updatedLoan = await markLoanAsLost(loanId);
      return res.json({ message: 'Loan marked as lost', loan: updatedLoan });
    } catch (error) {
      
      return res.status(400).json({ error: error.message || 'Error marking as lost.' });
    }
  }

  /**
   * DELETE /api/loans/:id
   */
  async delete(req: Request, res: Response): Promise<Response> {
    const loanId = parseInt(req.params.id);

    if (isNaN(loanId)) {
      return res.status(400).json({ error: 'Loan ID must be a valid number.' });
    }

    try {
      await deleteLoan(loanId);
      return res.status(204).send(); 
    } catch (error) {
      
      return res.status(400).json({ error: error.message || 'Error deleting loan.' });
    }
  }
}