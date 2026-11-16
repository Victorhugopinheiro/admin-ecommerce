import React from "react";
import CategoryForm from "../components/categories/CategoryForm";
import CategoryList from "../components/categories/CategoryList";

const FranchisePage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Franquias</h1>
      <CategoryForm />
      <CategoryList />
    </div>
  );
};

export default FranchisePage;
