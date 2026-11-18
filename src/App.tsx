import React, { lazy, Suspense, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./admin/pages/LoginPage";
import { UserContext } from "./context/userContext";
import Navbar from "./admin/components/navbar";
import Sidebar from "./admin/components/sidebar";
import AdminAddProduct from "./admin/pages/addProduct";
import ListProduct from "./admin/pages/listProduct";
import OrderProducts from "./admin/pages/orderProduct";
import CategoryPage from "./admin/pages/categoryPage";
import FranchisePage from "./admin/pages/FranchisePage";

const ReviewPage = lazy(() => import("./admin/pages/reviewPage"));

function RouteFallback() {
  return <p className="text-sm text-slate-500">Carregando...</p>;
}

const HomePage: React.FC = () => <h1>Página Inicial da Loja</h1>;

const App: React.FC = () => {
  const { authenticated } = useContext(UserContext);

  if (!authenticated) {
    return <LoginPage />;
  }

  return (
    <>
      <Navbar />

      <Sidebar>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/produto/:id"
            element={<h1>Página de Detalhe do Produto</h1>}
          />

          <Route index path="/add" element={<AdminAddProduct />} />
          <Route path="/list" element={<ListProduct />} />
          <Route path="/orders" element={<OrderProducts />} />
          <Route
            path="/reviews"
            element={
              <Suspense fallback={<RouteFallback />}>
                <ReviewPage />
              </Suspense>
            }
          />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/franchise" element={<FranchisePage />} />

          <Route path="*" element={<h1>Erro 404 - Página não encontrada</h1>} />
        </Routes>
      </Sidebar>
    </>
  );
};

export default App;
