import React, {useEffect, useState} from "react";
import { api } from "../../services/api";

export function TopBar(){
    const [nextEra, setNextEra] = useState(0);
    const [era, setEra] = useState(1);
    const [textWidth, setTextWidth] = useState(0)
    const [impactToken, setImpactToken] = useState({});
    const [position, setPosition] = useState(200)

    useEffect(() => {
        getEraInfo();
        getImpact();
    }, []);

    useEffect(() => {
        setTimeout(() => {
            const next = nextEra - 1;
            setNextEra(next);
        }, 13500);
    }, [nextEra]);

   

    async function getEraInfo() {
        const response = await api.get('/web3/era-info');
        setNextEra(response.data.nextEraIn);
        setEra(response.data.eraAtual)
    }

    async function getImpact() {
        const response = await api.get('/impact-per-token');
        setImpactToken(response.data.impact);
    }

    return(
        <div className="w-[100vw] h-[40px] bg-green-700 flex fixed top-0 left-0 items-center">
            <div className='flex items-center gap-5 px-5'>
                <p className=" text-gray-200 text-sm">Era atual: <span className="font-bold text-green-300">{era}</span></p>

                <p className=" text-gray-200 text-sm">Próx. era: <span className="font-bold text-green-300">{nextEra} blocos</span></p>

                <p className=" text-gray-200 text-sm">
                    Impacto por token: 
                    <span className="font-bold text-green-300"> Carbono: 02,184 g</span>
                    <span className="font-bold text-green-300"> | Água: 0,8 L</span>
                    <span className="font-bold text-green-300">  |  Solo: 1.25 cm²</span>
                    <span className="font-bold text-green-300">  |  Biodver.: 0,005 uv</span>
                </p>

                <div className="flex items-center justify-center h-8 w-60 rounded-md bg-red-500">
                    <p className="font-bold text-white text-sm">Banner pré venda</p>
                </div>
            </div>
        </div>
    )
}