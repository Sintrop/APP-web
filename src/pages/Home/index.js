import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { Blocks } from 'react-loader-spinner';
import { api } from "../../services/api";
import { PublicationItem } from "./components/PublicationItem";

export function Home() {
    const [loading, setLoading] = useState(false);
    const [publications, setPublications] = useState([]);
    const [page, setPage] = useState(0);

    useEffect(() => {
        getPublications();
    }, [page]);

    async function getPublications(){
        setLoading(true);

        const response = await api.get(`/publications/get-all/${page}`);
        const resPublis = response.data.publications;

        if(page === 0){
            setPublications(resPublis);
        }else{
            for(var i = 0; i < resPublis.length; i++){
                publications.push(resPublis[i]);
            }
        }

        setLoading(false);
    }

    return (
        <div className={`bg-[#062c01] flex flex-col ${publications.length === 0 ? 'h-[100vh]' : 'h-full'}`}>
            <Header routeActive='home' />

            <div className="flex flex-col items-center w-full mt-20">
                {loading && (
                    <Blocks
                        height="80"
                        width="80"
                        color="#4fa94d"
                        ariaLabel="blocks-loading"
                        wrapperStyle={{}}
                        wrapperClass="blocks-wrapper"
                        visible={true}
                    />
                )}

                <div className="flex flex-col mt-3 gap-3">
                    {publications.length > 0 && (
                        <>
                        {publications.map(item => (
                            <PublicationItem
                                data={item}
                                key={item.id}
                            />
                        ))}

                        <button onClick={() => setPage(page + 1)}>
                            Ver mais
                        </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}