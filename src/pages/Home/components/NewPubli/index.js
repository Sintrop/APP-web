import React, {useEffect, useState} from "react";
import { toast } from "react-toastify";
import {useMainContext} from '../../../../hooks/useMainContext';
import { api } from "../../../../services/api";
import {ActivityIndicator} from '../../../../components/ActivityIndicator';
import { CropImage } from "../../../../components/CropImage";
import { MdFactCheck, MdOutlinePhoto } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";

export function NewPubli({attPublis}){
    const {userData} = useMainContext();
    const [loading, setLoading] = useState(false)
    const [input, setInput] = useState('');
    const [cropImage, setCropImage] = useState(false);
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null);
    const [hashImage, setHashImage] = useState(null)

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
        if(image){
            imagesPubli.push(hashImage);
        }

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
            setImage(null);
            setInput('');
            attPublis();
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    function openFolderSelect(){
        const intpuFile = document.querySelector('#input-file');
        intpuFile.click();
    }

    return(
        <div className="p-2 rounded-md bg-[#11652E] flex flex-col w-full lg:max-h-[300px]">
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

            {image && (
                <div className="flex w-[150px] h-[150px] relative ">
                    <img
                        src={image}
                        className="w-[150px] h-[150px] rounded-md object-cover mt-2"
                    />

                    <button
                        className="absolute top-2 right-1"
                        onClick={() => setImage(null)}
                    >
                        <IoIosCloseCircle color='#ddd' size={25}/>
                    </button>
                </div>
            )}

            <div className="flex gap-2 w-full justify-between mt-2">
                <div>
                    <button id='btn-choose-file' onClick={openFolderSelect}>
                        <MdOutlinePhoto size={25} color='white'/>
                    </button>
                    <input 
                        type='file' 
                        onChange={(e) => {
                            setFile(e.target.files[0]);
                            setCropImage(true);
                        }}
                        className="hidden w-[100px]"
                        id="input-file"
                    />
                </div>
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

            {cropImage && (
                <CropImage
                    close={() => setCropImage(false)}
                    file={file}
                    returnType='hash'
                    returnUri={(uri, hash) => {
                        setImage(uri);
                        setHashImage(hash);
                        setCropImage(false);
                    }}
                />
            )}
        </div>
    )
}