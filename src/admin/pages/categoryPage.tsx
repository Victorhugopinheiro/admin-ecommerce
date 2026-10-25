import React from "react";
import CategoryForm from "../components/categories/CategoryForm";
import CategoryList from "../components/categories/CategoryList";

const CategoryPage: React.FC = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Gerenciamento de Categorias</h1>
            <CategoryForm />
            <CategoryList />
        </div>
    );
};

export default CategoryPage;
