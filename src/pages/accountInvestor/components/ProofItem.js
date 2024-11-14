import React, {useEffect, useState} from "react";
import { getImage } from "../../../services/getImage";
import { ActivityIndicator } from "../../../components/ActivityIndicator/ActivityIndicator";

export function ProofItem({data, select}){
    const [image, setImage] = useState(null);
    const [modalDetail, setModalDetails] = useState(false);

    useEffect(() => {
        if(data?.images){
            getImagePubli();
        }
    }, []);

    async function getImagePubli(){
        const images = JSON.parse(data?.images);
        const response = await getImage(images[0]);
        setImage(response);
    }

    return(
        <a 
            className="flex rounded-md w-[200px] h-[200px] bg-gray-200 overflow-hidden border-2 border-white"
            href={`https://app.sintrop.com/publication/${data?.id}`}
            target="_blank"
        >
            {image ? (
                <img
                    src={image}
                    className="w-full h-full object-cover cursor-pointer"
                />
            ) : (
                <div className="flex items-center justify-center w-full h-full">
                    <ActivityIndicator size={25}/>
                </div>
            )}
        </a>
    )
}