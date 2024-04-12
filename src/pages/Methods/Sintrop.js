import React, { useState, useEffect } from "react";
import { TopBar } from '../../components/TopBar';
import { Header } from '../../components/Header';
import { api } from "../../services/api";

export function MethodSintrop() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getCategories();
    }, []);

    async function getCategories() {
        const response = await api.get('/subCategories');
        setCategories(response.data.subCategories);
    }

    return (
        <div className={`bg-[#062c01] flex flex-col h-[100vh]`}>
            <TopBar />
            <Header />

            <div className="flex flex-col items-center w-full pt-32 overflow-auto">
                <div className="flex flex-col w-[1024px] mt-3">
                    <div className="flex flex-col items-center">
                        <img
                            src={require('../../assets/logo-branco.png')}
                            className="w-48 h-32 object-contain"
                        />

                        <h3 className="font-bold text-4xl text-center text-white">Método Sintrop</h3>
                    </div>

                    <div className="mt-5 flex flex-col rounded-md bg-[#0a4303] w-full">
                        <div className="flex flex-col py-2 border-b border-green-500">
                            <p className="text-white mx-2 font-bold">Descrição do método</p>
                        </div>
                        <p className="text-white m-2">Primeiro método de avaliação criado no Sistema. Esse método é composto por 4 fases: Análise de insumos, contagem e estimativa de árvores, análise de solo e registro da biodiversidade.</p>
                    </div>

                    <div className="mt-5 flex flex-col rounded-md bg-[#0a4303] w-full">
                        <div className="flex flex-col py-2 border-b border-green-500">
                            <p className="text-white mx-2 font-bold">1. Registro de insumos</p>
                        </div>
                        <p className="text-white m-2">Nessa etapa iremos registrar todos insumos provenientes de fora da propriedade. Tudo que vem de fora, de alguma forma possui algum impacto no Planeta e deverá ser contabilizado negativamente. A utilização de insumos químicos deverá inviabilizar o produtor de ter uma nota positiva, não tem como ser regenerativo usando veneno que destrói e mata a biodiversidade. Cada insumo, terá um índice de penalização, o qual deverá ser avaliado e otimizado para melhor coerência. Você poderá propor mudança no índice e também sugerir novos insumos.</p>
                    </div>

                    <div className="mt-5 flex flex-col rounded-md bg-[#0a4303] w-full">
                        <div className="flex flex-col py-2 border-b border-green-500">
                            <p className="text-white mx-2 font-bold">Tabela de insumos</p>
                        </div>

                        <div className="flex items-center gap-2 bg-green-700 p-1">
                            <div className="w-[350px] p-1 flex items-center justify-center">
                                <p className="text-white font-bold">Insumo</p>
                            </div>

                            <div className="w-[120px] p-1 flex items-center justify-center">
                                <p className="text-white font-bold">Unidade</p>
                            </div>

                            <div className="w-[120px] p-1 flex items-center justify-center">
                                <p className="text-white font-bold">Carbono (kg)</p>
                            </div>

                            <div className="w-[120px] p-1 flex items-center justify-center">
                                <p className="text-white font-bold">Solo (m²)</p>
                            </div>

                            <div className="w-[120px] p-1 flex items-center justify-center">
                                <p className="text-white font-bold">Água (m³)</p>
                            </div>

                            <div className="w-[120px] p-1 flex items-center justify-center">
                                <p className="text-white font-bold">Biodiver. (uv)</p>
                            </div>
                        </div>

                        {categories.map(item => {


                            if (item?.id !== '27' && item?.id !== '28' && item?.id !== '29' && item?.id !== '14' && item?.id !== '30') {
                                return (
                                    <div className="flex items-center gap-2 border-b border-green-600 p-1">
                                        <div className="w-[350px] p-1 flex items-center justify-center">
                                            <p className="text-white font-bold">{item.title}</p>
                                        </div>

                                        <div className="w-[120px] p-1 flex items-center justify-center">
                                            <p className="text-white">{item?.unity}</p>
                                        </div>

                                        <div className="w-[120px] p-1 flex items-center justify-center">
                                            <p className="text-white">{Number(item?.carbonValue).toFixed(3)}</p>
                                        </div>

                                        <div className="w-[120px] p-1 flex items-center justify-center">
                                            <p className="text-white">{Number(item?.soloValue).toFixed(3)}</p>
                                        </div>

                                        <div className="w-[120px] p-1 flex items-center justify-center">
                                            <p className="text-white">{Number(item?.aguaValue).toFixed(3)}</p>
                                        </div>

                                        <div className="w-[120px] p-1 flex items-center justify-center">
                                            <p className="text-white">{Number(item?.bioValue).toFixed(3)}</p>
                                        </div>
                                    </div>
                                );
                            }
                        })}
                    </div>

                    <div className="mt-5 flex flex-col rounded-md bg-[#0a4303] w-full">
                        <div className="flex flex-col py-2 border-b border-green-500">
                            <p className="text-white mx-2 font-bold">2. Contagem e estimativa de árvores</p>
                        </div>
                        <p className="text-white m-2">Nessa etapa iremos contar e estimar a quantidade de árvores da propriedade. O objetivo é deixar cada vez mais precisa essa avaliação. Iremos estimar quanto de CO2 e de água cada árvore, de acordo com seu tipo e seu diâmetro. O app terá um contador de árvores avulsas, e um sistema de zonas de regeneração, o qual deverá ser registrado as coordenadas dos pontos da zona. Em seguida deverá ser registrado os pontos de uma subzona, uma área menor dentro dela para contagem das árvores, para então ser feita uma extrapolação do resultado final.</p>
                    </div>

                    <div className="mt-5 flex flex-col rounded-md bg-[#0a4303] w-full">
                        <div className="flex flex-col py-2 border-b border-green-500">
                            <p className="text-white mx-2 font-bold">3. Análise de solo</p>
                        </div>
                        <p className="text-white m-2">Nessa etapa, deverá ser realizada pesagem e estimativa da biomassa de cobertura de solo da propriedade. Para cada zona de regeneração, o inspetor deverá pesar 5 pontos distintos. Será feita a média e então a extrapolação para a zona total. A quantidade de biomassa entrará como carbono sequestrado. Também será contado a quantidade de insetos visíveis a olho nu encontrados.</p>
                    </div>

                    <div className="mt-5 flex flex-col rounded-md bg-[#0a4303] w-full">
                        <div className="flex flex-col py-2 border-b border-green-500">
                            <p className="text-white mx-2 font-bold">4. Registro de biodiversidade</p>
                        </div>
                        <p className="text-white m-2">Em todas as etapas da inspeção, o inspetor deverá registrar com uma foto toda a biodiversidade encontrada, tanto de plantas quanto de fungos e animais. Cada registro contará 1 unidade de vida.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}