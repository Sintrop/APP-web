import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ActivityIndicator } from "../../components/ActivityIndicator";
import { api } from "../../services/api";

export function ContentDetails({ }) {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [contentData, setContentData] = useState({});

    useEffect(() => {
        getContentData();
    }, []);

    async function getContentData() {
        setLoading(true);
        const response = await api.get(`/content/${id}`);
        setContentData(response.data);
        setLoading(false);
    }

    return (
        <div className='w-full h-screen flex flex-col bg-[#062c01] overflow-y-scroll overflow-x-hidden'>
            {loading ? (
                <div className="flex flex-col items-center justify-center h-full">
                    <ActivityIndicator size={180} />
                </div>
            ) : (
                <div>
                    <div className='w-full h-[400px] bg-gradient-to-r from-black to-black/40 flex absolute items-center justify-between px-5'>
                        <div className='flex flex-col gap-1 max-w-[50%]'>
                            <h1 className='font-bold text-white text-7xl'>{contentData?.title}</h1>
                            <h2 className='font-bold text-white'>{contentData?.description}</h2>
                        </div>

                        <img
                            src={contentData?.postUrl}
                            className="w-[170px] h-[250px] object-cover rounded-md border-2 border-white mr-10"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}