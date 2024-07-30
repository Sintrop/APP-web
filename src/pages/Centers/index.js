import React from "react";
import { Header } from "../../components/Header";
import { useNavigate } from "react-router";
import { TopBar } from '../../components/TopBar';
import { Feedback } from '../../components/Feedback';
import { Helmet } from "react-helmet";

export function Centers() {
    const navigate = useNavigate();

    return (
        <div className="bg-gradient-to-t from-[#1873B9] to-[#0B1E25] to-11% flex flex-col h-[100vh]">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Sintrop App</title>
                <link rel="canonical" href={`https://app.sintrop.com/centers`} />
                <link rel="icon" href="/favicon.png" />
                <meta
                    name="description"
                    content="Sistema Descentralizado de Regeneração da Natureza"
                />
            </Helmet>
            <TopBar />
            <Header routeActive='centers' />

            <div className="flex flex-col items-center w-full pt-10 lg:pt-32 pb-20 lg:pb-5 overflow-y-auto">
                <div className="flex gap-3 flex-wrap max-w-[1024px] mt-3">
                    <div className="flex flex-col justify-between bg-[#11652E] p-3 rounded-md w-full lg:w-[330px] h-[180px]">
                        <p className="text-green-500 font-bold text-lg">Centro de inspeções</p>
                        <p className="text-white">Histórico e lista de inspeções disponíveis</p>

                        <button
                            className="font-bold text-white p-2 w-full bg-blue-600 rounded-md"
                            onClick={() => navigate('/inspections-center')}
                        >
                            Acessar centro
                        </button>
                    </div>

                    <div className="flex flex-col justify-between bg-[#11652E] p-3 rounded-md w-full lg:w-[330px] h-[180px]">
                        <p className="text-green-500 font-bold text-lg">Centro de pesquisas</p>
                        <p className="text-white">Pesquisas e metodologias de avaliação</p>


                        <button
                            className="font-bold text-white p-2 w-full bg-blue-600 rounded-md"
                            onClick={() => navigate('/researches-center')}
                        >
                            Acessar centro
                        </button>
                    </div>

                    <div className="flex flex-col justify-between bg-[#11652E] p-3 rounded-md w-full lg:w-[330px] h-[180px]">
                        <p className="text-green-500 font-bold text-lg">Centro de desenvolvimento</p>
                        <p className="text-white">Tasks e feedbacks do desenvolvimento do sistema</p>


                        <button
                            className="font-bold text-white p-2 w-full bg-blue-600 rounded-md"
                            onClick={() => navigate('/development-center')}
                        >
                            Acessar centro
                        </button>
                    </div>

                    <div className="flex flex-col justify-between bg-[#11652E] p-3 rounded-md w-full lg:w-[330px] h-[180px]">
                        <p className="text-green-500 font-bold text-lg">Centro de validação</p>
                        <p className="text-white">Denúncias de usuários e inspeções</p>


                        <button
                            className="font-bold text-white p-2 w-full bg-blue-600 rounded-md"
                            onClick={() => navigate('/validation-center')}
                        >
                            Acessar centro
                        </button>
                    </div>

                    <div className="flex flex-col justify-between bg-[#11652E] p-3 rounded-md w-full lg:w-[330px] h-[180px]">
                        <p className="text-green-500 font-bold text-lg">Centro comercial</p>
                        <p className="text-white">Convites para usuários participarem do sistema</p>


                        <button
                            className="font-bold text-white p-2 w-full bg-blue-600 rounded-md"
                            onClick={() => navigate('/activist-center')}
                        >
                            Acessar centro
                        </button>
                    </div>

                    <div className="flex flex-col justify-between bg-[#11652E] p-3 rounded-md w-full lg:w-[330px] h-[180px]">
                        <p className="text-green-500 font-bold text-lg">Centro colaborativo</p>
                        <p className="text-white">Colabore com o sistema realizando algumas tarefas</p>


                        <button
                            className="font-bold text-white p-2 w-full bg-blue-600 rounded-md"
                            onClick={() => navigate('/colaborative-center')}
                        >
                            Acessar centro
                        </button>
                    </div>
                </div>
            </div>

            <div className="hidden lg:flex">
                <Feedback />
            </div>
        </div>
    )
}