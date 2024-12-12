import React, { useEffect, useState } from "react";
import { getImage } from "../../../../services/getImage";
import { ActivityIndicator } from "../../../../components/ActivityIndicator/ActivityIndicator";
import { useTranslation } from "react-i18next";

export function PubliUser({ data }) {
    const {t} = useTranslation()
    const imagesPubli = JSON.parse(data?.images);
    const [seeMore, setSeeMore] = useState(false);
    const [loadingImages, setLoadingImages] = useState(false);
    const [images, setImages] = useState([]);
    const [links, setLinks] = useState([]);

    useEffect(() => {
        if (imagesPubli.length > 0) {
            getImages();
        }
        verifyLinks(data?.description);
    }, []);

    async function getImages() {
        let newArray = [];
        setLoadingImages(true);

        for (var i = 0; i < imagesPubli.length; i++) {
            if(String(imagesPubli[i]).includes('https://')){
                newArray.push(imagesPubli[i])
            }else{
                const response = await getImage(imagesPubli[i]);
                newArray.push(response);
            }
        }

        setImages(newArray);
        setLoadingImages(false);
    }

    function verifyLinks(text) {
        const regex = /(https?:\/\/[^\s]+)/g;

        const match = String(text).match(regex);
        if (match) {
            const verifyLinks = links.filter(item => item === match);
            if(verifyLinks.length === 0){
                links.push(match);
            }
        }
    }

    return (
        <div className="flex flex-col">
            {seeMore ? (
                <p className="text-white break-words">{data?.description}</p>
            ) : (
                <p className="description-publi">{data?.description}</p>
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
                <div className={`flex w-[${window.screen.width - 25}px] h-[${window.screen.width}px] lg:h-[600px] max-h-[600px]`}>
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

                </div>
            )}

            {links.length > 0 && (
                <div className="flex flex-col mt-3">
                    <p className="text-xs text-gray-300">
                        {t('linkNessaPubli')}
                    </p>
                    <div className="flex gap-3 overflow-x-auto">
                        {links.map(item => (
                            <a
                                key={item}
                                className="px-2 py-1 max-w-[300px] bg-green-600 border border-green-700 rounded-md"
                                href={item}
                                target="_blank"
                            >
                                <p className="text-ellipsis text-white text-xs overflow-hidden truncate">{item}</p>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}