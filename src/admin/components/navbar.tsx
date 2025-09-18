import { NavLink } from 'react-router-dom'
import { assets } from '../../assets/admin_assets/assets'


function Navbar() {
    return (
        <>
            <div className='p-2'>
                <div className='flex items-center justify-between'>
                    <NavLink to={'/'}>
                        <img className='h-10' src={assets.logo} />
                    </NavLink>


                    <button className='bg-black text-white px-10 py-2 rounded 
            hover:bg-slate-800 transition'>
                        Sair
                    </button>
                </div>


            </div>

            <hr />


        </>
    )
}

export default Navbar