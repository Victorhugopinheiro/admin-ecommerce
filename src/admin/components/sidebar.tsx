import { clsx } from "clsx"
import { NavLink } from "react-router-dom"
import { useContext } from "react"
import type { IconType } from "react-icons"
import { LuCirclePlus, LuLogOut, LuPackage, LuShoppingBag, LuTag } from "react-icons/lu"
import { UserContext } from "../../context/userContext"

interface NavItem {
    to: string;
    icon: IconType;
    label: string;
}

const navItems: NavItem[] = [
    { to: "/add", icon: LuCirclePlus, label: "Add items" },
    { to: "/list", icon: LuPackage, label: "Listar Produtos" },
    { to: "/orders", icon: LuShoppingBag, label: "Pedidos" },
    { to: "/categories", icon: LuTag, label: "Categorias" },
]

function Sidebar({ children }: { children: React.ReactNode }) {
    const { logout } = useContext(UserContext)

    return (
        <div className="flex min-h-[calc(100vh-9px)]">
            <aside className="flex w-16 shrink-0 flex-col bg-black  px-2 py-4 text-sky-100 md:w-60 md:px-3">
                <div className="mb-8 flex items-center gap-3 px-1">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-700 text-white">
                        <LuShoppingBag size={20} aria-hidden="true" />
                    </span>
                    <h1 className="hidden text-base font-bold uppercase md:block">Admin</h1>
                </div>

                <nav aria-label="Menu lateral" className="flex flex-1 flex-col">
                    <p className="mb-2 hidden px-2 text-xs text-indigo-300 md:block">Menu</p>

                    <ul className="flex flex-col gap-1">
                        {navItems.map(({ to, icon: Icon, label }) => (
                            <li key={to}>
                                <NavLink
                                    to={to}
                                    title={label}
                                    className={({ isActive }) =>
                                        clsx(
                                            "flex items-center justify-center gap-3 rounded-lg px-2 py-2 text-sm transition md:justify-start md:px-3",
                                            isActive ? "bg-sky-700 text-white" : "hover:bg-white/10"
                                        )
                                    }
                                >
                                    <Icon size={18} aria-hidden="true" className="shrink-0" />
                                    <span className="hidden md:inline">{label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="mt-auto px-1">
                    <button
                        type="button"
                        onClick={() => logout()}
                        title="Sair"
                        className="flex w-full items-center justify-center gap-3 rounded-lg px-2 py-2 text-sm transition hover:bg-white/10 md:justify-start md:px-3"
                    >
                        <LuLogOut size={18} aria-hidden="true" className="shrink-0" />
                        <span className="hidden md:inline">Sair</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-x-hidden p-4 md:p-6">
                {children}
            </main>
        </div>
    )
}

export default Sidebar
