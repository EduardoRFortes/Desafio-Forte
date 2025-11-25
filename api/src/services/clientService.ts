import { query } from '../database/db'; 
import { NewClient, Client } from '../models/Client'; 


export async function createClient({ name, email }: NewClient) {
  const existing = await query('SELECT id FROM clients WHERE email = $1', [email]);
  
  if (existing.rows.length > 0) {
    throw new Error('Client with this email already exists.'); 
  }

  const result = await query(
    'INSERT INTO clients (name, email) VALUES ($1, $2) RETURNING id, name, email',
    [name, email]
  );
  
  return result.rows[0] as Client;
}


export async function listClients(): Promise<Client[]> {
  try {
      console.log("Service: Buscando clientes no banco...");
      
      
      const text = 'SELECT id, name, email FROM clients ORDER BY name ASC';
      const result = await query(text);

      console.log(`Service: Encontrados ${result.rows.length} clientes.`);
      return result.rows as Client[];
      
  } catch (error) {
      console.error("ERRO SQL (listClients):", error);
      throw error; 
  }
}