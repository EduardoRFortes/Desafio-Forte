import { Request, Response } from 'express';

import { createClient, listClients } from '../services/clientService'; 

export class ClientController {
  
  
  async create(req: Request, res: Response): Promise<Response> {
    
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    try {
      const newClient = await createClient({ name, email });
      return res.status(201).json(newClient); 
    } catch (error: any) {
      console.error("Erro Create Client:", error);
      const statusCode = error.message.includes('exists') ? 409 : 500;
      return res.status(statusCode).json({ error: error.message });
    }
  }
  
  
  async list(req: Request, res: Response): Promise<Response> {
    try {
        const clients = await listClients();
        return res.status(200).json(clients);
    } catch (error: any) {
        console.error("Erro List Clients:", error);
        return res.status(500).json({ 
            error: 'Failed to retrieve clients.',
            details: error.message 
        });
    }
  }
}