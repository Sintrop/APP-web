import React, {useEffect, useState} from "react";
import { MdOutlinePlayCircle } from "react-icons/md";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { ActivityIndicator } from "../../../components/ActivityIndicator";
import { api } from "../../../services/api";

export function EpisodeItem({data, contentData}){
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    async function play(){
        if(loading){
            return;
        }
        if(!data?.fileServer){
            return toast.error('Conteúdo indisponível!')
        }
        const controller = new AbortController();
        
        setLoading(true);
        axios.get(`http://edevappsserver.ddns.net:5000/teste`, {signal: controller.signal})
        .then(res => {
            navigate(`/content/player/${data?.fileServer}`);
            setLoading(false);
            api.put('/content/play', {
                contentId: contentData?.id
            })
        })
        .catch(err => {
            toast.warn('Serviço de streaming indisponível no momento. Tente novamente mais tarde!')
            setLoading(false);
        })
        
        setTimeout(() => controller.abort(), 15000)
    }

    return(
        <div className="p-2 rounded-md bg-[#0a4303] flex flex-col">
            <div className="flex gap-2">
                <div className="relative flex">
                    <img
                        src={data?.postUrl}
                        className="w-[120px] h-[200px] object-cover rounded-md border border-white"
                    />

                    <button className="w-full h-full bg-black/80 rounded-md flex items-center justify-center absolute" onClick={play}>
                        {loading ? (
                            <ActivityIndicator size={40}/>
                        ) : (
                            <MdOutlinePlayCircle size={50} color='white'/>
                        )}
                    </button>
                </div>

                <div className="w-[150px]">
                    <p className="font-bold text-white">{data?.numberEp} - {data?.title}</p>
                    <p className="text-white text-sm text-ellipsis overflow-hidden truncate">{data?.description}</p>
                </div>
            </div>

            <ToastContainer/>
        </div>
    )
}