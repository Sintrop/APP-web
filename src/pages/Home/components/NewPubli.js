import React, {useEffect, useState} from "react";
import { toast } from "react-toastify";
import {useMainContext} from '../../../hooks/useMainContext';
import { api } from "../../../services/api";
import {ActivityIndicator} from '../../../components/ActivityIndicator';

export function NewPubli({attPublis}){
    const {userData} = useMainContext();
    const [loading, setLoading] = useState(false)
    const [input, setInput] = useState('');

    async function handlePost(){
        if(loading){
            return;
        }
        if(!input.trim()){
            toast.error('Digite algo para publicar')
            return;
        }

        setLoading(true);
        let imagesPubli = [];

        // if(images.length > 0){
        //     for(var i = 0; i < images.length; i++){
        //         const imageHash = await addPhotoIPFS(images[i]);
        //         imagesPubli.push(imageHash);
        //     }
        // }
        
        let data = {
            userData: userData
        }

        try{
            await api.post('/publication/new', {
                userId: userData.id,
                type: 'publi-user',
                origin: 'mobile',
                description: input,
                images: JSON.stringify(imagesPubli),
                additionalData: JSON.stringify(data)
            });
            setInput('');
            attPublis();
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    return(
        <div className="p-2 rounded-md bg-[#0a4303] flex flex-col max-h-[300px]">
            <div className="flex gap-2 h-full">

                <div className="bg-green-800 p-2 rounded-md w-full max-h-[250px] flex">
                    <textarea
                        className="bg-transparent w-full h-full text-white resize-none focus:outline-none"
                        placeholder="Começar publicação"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex gap-2 w-full justify-end mt-2">
                <button 
                    className="bg-blue-600 rounded-md text-white font-bold text-sm w-20 h-8"
                    onClick={handlePost}
                >
                    {loading ? (
                        <ActivityIndicator size={25}/>
                    ) : 
                        'Publicar'
                    }
                </button>
            </div>
        </div>
    )
}