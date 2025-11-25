import { pool, query } from '../database/db'; 
import { calculateDueDate, calculateFine } from './DateService'; 
import { NewLoan, Loan, LoanStatus } from '../models/Loan'; 

interface LoanListing {
    id: number;
    loanDate: Date;
    dueDate: Date;
    returnDate: Date | null;
    status: string;
    clientId: number;
    clientName: string; 
    bookId: number;
    bookTitle: string; 
    bookAuthor: string; 
}




export async function createLoan(newLoan: NewLoan): Promise<Loan> {
    const { clientId, bookId } = newLoan;
    const client = await pool.connect(); 

    try {
        await client.query('BEGIN'); 

        const bookResult = await client.query('SELECT available FROM books WHERE id = $1', [bookId]);

        if (bookResult.rows.length === 0) throw new Error('Livro não encontrado.');
        if (bookResult.rows[0].available === false) throw new Error('Livro indisponível para empréstimo.'); 

        const loanDate = new Date();
        const dueDate = calculateDueDate(loanDate); 
        const status: LoanStatus = 'emprestado';

        const insertLoanQuery = `
            INSERT INTO loans (client_id, book_id, loan_date, due_date, status) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id, client_id AS "clientId", book_id AS "bookId", loan_date AS "loanDate", due_date AS "dueDate", return_date AS "returnDate", status
        `;
        const insertResult = await client.query(insertLoanQuery, [clientId, bookId, loanDate, dueDate, status]);
        const createdLoan = insertResult.rows[0] as Loan;

        
        await client.query('UPDATE books SET available = FALSE WHERE id = $1', [bookId]);

        await client.query('COMMIT'); 
        return createdLoan;
        
    } catch (error) {
        await client.query('ROLLBACK'); 
        throw error;
    } finally {
        client.release(); 
    }
}




export async function listLoans(): Promise<LoanListing[]> {
    const result = await query(
        `SELECT
            l.id,
            l.loan_date AS "loanDate",
            l.due_date AS "dueDate",
            l.return_date AS "returnDate",
            l.status,
            c.id AS "clientId",
            c.name AS "clientName",
            b.id AS "bookId",
            b.title AS "bookTitle",
            b.author AS "bookAuthor"
        FROM loans l
        JOIN clients c ON l.client_id = c.id
        JOIN books b ON l.book_id = b.id
        ORDER BY l.loan_date DESC`
    );
    return result.rows as LoanListing[];
}




export async function returnLoan(loanId: number) {
    const client = await pool.connect(); 
    
    try {
        await client.query('BEGIN'); 

        const existingLoanResult = await client.query(
            'SELECT id, due_date AS "dueDate", status, book_id AS "bookId" FROM loans WHERE id = $1',
            [loanId]
        );

        if (existingLoanResult.rows.length === 0) throw new Error('Empréstimo não encontrado.');
        const existingLoan = existingLoanResult.rows[0];
        
        if (existingLoan.status !== 'emprestado') throw new Error(`Empréstimo já marcado como ${existingLoan.status}.`);
        
        const dueDate = new Date(existingLoan.dueDate);
        const returnDate = new Date(); 
        const fineAmount = calculateFine(dueDate, returnDate);
        
        const updateLoanQuery = `
            UPDATE loans 
            SET return_date = $1, status = 'devolvido' 
            WHERE id = $2 
            RETURNING id, client_id AS "clientId", book_id AS "bookId", loan_date AS "loanDate", due_date AS "dueDate", return_date AS "returnDate", status
        `;
        const updateResult = await client.query(updateLoanQuery, [returnDate, loanId]);

        
        await client.query('UPDATE books SET available = TRUE WHERE id = $1', [existingLoan.bookId]);

        await client.query('COMMIT'); 
        
        return {
            updatedLoan: updateResult.rows[0] as Loan,
            fine: fineAmount
        };
        
    } catch (error) {
        await client.query('ROLLBACK'); 
        throw error;
    } finally {
        client.release(); 
    }
}




export async function markLoanAsLost(loanId: number) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        
        const checkQuery = 'SELECT id, status FROM loans WHERE id = $1';
        const checkResult = await client.query(checkQuery, [loanId]);

        if (checkResult.rows.length === 0) throw new Error('Empréstimo não encontrado.');
        const loan = checkResult.rows[0];

        
        if (loan.status === 'devolvido') throw new Error('Não é possível marcar como extraviado um livro já devolvido.');

        const updateQuery = `
            UPDATE loans 
            SET status = 'extraviado', return_date = NOW()
            WHERE id = $1
            RETURNING *
        `;
        const result = await client.query(updateQuery, [loanId]);

        await client.query('COMMIT');
        return result.rows[0];

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}




export async function deleteLoan(loanId: number) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const checkQuery = 'SELECT id, status, book_id AS "bookId" FROM loans WHERE id = $1';
        const checkResult = await client.query(checkQuery, [loanId]);

        if (checkResult.rows.length === 0) throw new Error('Empréstimo não encontrado.');
        const loan = checkResult.rows[0];

        if (loan.status === 'emprestado') {
            await client.query('UPDATE books SET available = TRUE WHERE id = $1', [loan.bookId]);
        }

        await client.query('DELETE FROM loans WHERE id = $1', [loanId]);

        await client.query('COMMIT');
        return true;

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}