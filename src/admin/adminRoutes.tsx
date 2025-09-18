import React from 'react';
import { Routes, Route } from 'react-router-dom';


import AddProduct from './pages/AddProduct';
import ListProduct from './pages/listProduct';
import OrderProducts from './pages/orderProduct';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Todas as rotas aqui dentro usarão o AdminLayout */}
  
        {/* A rota "index" é a padrão quando se acessa /admin */}
        <Route index path='/add' element={<AddProduct />} />
        
        <Route path="/list" element={<ListProduct />} />
        <Route path="/orders" element={<OrderProducts />} />
        
        {/* Rota para lidar com caminhos não encontrados dentro de /admin */}
        <Route path="*" element={<h1>Página não encontrada na área de Admin</h1>} />
     
    </Routes>
  );
};

export default AdminRoutes;