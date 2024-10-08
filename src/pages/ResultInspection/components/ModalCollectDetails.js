import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { FaMapMarker } from "react-icons/fa";
import { ImageItem } from "./ImageItem";
import ReactMapGL, { Layer, Marker, Source } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export function ModalCollectDetails({ close, data }) {
    const [mapCollect, setMapCollect] = useState(null);

    useEffect(() => {
        setMapCollect({latitude: data?.coord?.lat, longitude: data?.coord?.lng})
    }, []);

    return (
        <div className='flex justify-center items-center inset-0'>
            <div className='bg-[rgba(0,0,0,0.6)] fixed inset-0'>
                <div className='absolute flex flex-col p-3 lg:w-[540px] h-[500px] bg-[#03364D] rounded-md m-auto inset-0 border-2'>
                    <div className="flex items-center justify-between w-full">
                        <div className="w-[25px]" />

                        <p className="font-bold text-white">Detalhes da coleta</p>

                        <button onClick={close}>
                            <MdClose size={25} color='white' />
                        </button>
                    </div>

                    <div className="flex flex-col overflow-y-auto mt-2">
                        {mapCollect && (
                            <ReactMapGL
                                style={{ width: '100%', height: 200 }}
                                mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
                                mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESSTOKEN}
                                latitude={mapCollect?.latitude}
                                longitude={mapCollect?.longitude}
                                onDrag={(e) => {
                                    setMapCollect({ latitude: e.viewState.latitude, longitude: e.viewState.longitude })
                                }}
                                minZoom={14}
                                maxZoom={20}
                            >
                                <Marker
                                    latitude={data?.coordRef?.lat}
                                    longitude={data?.coordRef?.lng}
                                    color="red"
                                />

                                <Marker
                                    latitude={data?.coord?.lat}
                                    longitude={data?.coord?.lng}
                                    color="yellow"
                                />
                            </ReactMapGL>
                        )}
                        <div className="flex items-center gap-1 mt-1">
                            <FaMapMarker color='red' size={20} />
                            <p className="text-white text-xs">Local escolhido pelo sistema para coleta</p>
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                            <FaMapMarker color='yellow' size={20} />
                            <p className="text-white text-xs">Local da coleta feita pelo inspetor</p>
                        </div>

                        <p className="font-bold text-white mt-5 text-center">Dados</p>
                        <p className="text-white mt-1">Local escolhido pelo sistema: </p>
                        <span className="text-green-500 mt-[-5px]">Latitude: {data?.coordRef?.lat}, Longitude: {data?.coordRef?.lng}</span>

                        <p className="text-white mt-3">Local da coleta feita: </p>
                        <span className="text-green-500 mt-[-5px]">Latitude: {data?.coord?.lat}, Longitude: {data?.coord?.lng}</span>

                        <p className="text-white mt-3">Dado coletado:</p>
                        <span className="text-green-500 mt-[-5px]">
                            {data?.coordRef?.type === 'biomass' && `Biomassa registrada: ${data?.value} kg`}
                            {data?.coordRef?.type === 'bio-soil' && `Espécies vistas: ${data?.value}`}
                        </span>

                        <p className="font-bold text-white mt-5 mb-1 text-center">
                            {data?.coordRef?.type === 'biomass' && `Imagens registradas`}
                            {data?.coordRef?.type === 'bio-soil' && `Imagens registradas`}
                        </p>

                        {data?.coordRef?.type === 'biomass' && (
                            <>
                                <p className="text-white">Imagens amplas do local</p>

                                <div className="flex flex-wrap justify-center gap-3">
                                    <ImageItem
                                        src={data?.addPhoto1}
                                    />

                                    <ImageItem
                                        src={data?.addPhoto2}
                                    />
                                </div>

                                <p className="text-white mt-5">Imagem da coleta</p>
                                <div className="flex flex-wrap justify-center gap-3">
                                    <ImageItem
                                        src={data?.photo}
                                    />
                                </div>
                            </>
                        )}

                        {data?.coordRef?.type === 'bio-soil' && (
                            <>
                                <p className="text-white mt-1">Imagem da coleta</p>
                                <div className="flex flex-wrap justify-center gap-3">
                                    <ImageItem
                                        src={data?.photo}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}