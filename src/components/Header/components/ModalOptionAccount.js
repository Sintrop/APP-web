import { useNavigate } from "react-router";
import { FaUser } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { FiRefreshCw } from "react-icons/fi";

export function ModalOptionAccount({close, mobile, disconnect, switchAccount}){
    const navigate = useNavigate();
    return(
        <div onClick={close} className={`flex w-screen h-screen top-0 right-0 absolute z-50`}>
            <div className={`w-40 h-62 gap-1 bg-white flex flex-col rounded-lg ml-[-20px] top-24 mt-3 ${mobile ? 'fixed' : 'absolute'} 2xl:right-[400px] xl:right-[115px] lg:right-[80px] md:right-[20px]`}>
                <button 
                    className="flex w-[100%] h-10 items-center hover:bg-gray-300 hover:cursor-pointer rounded-lg px-2 gap-2"
                    onClick={() => navigate('/profile')}
                >
                    <FaUser size={20} className="text-green-600"/>
                    <p className="font-bold text-green-600">Perfil</p>
                </button>

                <button 
                    className="flex w-[100%] h-10 items-center hover:bg-gray-300 hover:cursor-pointer rounded-lg px-2 gap-2"
                    onClick={switchAccount}
                >
                    <FiRefreshCw size={20} className="text-green-600"/>
                    <p className="font-bold text-green-600">Trocar conta</p>
                </button>

                <button 
                    className="flex w-[100%] h-10 items-center hover:bg-gray-300 hover:cursor-pointer rounded-lg px-2 gap-2"
                    onClick={disconnect}
                >
                    <MdLogout size={20} className="text-green-600"/>
                    <p className="font-bold text-green-600">Desconectar</p>
                </button>

                <button 
                    onClick={close}
                    className="flex w-[100%] h-10 items-center justify-center hover:bg-gray-300 hover:cursor-pointer rounded-lg px-2 gap-2"
                >
                    <p className="font-bold text-gray-600">Fechar</p>
                </button>
            </div>
        </div>
    )
}