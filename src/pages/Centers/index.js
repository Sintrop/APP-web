import React from "react";
import { Header } from "../../components/Header";

export function Centers(){
    return(
        <div className="bg-[#062c01] flex flex-col h-[100vh]">
            <Header routeActive='centers'/>

            <div className="flex flex-col items-center w-full mt-20">
                <div className="flex gap-3 flex-wrap max-w-[1024px] mt-3 justify-center">
                    <div className="flex flex-col justify-between bg-[#0a4303] p-3 rounded-md w-[300px] h-[350px]">
                        <div>
                            <img
                                src={require('../../assets/centro-inspecao.png')}
                                className="w-10 h-10 object-contain"
                            />
                            <p className="text-white font-bold text-lg">Centro de inspeções</p>
                            <p className="text-white">Histórico e lista de inspeções disponíveis</p>
                        </div>

                        <button 
                            className="font-bold text-white p-2 w-full bg-blue-600 rounded-md"
                        >
                            Acessar centro
                        </button>
                    </div>

                    <div className="flex flex-col justify-between bg-[#0a4303] p-3 rounded-md w-[300px] h-[350px]">
                        <div>
                            <img
                                src={require('../../assets/centro-pesquisa.png')}
                                className="w-10 h-10 object-contain"
                            />
                            <p className="text-white font-bold text-lg">Centro de pesquisas</p>
                            <p className="text-white">Pesquisas e metodologias de avaliação</p>
                        </div>

                        <button 
                            className="font-bold text-white p-2 w-full bg-blue-600 rounded-md"
                        >
                            Acessar centro
                        </button>
                    </div>

                    <div className="flex flex-col justify-between bg-[#0a4303] p-3 rounded-md w-[300px] h-[350px]">
                        <div>
                            <img
                                src={require('../../assets/centro-dev.png')}
                                className="w-10 h-10 object-contain"
                            />
                            <p className="text-white font-bold text-lg">Centro de desenvolvimento</p>
                            <p className="text-white">Tasks e feedbacks do desenvolvimento do sistema</p>
                        </div>

                        <button 
                            className="font-bold text-white p-2 w-full bg-blue-600 rounded-md"
                        >
                            Acessar centro
                        </button>
                    </div>

                    <div className="flex flex-col justify-between bg-[#0a4303] p-3 rounded-md w-[300px] h-[350px]">
                        <div>
                            <img
                                src={require('../../assets/validacao-icon.png')}
                                className="w-10 h-10 object-contain"
                            />
                            <p className="text-white font-bold text-lg">Centro de validação</p>
                            <p className="text-white">Denúncias de usuários e inspeções</p>
                        </div>

                        <button 
                            className="font-bold text-white p-2 w-full bg-blue-600 rounded-md"
                        >
                            Acessar centro
                        </button>
                    </div>

                    <div className="flex flex-col justify-between bg-[#0a4303] p-3 rounded-md w-[300px] h-[350px]">
                        <div>
                            <img
                                src={require('../../assets/comercial-icon.png')}
                                className="w-10 h-10 object-contain"
                            />
                            <p className="text-white font-bold text-lg">Centro comercial</p>
                            <p className="text-white">Convites para usuários participarem do sistema</p>
                        </div>

                        <button 
                            className="font-bold text-white p-2 w-full bg-blue-600 rounded-md"
                        >
                            Acessar centro
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}