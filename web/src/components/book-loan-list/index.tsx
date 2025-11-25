import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Badge, ButtonGroup } from 'react-bootstrap'; 


const API_BASE_URL = 'http://localhost:8080'; 


interface Loan {
    id: number;
    loanDate: string;
    dueDate: string;
    returnDate: string | null;
    status: 'emprestado' | 'devolvido' | 'extraviado'; 
    clientId: number;
    clientName: string;
    bookId: number;
    bookTitle: string;
    bookAuthor: string;
    fine?: number; 
}

export function BookLoanList() {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    
    const fetchLoans = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/loans`);
            if (!res.ok) throw new Error(`Erro API: ${res.status}`);
            
            const data: Loan[] = await res.json();
            if (Array.isArray(data)) {
                
                const sortedData = data.sort((a, b) => 
                    new Date(b.loanDate).getTime() - new Date(a.loanDate).getTime()
                );
                setLoans(sortedData);
                setError(null);
            }
        } catch (err: any) {
            setError(err.message || 'Erro de conexão.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLoans();
    }, [fetchLoans]);

    

    
    const handleReturn = async (loanId: number) => {
        if (!window.confirm("Confirmar devolução e calcular multa final?")) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/loans/${loanId}/return`, { method: 'PATCH' });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Erro ao devolver.");
            }
            alert("Devolução realizada com sucesso!");
            fetchLoans(); 
        } catch (err: any) { alert(err.message); }
    };

    
    const handleLost = async (loanId: number) => {
        if (!window.confirm("ATENÇÃO: Marcar este livro como EXTRAVIADO?")) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/loans/${loanId}/lost`, { method: 'PATCH' });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Erro ao registrar extravio.");
            }
            alert("Livro marcado como extraviado.");
            fetchLoans();
        } catch (err: any) { alert(err.message); }
    };

    
    const handleDelete = async (loanId: number) => {
        if (!window.confirm("Tem certeza que deseja EXCLUIR este registro permanentemente?")) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/loans/${loanId}`, { method: 'DELETE' });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Erro ao excluir.");
            }
            alert("Registro excluído.");
            fetchLoans();
        } catch (err: any) { alert(err.message); }
    };

    
    const getEstimatedFine = (dueDateStr: string, status: string, persistedFine?: number) => {
        if (status !== 'emprestado') {
            return persistedFine ? `R$ ${Number(persistedFine).toFixed(2)}` : '-';
        }

        const due = new Date(dueDateStr);
        const today = new Date();
        due.setHours(0,0,0,0);
        today.setHours(0,0,0,0);

        const diffTime = today.getTime() - due.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
            const fine = diffDays * 0.50; 
            return <span className="text-danger fw-bold">R$ {fine.toFixed(2)} (Prev.)</span>;
        }
        return <span className="text-success">R$ 0,00</span>;
    };

    
    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'emprestado': return 'primary';
            case 'devolvido': return 'success';
            case 'extraviado': return 'dark';
            default: return 'secondary';
        }
    };

    if (isLoading) return <p className="text-center mt-4">Carregando...</p>;
    if (error) return <p className="text-danger text-center mt-4">{error}</p>;

    return (
        <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Empréstimos Registrados</h3>
                <Badge bg="info">{loans.length} registros</Badge>
            </div>
            
            <Table striped bordered hover responsive className="shadow-sm">
                <thead className="bg-light">
                    <tr>
                        <th>Livro</th>
                        <th>Cliente</th>
                        <th>Vencimento</th>
                        <th>Status</th>
                        <th>Multa</th>
                        <th className="text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {loans.map(loan => (
                        <tr key={loan.id} className="align-middle">
                            <td>
                                <strong>{loan.bookTitle}</strong><br/>
                                <small className="text-muted">{loan.bookAuthor}</small>
                            </td>
                            <td>{loan.clientName}</td>
                            
                            <td style={{ 
                                color: (new Date() > new Date(loan.dueDate) && loan.status === 'emprestado') ? 'red' : 'inherit' 
                            }}>
                                {new Date(loan.dueDate).toLocaleDateString()}
                            </td>
                            
                            <td>
                                <Badge bg={getStatusBadge(loan.status)}>
                                    {loan.status.toUpperCase()}
                                </Badge>
                            </td>
                            
                            <td>
                                {getEstimatedFine(loan.dueDate, loan.status, loan.fine)}
                            </td>
                            
                            <td className="text-center">
                                <ButtonGroup size="sm">
                                    {loan.status === 'emprestado' && (
                                        <>
                                            <Button 
                                                variant="success" 
                                                title="Devolver"
                                                onClick={() => handleReturn(loan.id)}
                                                style={{ marginRight: '4px' }}
                                            >
                                                ✔
                                            </Button>
                                            <Button 
                                                variant="warning" 
                                                title="Marcar como Extraviado"
                                                onClick={() => handleLost(loan.id)}
                                                style={{ marginRight: '4px' }}
                                            >
                                                ⚠
                                            </Button>
                                        </>
                                    )}
                                    <Button 
                                        variant="danger" 
                                        title="Excluir Histórico"
                                        onClick={() => handleDelete(loan.id)}
                                    >
                                        🗑
                                    </Button>
                                </ButtonGroup>
                            </td>
                        </tr>
                    ))}
                    {loans.length === 0 && (
                        <tr>
                            <td colSpan={6} className="text-center text-muted">
                                Nenhum empréstimo encontrado.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
}