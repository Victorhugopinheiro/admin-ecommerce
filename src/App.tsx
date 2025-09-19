import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './admin/pages/LoginPage';
import { UserContext } from './context/userContext';
import Navbar from './admin/components/navbar';
import Sidebar from './admin/components/sidebar';
import AdminAddProduct from './admin/pages/addProduct';
import ListProduct from './admin/pages/listProduct';
import OrderProducts from './admin/pages/orderProduct';


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

          <Route path="/" element={<HomePage />} />
          <Route path="/produto/:id" element={<h1>Página de Detalhe do Produto</h1>} />

          <Route index path='/add' element={<AdminAddProduct />} />
          <Route path="/list" element={<ListProduct />} />
          <Route path="/orders" element={<OrderProducts />} />


          <Route path="*" element={<h1>Erro 404 - Página não encontrada</h1>} />
        </Routes>

      </Sidebar>
    </>

  );
};

export default App;