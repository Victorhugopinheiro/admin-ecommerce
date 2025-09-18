import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminRoutes from './admin/adminRoutes';
import LoginPage from './admin/pages/LoginPage';
import { UserContext } from './context/userContext';
import Navbar from './admin/components/navbar';
import Sidebar from './admin/components/sidebar';

// Exemplo de uma página da loja
const HomePage: React.FC = () => <h1>Página Inicial da Loja</h1>;

const App: React.FC = () => {

  const { token } = useContext(UserContext);

  if (!token) {
    return <LoginPage />;
  }

  return (
    <>


      <Navbar />

      <Sidebar>
        <Routes>
          {/* Rotas públicas da sua loja */}
          <Route path="/" element={<HomePage />} />
          <Route path="/produto/:id" element={<h1>Página de Detalhe do Produto</h1>} />

          {/* A mágica acontece aqui: 
          Qualquer rota que comece com "/admin/" será delegada ao componente AdminRoutes.
        */}
          <Route path="/admin/*" element={<AdminRoutes />} />

          {/* Rota para páginas não encontradas no nível principal */}
          <Route path="*" element={<h1>Erro 404 - Página não encontrada</h1>} />
        </Routes>

      </Sidebar>
    </>

  );
};

export default App;