import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import api from "../../service/api";
import { toast } from "react-toastify";
import type { Order } from "../../type/order";



const AdminOrdersPage = () => {

  const { token, products } = useContext(UserContext);
  const [orders, setOrders] = useState<Order[]>([])


  const gettingAllOrders = async () => {
    try {
      const response = await api.post('/api/orders/list', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })


      if (response.data.success) {

        console.log("Pedidos:", response.data.orders);
        setOrders(response.data.orders);
        console.log(products?.length)
      } else {
        toast.error("Erro ao buscar pedidos");
      }

    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
    }
  }

  useEffect(() => {

    if (!token) {
      window.location.href = "/admin/login";
    }

    gettingAllOrders();

  }, [token]);

 const changeOrderStatus = async (orderId: string, status: string) => {
  alert(orderId + ' - ' + status);

  if(!token) return;

  if(!orderId || !status) {
    toast.error("ID do pedido ou status inválido.");
    return;
  }

  try{

    const response = await api.patch('/api/orders/update-status', {
      orderId,
      status
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if(response.data.success) {
      toast.success("Status do pedido atualizado.");
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: status as Order["status"] } : o));
    }

  }catch(err) {
    console.log(err);
    toast.error("Erro ao atualizar status do pedido.");
  }

  
 }
  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Pedidos</h1>

      <div className="mt-4 flex flex-col w-full gap-4">
        {orders.length === 0 && <p className="text-sm text-slate-500">Nenhum pedido encontrado.</p>}

        {orders.map((order) => {
          const findProduct = products?.find(prod => prod._id === order.items[0]?.productId);

          if (!findProduct) return null; // evite renderizar nada se não achar produto

          return (
            <div className="flex items-center gap-4 border w-full p-4 rounded bg-white" key={order._id}>
              <img className="w-16 h-16 object-cover rounded" src={findProduct.image[0]} alt={findProduct.name} />
              <div className="flex-1">
                <p className="font-semibold">{findProduct.name}</p>
                <p className="text-sm text-slate-600">Pedido #{order._id.slice(-6)}</p>
                <p className="text-sm text-slate-600">Total: R$ {order.totalAmount.toFixed(2).replace('.', ',')}</p>
              </div>

              <div>
                <select onChange={ (e) => changeOrderStatus(order._id, e.target.value) } className="border rounded p-2">
                  <option  value="pending" selected={order.status === 'pending'}>Pendente</option>
                  <option value="shipped" selected={order.status === 'shipped'}>Enviado</option>
                  <option value="delivered" selected={order.status === 'delivered'}>Entregue</option>
                  <option value="refunded" selected={order.status === 'refunded'}>Cancelado</option>
                </select>
              </div>

              <div className="text-sm text-slate-500">
                {new Date(order.createdAt).toLocaleDateString('pt-BR')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
// ...existing code...
};

export default AdminOrdersPage;