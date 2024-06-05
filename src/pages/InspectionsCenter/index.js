import React, { useEffect, useState } from "react";
import { Blocks } from 'react-loader-spinner';
import { Header } from "../../components/Header";
import { api } from "../../services/api";
import { InspectionItem } from "./components/InspectionItem";
import { TopBar } from "../../components/TopBar";
import { ActivityIndicator } from "../../components/ActivityIndicator";
import { Feedback } from "../../components/Feedback";

export function InspectionsCenter() {
    const [tabSelected, setTabSelected] = useState('history');
    const [loading, setLoading] = useState(false);
    const [inspections, setInspections] = useState([]);

    useEffect(() => {
        if(tabSelected === 'history'){
            getHistoryInspections();
        }
        if(tabSelected === 'manage'){
            getManageInspections();
        }
    }, [tabSelected]);

    async function getHistoryInspections(){
        setLoading(true);
        const response = await api.get('/web3/history-inspections');
        setInspections(response.data.inspections)
        setLoading(false);
    }

    async function getManageInspections(){
        setLoading(true);
        const response = await api.get('/web3/manage-inspections');
        setInspections(response.data.inspections)
        setLoading(false);
    }

    return (
        <div className={`bg-[#062c01] flex flex-col h-[100vh]`}>
            <TopBar/>
            <Header/>

            <div className="flex flex-col items-center w-full pt-10 lg:pt-32 pb-20 lg:pb-5 overflow-y-auto">
                <div className="flex flex-col lg:w-[1024px] mt-3 px-2 lg:px-0">
                    <p className="font-bold text-white text-xl">Centro de inspeções</p> 

                    <div className="flex items-center gap-8 mt-2 overflow-x-auto">
                        <button 
                            className={`font-bold py-1 border-b-2 ${tabSelected === 'history' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                            onClick={() => setTabSelected('history')}
                        >
                            Histórico de inspeções
                        </button>

                        <button 
                            className={`font-bold py-1 border-b-2 ${tabSelected === 'manage' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                            onClick={() => setTabSelected('manage')}
                        >
                            Gerenciar inspeções
                        </button>
                    </div> 

                    {loading ? (
                        <div className="flex justify-center">
                            <ActivityIndicator size={50}/>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 mt-5">
                            {inspections.map(item => (
                                <InspectionItem
                                    key={item.id}
                                    data={item}
                                    type={tabSelected}
                                />
                            ))}
                        </div>
                    )}  
                </div>
            </div>

            <div className="hidden lg:flex">
                <Feedback />
            </div>
        </div>
    )
}