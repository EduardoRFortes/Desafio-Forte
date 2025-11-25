

export type LoanStatus = 'emprestado' | 'devolvido' | 'extraviado';


export interface NewLoan {
  clientId: number;
  bookId: number;
}


export interface Loan {
  id: number;
  clientId: number;
  bookId: number;
  loanDate: Date;      
  dueDate: Date;       
  returnDate: Date | null; 
  status: LoanStatus;
}