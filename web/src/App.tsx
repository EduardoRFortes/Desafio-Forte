import React, { useState } from 'react';
import { Navbar, Container } from 'react-bootstrap';


import { BookLoanList } from './components/book-loan-list';

import { NewLoanForm } from './components/NewLoanForm';

function App() {
  
  
  const [reloadKey, setReloadKey] = useState(0);

  
  const handleDataReload = () => {
    setReloadKey(prevKey => prevKey + 1);
  };

  return (
    <>
      {/* --- MENU / NAVBAR --- */}
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Forte Security Demo</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <div className="d-flex align-items-center">Links de Navegação Aqui</div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        
        {/* --- FORMULÁRIO DE NOVO EMPRÉSTIMO --- */}
        {/* Passamos a função handleDataReload para ser chamada após o sucesso */}
        <h4 className="mb-3">Registrar Novo Empréstimo</h4>
        <NewLoanForm onLoanSuccess={handleDataReload} />
        
        <hr className="my-5" />
        
        {/* --- LISTAGEM DE EMPRÉSTIMOS --- */}
        <h2>Gestão de Empréstimos e Devoluções</h2>
        
        {/* A prop 'key' força o componente a atualizar quando o reloadKey muda */}
        <BookLoanList key={reloadKey} />
        
      </Container>
    </>
  );
}

export default App;