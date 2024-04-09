import React, { useEffect, useState } from "react";
import { getImage } from "../../../services/getImage";
import { Blocks } from 'react-loader-spinner';

export function PubliUser({ data }) {
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
                <div className={`flex w-full h-[${window.screen.width}px] lg:h-[600px] `}>
                    {loadingImages && (
                        <div className="flex items-center justify-center w-full h-full">
                            <Blocks
                                height="40"
                                width="40"
                                color="#4fa94d"
                                ariaLabel="blocks-loading"
                                wrapperStyle={{}}
                                wrapperClass="blocks-wrapper"
                                visible={true}
                            />
                        </div>
                    )}

                    <img
                        src={images[0]}
                        className="w-full h-full object-contain"
                    />
                </div>
            )}
        </div>
    )
}