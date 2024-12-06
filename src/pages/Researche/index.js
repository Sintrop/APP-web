import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header/header";
import { api } from "../../services/api";
import { useParams } from "react-router";
import { ActivityIndicator } from "../../components/ActivityIndicator/ActivityIndicator";
import { ResearcheItem } from "../Actions/components/ResearcherActions/components/ResearcheItem";
import { TopBar } from "../../components/TopBar";

export function Researche() {
    const {id} = useParams();
    const [loading, setLoading] = useState(false);
    const [researcheData, setResearcheData] = useState(null);

    useEffect(() => {
        getResearcheData();
    }, []);

    async function getResearcheData() {
        setLoading(true);
        const response = await api.get(`/web3/researche/${id}`);
        const researches = response.data.researches;
        if(researches.length > 0){
            setResearcheData(researches[0]);
        }
        setLoading(false);
    }

    return (
        <div className={`bg-[#062c01] flex flex-col h-[100vh]`}>
            <TopBar/>
            <Header />

            <div className="flex flex-col items-center pt-10 lg:pt-32 overflow-auto pb-20 lg:pb-5">
                <div className={`flex flex-col w-[100vw] lg:w-[1024px] mt-3 items-center`}>
                    {loading && (
                        <ActivityIndicator size={50}/>
                    )}

                    {researcheData && (
                        <ResearcheItem
                            data={researcheData}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}