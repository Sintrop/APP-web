import React, {useEffect, useState} from "react";
import { Header } from "../../components/Header";
import { Blocks } from "react-loader-spinner";
import { api } from "../../services/api";
import { ResearcheItem } from "./components/ResearcheItem";

export function ResearchesCenter(){
    const [tabSelected, setTabSelected] = useState('researches');
    const [loading, setLoading] = useState(false);
    const [researches, setResearches] = useState([]);

    useEffect(() => {
        if(tabSelected === 'researches'){
            getResearches();
        }
        if(tabSelected === 'isa'){
            
        }
    }, [tabSelected]);

    async function getResearches(){
        setLoading(true);
        const response = await api.get('/web3/researches');
        console.log(response.data.researches)
        setResearches(response.data.researches);
        setLoading(false);
    }

    return(
        <div className={`bg-[#062c01] flex flex-col h-[100vh]`}>
            <Header />

            <div className="flex flex-col items-center w-full mt-20 overflow-auto">
                <div className="flex flex-col w-[1024px] mt-3">
                    <p className="font-bold text-white text-xl">Centro de pesquisas</p> 

                    <div className="flex items-center gap-8 mt-2">
                        <button 
                            className={`font-bold py-1 border-b-2 ${tabSelected === 'researches' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                            onClick={() => setTabSelected('researches')}
                        >
                            Pesquisas
                        </button>

                        <button 
                            className={`font-bold py-1 border-b-2 ${tabSelected === 'isa' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                            onClick={() => setTabSelected('isa')}
                        >
                            Índice de sustentabilidade
                        </button>
                    </div> 

                    {loading ? (
                        <div className="flex justify-center">
                            <Blocks
                                height="60"
                                width="60"
                                color="#4fa94d"
                                ariaLabel="blocks-loading"
                                wrapperStyle={{}}
                                wrapperClass="blocks-wrapper"
                                visible={true}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 mt-5">
                            {tabSelected === 'researches' && (
                                <>
                                {researches.map(item => (
                                    <ResearcheItem data={item}/>
                                ))}
                                </>
                            )}
                        </div>
                    )}  
                </div>
            </div>
        </div>
    )
}