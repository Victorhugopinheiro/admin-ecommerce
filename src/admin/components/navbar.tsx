import { NavLink } from 'react-router-dom'
import cavernaLogo from "../../assets/cavernaNerds.jpg"
import { useContext } from 'react'
import { UserContext } from '../../context/userContext'


function Navbar() {

    const { logout } = useContext(UserContext)

    return (
        <header className=' border-slate-200 bg-black'>
            <nav
                aria-label='Navegação principal'
                className='flex items-center justify-between px-4 py-2'
            >
                <NavLink to='/' aria-label='Caverna Nerds - página inicial'>
                    <img className=' w-30' src={cavernaLogo} alt='Logo Caverna Nerds' />
                </NavLink>

                <button
                    type='button'
                    onClick={() => logout()}
                    className='rounded bg-white px-10 py-2 text-black transition hover:bg-slate-200  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black'
                >
                    Sair
                </button>
            </nav>

        </header>
    )
}

export default Navbar