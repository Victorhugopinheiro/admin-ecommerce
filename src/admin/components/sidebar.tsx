import { clsx } from "clsx"
import { NavLink } from "react-router-dom"
import { assets } from "../../assets/admin_assets/assets"
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa6";



interface NavComponentProps {
    to: string;
    icon: string;
    label?: string;
    colapse?: boolean
}

function Sidebar({ children }: { children: React.ReactNode }) {





    const [colapse, setColapse] = useState(false)


    return (
        <div className="flex min-h-[calc(100vh-9px)] ">

            <div className={clsx(
                'md:hidden',
                "w-20 mr-10 bg-white border-x  border-slate-300 text-white py-6",
                "flex flex-col"
            )}>


                <div className="flex flex-col  gap-6 items-center  w-full">


                    <NavComponent colapse={colapse} icon={assets.add_icon} to="/admin/add" />

                    <NavComponent colapse={colapse} icon={assets.order_icon} to="/admin/list" />

                    <NavComponent colapse={colapse} icon={assets.order_icon} to="/admin/orders" />


                </div>

            </div>



            <div className={clsx("hidden md:flex flex-col transition-all duration-300 text-black mr-10 bg-white border-x  border-slate-300  py-6",
                colapse ? 'w-20' : 'w-60'
            )}>

                <button onClick={() => setColapse(!colapse)} className="mb-10 ml-auto mr-4">
                    <FaArrowRight className={clsx('transition-all ', colapse ? ' transform scale-x-[-1]' : '')} width={10} color="black" />
                </button>

                <h1 className="text-xl mb-6 text-center font-medium">ADMIN</h1>


                <div className="flex flex-col text-black  gap-6 items-start  w-full ">
                    <NavComponent label="Add items " colapse={colapse} icon={assets.add_icon} to="/admin/add" />

                    <NavComponent label="Listar Produtos" colapse={colapse} icon={assets.order_icon} to="/admin/list" />

                    <NavComponent label="Pedidos" colapse={colapse} icon={assets.order_icon} to="/admin/orders" />
                </div>
            </div>


            <div>
                {children}
            </div>


        </div>
    )
}

export default Sidebar




const NavComponent = ({ icon, to, label, colapse }: NavComponentProps) => {


    return (
        <NavLink to={to} className={clsx('w-full border')}>
            <div className={clsx(
                'flex items-center overflow-hidden  w-full gap-3 p-3  hover:bg-blue-400 hover:text-white transition',

            )}>
                <img className={clsx('w-5 h-5  border-black')} src={icon} />
                {!colapse && <span className="font-medium text-sm">{label}</span>}
            </div>
        </NavLink>
    )
}