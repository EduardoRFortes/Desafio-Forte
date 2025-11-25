

import { 
  addDays, 
  getDay, 
  nextMonday,
  differenceInDays, 
  isAfter         
} from 'date-fns';

/**
 * Calcula a data de devolução prevista (Due Date).
 * Regras:
 * * @param loanDate - A data em que o empréstimo foi realizado.
 * @returns A data final de devolução.
 */
export function calculateDueDate(loanDate: Date): Date {
  const thirtyDaysLater = addDays(loanDate, 30);
  
  const dayOfWeek = getDay(thirtyDaysLater); 
  
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    console.log(`Data original: ${thirtyDaysLater.toISOString()} é fim de semana. Ajustando...`);
    
    return nextMonday(thirtyDaysLater);
  }
  
  return thirtyDaysLater;
}





/**
 * Calcula a multa baseada no atraso.
 * * @param dueDate Data prevista de devolução.
 * @param returnDate Data real de devolução.
 * @returns O valor total da multa em reais (number).
 */
export function calculateFine(dueDate: Date, returnDate: Date): number {
  if (!isAfter(returnDate, dueDate)) {
    return 0;
  }
  
  const daysLate = differenceInDays(returnDate, dueDate);
  
  
  const finePerDay = 0.50;
  
  return daysLate * finePerDay;
}