

import { query } from '../database/db';

interface Book {
    id: number;
    title: string;
    author: string;
    available: boolean;
    
}

/**
 * Lista livros, com opção de filtrar por disponibilidade.
 * @param availableStatus Se for true, lista apenas disponíveis. Se false, lista indisponíveis. Se undefined, lista todos.
 */
export async function listBooks(availableStatus?: boolean): Promise<Book[]> {
    let sql = 'SELECT id, title, author, available FROM books';
    const params = [];

    if (availableStatus !== undefined) {
        
        sql += ' WHERE available = $1';
        params.push(availableStatus);
    }
    
    sql += ' ORDER BY title ASC';

    const result = await query(sql, params);
    return result.rows as Book[];
}





interface Client {
    id: number;
    name: string;
    
}

/**
 * Lista todos os clientes.
 */
export async function listClients(): Promise<Client[]> {
    const sql = 'SELECT id, name FROM clients ORDER BY name ASC';
    const result = await query(sql);
    return result.rows as Client[];
}