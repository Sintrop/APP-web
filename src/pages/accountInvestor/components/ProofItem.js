import React, {useEffect, useState} from "react";
import { getImage } from "../../../services/getImage";
import { ActivityIndicator } from "../../../components/ActivityIndicator";
import { ModalDetailsProof } from "./ModalDetailsProof";

export function ProofItem({data}){
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
        <div className="flex rounded-md w-[200px] h-[200px] bg-gray-200 overflow-hidden">
            {image ? (
                <img
                    src={image}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => setModalDetails(true)}
                />
            ) : (
                <div className="flex items-center justify-center w-full h-full">
                    <ActivityIndicator size={25}/>
                </div>
            )}

            {modalDetail && (
                <ModalDetailsProof
                    close={() => setModalDetails(false)}
                    data={data}
                />
            )}
        </div>
    )
}