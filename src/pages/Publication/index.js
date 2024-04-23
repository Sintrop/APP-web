import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { api } from "../../services/api";
import { useParams } from "react-router";
import { ActivityIndicator } from "../../components/ActivityIndicator";
import { PublicationItem } from "../Home/components/PublicationItem";
import { TopBar } from "../../components/TopBar";

export function Publication() {
    const {id} = useParams();
    const [loading, setLoading] = useState(false);
    const [publiData, setPubliData] = useState(null);

    useEffect(() => {
        getPublicationData();
    }, []);

    async function getPublicationData() {
        setLoading(true);
        const response = await api.get(`/publication/${id}`);
        setPubliData(response.data.publication);
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

                    {publiData && (
                        <PublicationItem
                            data={publiData}
                            detailPubli
                        />
                    )}
                </div>
            </div>
        </div>
    )
}