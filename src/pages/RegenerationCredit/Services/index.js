import React from "react";
import { Header } from "../../../components/Header";
import { useNavigate } from "react-router";
import { TopBar } from "../../../components/TopBar";

export function Services({}){
    const navigate = useNavigate();

    return(
        <div className={`bg-[#062c01] flex flex-col h-[100vh]`}>
            <TopBar/>
            <Header />

            <div className="flex flex-col items-center w-full pt-10 lg:pt-32 pb-20 lg:pb-5 overflow-y-auto">
                <div className="flex gap-5 flex-wrap max-w-[1024px] mt-3 justify-center">
                    <button 
                        className="rounded-md w-[300px] h-[300px] flex flex-col items-center justify-center bg-[#0a4303]"
                        onClick={() => navigate('/pools/producers')}
                    >
                        <img
                            src={require('../../../assets/icon-produtor.png')}
                            className="h-20 w-20 object-contain"
                        />

                        <p className="font-bold text-white text-xl mt-2">Regeneração de ecossistemas</p>
                    </button>

                    <button 
                        className="rounded-md w-[300px] h-[300px] flex flex-col items-center justify-center bg-[#0a4303]"
                        onClick={() => navigate('/pools/developers')}
                    >
                        <img
                            src={require('../../../assets/centro-dev.png')}
                            className="h-20 w-20 object-contain"
                        />

                        <p className="font-bold text-white text-xl mt-2">Desenvolvimento</p>
                    </button>

                    <button 
                        className="rounded-md w-[300px] h-[300px] flex flex-col items-center justify-center bg-[#0a4303]"
                        onClick={() => navigate('/pools/researchers')}
                    >
                        <img
                            src={require('../../../assets/centro-pesquisa.png')}
                            className="h-20 w-20 object-contain"
                        />

                        <p className="font-bold text-white text-xl mt-2">Pesquisa</p>
                    </button>

                    <button 
                        className="rounded-md w-[300px] h-[300px] flex flex-col items-center justify-center bg-[#0a4303]"
                        onClick={() => navigate('/pools/inspectors')}
                    >
                        <img
                            src={require('../../../assets/centro-inspecao.png')}
                            className="h-20 w-20 object-contain"
                        />

                        <p className="font-bold text-white text-xl mt-2">Inspeção</p>
                    </button>

                    <button 
                        className="rounded-md w-[300px] h-[300px] flex flex-col items-center justify-center bg-[#0a4303]"
                        onClick={() => navigate('/pools/validators')}
                    >
                        <img
                            src={require('../../../assets/validacao-icon.png')}
                            className="h-20 w-20 object-contain"
                        />

                        <p className="font-bold text-white text-xl mt-2">Validação</p>
                    </button>

                    <button 
                        className="rounded-md w-[300px] h-[300px] flex flex-col items-center justify-center bg-[#0a4303]"
                        onClick={() => alert('disponível em breve')}
                    >
                        <img
                            src={require('../../../assets/icon-ativista.png')}
                            className="h-20 w-20 object-contain"
                        />

                        <p className="font-bold text-white text-xl mt-2">Ativismo</p>
                    </button>
                </div>
            </div>
        </div>
    )
}