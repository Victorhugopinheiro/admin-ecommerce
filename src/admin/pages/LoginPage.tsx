import { useContext, useEffect, useState } from "react";
import api from "../../service/api";
import { UserContext } from "../../context/userContext";

type Errors = {
    email?: string;
    password?: string;
};

function LoginPage() {



    const { setToken, token } = useContext(UserContext)


    useEffect(() => {
        console.log('token mudou', token);
    }, [token])

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Errors>({});

    function validate() {
        const next: Errors = {};
        if (!email.trim()) next.email = "Informe seu e-mail.";
        if (!password.trim()) next.password = "Informe sua senha.";
        setErrors(next);
        return Object.keys(next).length === 0;
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {

            console.log('enviando', { email, password });


            const response = await api.post('/api/users/admin', {
                email, password
            })

            if (response.data.token) {

                setToken(response.data.token, { remember });
                console.log(token)
            } else {
                setToken(null);
            }
         

        }
        catch (error) {
            console.error(error);
            setToken(null);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-7">
                <div className="text-center mb-2">
                    <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-2xl">
                        🛒
                    </div>

                    <p className="mt-1 text-sm text-slate-500">Acesse o painel administrativo</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="flex flex-col">
                        <label htmlFor="email" className="mb-1.5 text-[13px] font-semibold text-slate-700">
                            E-mail
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="voce@empresa.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={`h-11 w-full rounded-xl border px-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:ring-4 ${errors.email
                                ? "border-red-500 focus:ring-red-100"
                                : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
                                }`}
                        />
                        {errors.email && <span className="mt-1 text-xs text-red-500">{errors.email}</span>}
                    </div>

                    <div className="mt-3 flex flex-col">
                        <label htmlFor="password" className="mb-1.5 text-[13px] font-semibold text-slate-700">
                            Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={`h-11 w-full rounded-xl border px-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:ring-4 ${errors.password
                                ? "border-red-500 focus:ring-red-100"
                                : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
                                }`}
                        />
                        {errors.password && <span className="mt-1 text-xs text-red-500">{errors.password}</span>}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                        <label className="flex items-center text-[13px] text-slate-700">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                className="mr-2 h-4 w-4 accent-indigo-600"
                            />
                            Lembrar-me
                        </label>

                        <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                            Esqueci minha senha
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 h-11 w-full rounded-xl bg-indigo-600 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-80"
                    >
                        {loading ? "Entrando..." : "Entrar"}
                    </button>
                </form>

                <p className="mt-4 text-center text-[13px] text-slate-500">
                    Ainda não tem acesso?{" "}
                    <a href="#" className="text-indigo-600 hover:text-indigo-700">
                        Fale com o administrador
                    </a>
                </p>
            </div>

            <div className="fixed inset-x-0 bottom-3 text-center text-xs text-slate-400">
                © {new Date().getFullYear()} Forever
            </div>
        </div>
    );
}

export default LoginPage;