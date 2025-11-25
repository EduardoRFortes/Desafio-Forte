import { Pool } from 'pg';


export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

pool.connect()
  .then(client => {
    console.log('Conexão PostgreSQL OK!');
    client.release();
  })
  .catch(err => {
    console.error('Erro ao conectar ao PostgreSQL:', err.message);
  });

export const query = (text: string, params?: any[]) => pool.query(text, params);