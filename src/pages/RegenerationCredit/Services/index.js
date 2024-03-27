import React from "react";
import { Header } from "../../../components/Header";
import { useNavigate } from "react-router";

export function Services({}){
    const navigate = useNavigate();

    return(
        <div className={`bg-[#062c01] flex flex-col h-[100vh]`}>
            <Header />

            <div className="flex flex-col items-center w-full mt-20">
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
                            src={require('../../../assets/icon-dev-2.png')}
                            className="h-20 w-20 object-contain"
                        />

                        <p className="font-bold text-white text-xl mt-2">Desenvolvimento</p>
                    </button>

                    <button 
                        className="rounded-md w-[300px] h-[300px] flex flex-col items-center justify-center bg-[#0a4303]"
                        onClick={() => navigate('/pools/researchers')}
                    >
                        <img
                            src={require('../../../assets/icon-pesquisadores.png')}
                            className="h-20 w-20 object-contain"
                        />

                        <p className="font-bold text-white text-xl mt-2">Pesquisa</p>
                    </button>

                    <button 
                        className="rounded-md w-[300px] h-[300px] flex flex-col items-center justify-center bg-[#0a4303]"
                        onClick={() => navigate('/pools/inspectors')}
                    >
                        <img
                            src={require('../../../assets/icon-inspetor.png')}
                            className="h-20 w-20 object-contain"
                        />

                        <p className="font-bold text-white text-xl mt-2">Inspeção</p>
                    </button>
                </div>
            </div>
        </div>
    )
}