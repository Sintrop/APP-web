import React, { useEffect, useState } from "react";
import { getImage } from "../../../../services/getImage";
import { Blocks } from 'react-loader-spinner';
import { ActivityIndicator } from "../../../../components/ActivityIndicator";

export function ProofReduce({ data }) {
    const additionalData = JSON.parse(data?.additionalData);
    const imagesPubli = JSON.parse(data?.images);
    const [seeMore, setSeeMore] = useState(false);
    const [loadingImages, setLoadingImages] = useState(false);
    const [images, setImages] = useState([]);

    useEffect(() => {
        if (imagesPubli.length > 0) {
            getImages();
        }
    }, []);

    async function getImages() {
        let newArray = [];
        setLoadingImages(true);

        for (var i = 0; i < imagesPubli.length; i++) {
            const response = await getImage(imagesPubli[i]);
            newArray.push(response);
        }

        setImages(newArray);
        setLoadingImages(false);
    }

    return (
        <div className="flex flex-col">
            {seeMore ? (
                <p className="text-white text-sm">{data?.description}</p>
            ) : (
                <p className="text-white text-sm text-ellipsis overflow-hidden truncate">{data?.description}</p>
            )}

            <div className="flex justify-start">
                {data?.description.length > 100 && (
                    <button
                        onClick={() => setSeeMore(!seeMore)}
                        className="text-gray-400 text-sm"
                    >
                        {seeMore ? 'Ver menos' : 'Ver mais'}
                    </button>
                )}
            </div>

            {imagesPubli.length > 0 && (
                <div className={`flex w-[${window.screen.width - 25}px] h-[${window.screen.width}px] lg:h-[600px] max-h-[600px] border-[10px] rounded-md border-green-500 relative`}>
                    {loadingImages ? (
                        <div className="flex items-center justify-center w-full h-full">
                            <ActivityIndicator size={50} />
                        </div>
                    ) : (
                        <>
                            {images.length < 2 ? (
                                <img
                                    src={images[0]}
                                    className="w-full h-full max-h-[600px] object-cover"
                                />
                            ) : (
                                <div className="flex gap-2 overflow-x-auto">
                                    {images.map((item, index) => (
                                        <>
                                            <img
                                                src={item}
                                                key={item}
                                                className={`w-[${window.screen.width - 25}px] h-[${window.screen.width}px] lg:h-[600px] max-h-[600px] object-cover`}
                                            />
                                            <div className="px-2 py-1 rounded-lg bg-gray-500 relative top-2 right-2 h-fit ml-[-40px]">
                                                <p className="font-semibold text-xs text-white">{index + 1}/{images.length}</p>
                                            </div>
                                            
                                        </>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                    <div className="w-full bg-green-500 p-2 absolute bottom-0 h-14 lg:h-20 rounded-t-xl flex items-center">
                        <div className="flex flex-col">
                            <p className="font-bold text-white text-xs lg:text-base">
                                #ReduzirÉObrigaçãoRegenerarÉASolução
                            </p>
                            <p className="font-regular text-white text-xs lg:text-base">
                                Prova de redução do item {additionalData?.nameItem} da calculadora de impacto.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}