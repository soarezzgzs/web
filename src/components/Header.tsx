import logoSvg from "../assets/logo.svg";
import logoutSvg from "../assets/logout.svg";

export function Header(){
    return (
        <header className="w-full flex justify-between">
            <img src={logoSvg} alt="logo" className="my-8" />

            <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-200" >Olá, Leonardo</span>

                <img src={logoutSvg} alt="ícone de sair" className="my-8 cursor-pointer hover:opacity-75 transition ease-linear" />
            </div>
        </header>
    )
}