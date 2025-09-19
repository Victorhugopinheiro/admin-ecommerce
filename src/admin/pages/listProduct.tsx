import React, { useEffect, useState, useContext } from 'react';
import api from '../../service/api';
import { UserContext } from '../../context/userContext';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  category: string;
  subCategory: string;
  sizes: string[];
  bestSeller: boolean;
  image: string[];
  price: number;
}

const AdminProductsPage: React.FC = () => {
  const { token } = useContext(UserContext);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const getProducts = async () => {
    if (!token) return;
    setLoading(true);
    setApiError(null);
    try {

      const res = await api.get('/api/products/list');

      if (res.data?.success && Array.isArray(res.data.products)) {
        setProducts(res.data.products);
        console.log(res.data.products[0].image[0]);
      } else {
        setApiError("Resposta inesperada da API.");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {

        if (err.response?.status === 401) {
          setApiError("Não autorizado (401). Verifique se o token é válido / formato do header.");
        } else {
          setApiError((err.response?.data as any)?.message || "Erro ao buscar produtos.");
        }
      } else {
        setApiError("Erro inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, [token]);


  const deleteItem = async (id: string) => {
    if (!token) return;
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
    setLoading(true);
    setApiError(null);
    try {
      const res = await api.delete(`/api/products/delete`, {
        data: { productId: id }
      });
  
      if (res.data?.success) {
        setProducts(products => products.filter(p => p._id !== id));
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setApiError((err.response?.data as any)?.message || "Erro ao excluir produto.");
      } else {
        setApiError("Erro inesperado.");
      }
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Produtos</h1>
      {apiError && <div className="mb-4 rounded bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{apiError}</div>}
      {loading && <p className="text-sm text-slate-500">Carregando...</p>}
      {!loading && !apiError && products.length === 0 && (
        <p className="text-sm text-slate-500">Nenhum produto.</p>
      )}
  
      {products.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className='grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-6 rounded border bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700'>
            <b>Imagem</b>
            <b className="">Nome</b>
            <b className="">Categoria</b>
            <b className="">Subcategoria</b>
            <b className="">Tamanhos</b>
            <b className="">Mais Vendido</b>
            <b className="">Preço</b>
          </div>
          {products.map(p => (
            <div key={p._id} className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-6 rounded border bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
              <div>{p.image?.[0] ? <img src={p.image[0]} className="h-12 w-12 object-cover rounded" /> : "—"}</div>
              <div className="font-medium">{p.name}</div>
              <div>{p.category}</div>
              <div>{p.subCategory}</div>
              <div>{p.sizes?.join(", ")}</div>
              <div>{p.bestSeller ? "Sim" : "Não"}</div>
              <div>R$ {p.price.toFixed(2).replace('.', ',')}</div>
              <button onClick={() => deleteItem(p._id)} className="ml-auto text-red-600 hover:underline">X</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

}

export default AdminProductsPage;