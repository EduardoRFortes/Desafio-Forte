

import { query } from './db';





const createClientsTable = `
    CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL
    );
`;

const createBooksTable = `
    CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        isbn VARCHAR(50) UNIQUE NOT NULL,
        available BOOLEAN NOT NULL DEFAULT TRUE
    );
`;

const createLoansTable = `
    CREATE TABLE IF NOT EXISTS loans (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
        book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
        loan_date TIMESTAMP NOT NULL DEFAULT NOW(),
        due_date TIMESTAMP NOT NULL,
        return_date TIMESTAMP NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'emprestado'
    );
`;





const insertClients = `
    INSERT INTO clients (name, email) VALUES 
    ('Maria Silva', 'maria@exemplo.com') ON CONFLICT (email) DO NOTHING;
    INSERT INTO clients (name, email) VALUES
    ('João Pereira', 'joao@exemplo.com') ON CONFLICT (email) DO NOTHING;
`;

const insertBooks = `
    INSERT INTO books (title, author, isbn, available) VALUES 
    ('Dom Casmurro', 'Machado de Assis', '978-8573268802', FALSE) ON CONFLICT (isbn) DO NOTHING;
    INSERT INTO books (title, author, isbn, available) VALUES 
    ('1984', 'George Orwell', '978-8535905959', TRUE) ON CONFLICT (isbn) DO NOTHING;
`;


const insertLoans = `
    INSERT INTO loans (client_id, book_id, due_date, status) VALUES 
    (1, 1, NOW() + INTERVAL '14 days', 'emprestado')
    ON CONFLICT DO NOTHING;
`;





async function seedDatabase() {
    try {
        console.log("Iniciando a criação das tabelas...");
        await query(createClientsTable);
        await query(createBooksTable);
        await query(createLoansTable);
        console.log("Tabelas criadas com sucesso.");

        console.log("Inserindo dados iniciais...");
        await query(insertClients);
        await query(insertBooks);
        await query(insertLoans);
        console.log("Dados inseridos com sucesso.");

    } catch (error) {
        console.error("Erro ao popular o banco de dados:", error);
    } finally {
        
        process.exit(); 
    }
}

seedDatabase();