import React from "react";
import FranchiseForm from "../components/franchises/FranchiseForm";
import FranchiseList from "../components/franchises/FranchiseList";

const FranchisePage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Franquias</h1>
      <FranchiseForm />
      <FranchiseList />
    </div>
  );
};

export default FranchisePage;
