import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';


const API_BASE_URL = 'http://localhost:8080';


interface Item {
    id: number;
    name?: string; 
    title?: string; 
    author?: string; 
}

export function NewLoanForm({ onLoanSuccess }: { onLoanSuccess: () => void }) {
    const [clients, setClients] = useState<Item[]>([]);
    const [availableBooks, setAvailableBooks] = useState<Item[]>([]);
    
    const [selectedClientId, setSelectedClientId] = useState<number | ''>('');
    const [selectedBookId, setSelectedBookId] = useState<number | ''>('');
    const [message, setMessage] = useState<{ type: 'success' | 'danger', text: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    
    const fetchFormData = useCallback(async () => {
        try {
            
            const clientsRes = await fetch(`${API_BASE_URL}/api/clients`);
            const clientsData = await clientsRes.json();
            
            if (Array.isArray(clientsData)) {
                setClients(clientsData);
            } else {
                console.error("API de Clientes retornou formato inválido:", clientsData);
                setClients([]); 
            }

            
            const booksRes = await fetch(`${API_BASE_URL}/api/books?available=true`);
            const booksData = await booksRes.json();
            
            if (Array.isArray(booksData)) {
                setAvailableBooks(booksData);
            } else {
                console.error("API de Livros retornou formato inválido:", booksData);
                setAvailableBooks([]);
            }

        } catch (error) {
            console.error("Erro de conexão/rede:", error);
            setMessage({ type: 'danger', text: 'Falha ao conectar com o servidor.' });
        }
    }, []);

    useEffect(() => {
        fetchFormData();
    }, [fetchFormData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setIsLoading(true);

        if (!selectedClientId || !selectedBookId) {
            setMessage({ type: 'danger', text: 'Por favor, selecione um Cliente e um Livro.' });
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/loans`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientId: selectedClientId,
                    bookId: selectedBookId,
                }),
            });

            const body = await res.json();

            if (!res.ok) {
                throw new Error(body.error || `Erro de servidor (Status: ${res.status})`);
            }

            setMessage({ type: 'success', text: `Empréstimo registrado com sucesso! (ID: ${body.id})` });
            
            setSelectedClientId('');
            setSelectedBookId('');
            fetchFormData(); 
            onLoanSuccess(); 

        } catch (error: any) {
            setMessage({ type: 'danger', text: `Erro: ${error.message || 'Erro desconhecido'}` });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '30px' }}>
            <h3>Registrar Novo Empréstimo</h3>
            
            {message && <Alert variant={message.type}>{message.text}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Cliente</Form.Label>
                            <Form.Select 
                                value={selectedClientId} 
                                onChange={(e) => setSelectedClientId(parseInt(e.target.value) || '')}
                                disabled={isLoading}
                            >
                                <option value="">Selecione um Cliente</option>
                                {/* O uso de ?.map previne erros caso clients seja null/undefined acidentalmente */}
                                {clients?.map(client => (
                                    <option key={client.id} value={client.id}>
                                        {client.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Livro Disponível</Form.Label>
                            <Form.Select 
                                value={selectedBookId} 
                                onChange={(e) => setSelectedBookId(parseInt(e.target.value) || '')}
                                disabled={isLoading}
                            >
                                <option value="">Selecione um Livro</option>
                                {availableBooks?.map(book => (
                                    <option key={book.id} value={book.id}>
                                        {book.title} ({book.author})
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                
                <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={isLoading || !selectedClientId || !selectedBookId}
                >
                    {isLoading ? 'Registrando...' : 'Registrar Empréstimo'}
                </Button>
            </Form>
        </div>
    );
}