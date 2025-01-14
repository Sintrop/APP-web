import React, { useEffect, useState } from "react";
import { BlockchainUserDataProps } from "../../../../services/userDetails/userDetailsPage";
import { UserApiProps } from "../../../../types/user";
import { useTranslation } from "react-i18next";
import { getImage } from "../../../../services/getImage";

interface Props {
    userType: number;
    blockchainData: BlockchainUserDataProps;
    userApi: UserApiProps;
    wallet: string;
}
export function DataTab({ userApi, blockchainData, userType }: Props) {
    const { t } = useTranslation();
    const [proofPhoto, setProofPhoto] = useState('');

    useEffect(() => {
        //@ts-ignore
        if(blockchainData?.proofPhoto){
            //@ts-ignore
            getProofPhoto(blockchainData?.proofPhoto)
        }
    }, []);

    async function getProofPhoto(hash: string) {
        const response = await getImage(hash);
        setProofPhoto(response);
    }

    return (
        <div className="mt-5 flex flex-col w-full">
            {userType === 1 && blockchainData.userType === userType && (
                <div className='flex flex-col w-full gap-5 lg:gap-5 lg:px-30 bg-[#03364B] rounded-md p-3'>
                    <h3 className='font-bold text-white text-center lg:text-left lg:text-lg'>{t('statsProdutor')}</h3>

                    <div className='flex items-center justify-center flex-wrap gap-5 mt-5'>
                        <div className='flex flex-col items-center gap-1 min-w-[100px] lg:min-w-[150px]'>
                            <p className='font-bold text-white text-xl lg:text-3xl'>{blockchainData?.totalInspections} </p>
                            <p className='text-white text-xs lg:text-base'>{t('ispsRecebidas')}</p>
                        </div>

                        <div className='flex flex-col items-center gap-1 min-w-[100px] lg:min-w-[150px]'>
                            <p className='font-bold text-white text-xl lg:text-3xl'>{blockchainData?.regenerationScore?.score}</p>
                            <p className='text-white text-xs lg:text-base'>{t('pts')}</p>
                        </div>

                        <div className='flex flex-col items-center gap-1 min-w-[100px] lg:min-w-[150px]'>
                            <p className='font-bold text-white text-xl lg:text-3xl'>{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(blockchainData?.regenerationScore?.score / blockchainData?.totalInspections)}</p>
                            <p className='text-white text-xs lg:text-base'>{t('media')}</p>
                        </div>

                        <div className='flex flex-col items-center gap-1 min-w-[100px] lg:min-w-[150px]'>
                            <p className='font-bold text-white text-xl lg:text-3xl'>0</p>
                            <p className='text-red-500 text-xs lg:text-base'>{t('denunciasRecebidas')}</p>
                        </div>
                    </div>

                    {/* <ProducerGraphics inspections={inspections} /> */}
                </div>
            )}

            <div className="flex items-center flex-col gap-4 mt-2 w-full">
                <div className="p-2 rounded-md flex flex-col items-center bg-[#03364B] gap-2 w-full lg:flex-row lg:items-start">
                    <div className="flex flex-col">
                        <div className="w-[200px] h-[200px] rounded-md bg-gray-400">
                            {proofPhoto !== '' && (
                                <img
                                    src={proofPhoto}
                                    className="w-[200px] h-[200px] rounded-md object-cover border-2 border-white"
                                    alt="proof"
                                />
                            )}
                        </div>
                        <p className="text-xs text-center text-gray-400 mb-1">{t('fotoProva')}</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        {/* <p className="text-white font-bold text-xs lg:text-sm">{t('entrouComunidade')}: <span className="font-normal">{format(new Date(createdAt), 'dd/MM/yyyy')}</span></p> */}

                        {userType === 1 && blockchainData.userType === userType && (
                            <>
                                <p className="text-white font-bold text-xs lg:text-sm">{t('areaPropriedade')}:
                                    <span className="font-normal"> {Intl.NumberFormat('pt-BR').format(blockchainData?.areaInformation.totalArea)} m²</span>
                                </p>
                                <p className="text-white font-bold text-xs lg:text-sm">{t('totalIsps')}: <span className="font-normal">{blockchainData?.totalInspections}</span></p>
                                <p className="text-white font-bold text-xs lg:text-sm">{t('ptsRegen')}: <span className="font-normal">{blockchainData?.regenerationScore?.score} pts</span></p>
                                <p className="text-white font-bold text-xs lg:text-sm">{t('eraAtualNaPool')}: <span className="font-normal">{blockchainData?.pool?.currentEra}</span></p>
                                <p className="text-white font-bold text-xs lg:text-sm">{t('hashFotoProva')}: <span className="font-normal">{blockchainData?.proofPhoto}</span></p>
                                <p className="text-white font-bold text-xs lg:text-sm">User type: <span className="font-normal">{blockchainData?.userType}</span></p>
                            </>
                        )}

                        {userType === 2 && blockchainData.userType === userType && (
                            <>
                                <p className="text-white font-bold text-xs lg:text-sm">{t('totalIsps')}: <span className="font-normal">{blockchainData?.totalInspections}</span></p>
                                <p className="text-white font-bold text-xs lg:text-sm">{t('desistencias')}: <span className="font-normal">{blockchainData?.giveUps}</span></p>
                                {/* <p className="text-white font-bold text-xs lg:text-sm">{t('convidadoPor')}: <span className="font-normal">{blockchainData?.invite?.inviter}</span></p> */}
                                <p className="text-white font-bold text-xs lg:text-sm">{t('eraAtualNaPool')}: <span className="font-normal">{blockchainData?.pool?.currentEra}</span></p>
                                <p className="text-white font-bold text-xs lg:text-sm">{t('hashFotoProva')}: <span className="font-normal">{blockchainData?.proofPhoto}</span></p>
                                <p className="text-white font-bold text-xs lg:text-sm">User type: <span className="font-normal">{blockchainData?.userType}</span></p>
                            </>
                        )}

                        {userType === 3 && blockchainData.userType === userType && (
                            <>
                                <p className="text-white font-bold text-xs lg:text-sm">{t('pesquisasPublicadas')}: <span className="font-normal">{blockchainData?.publishedWorks}</span></p>
                                {/* <p className="text-white font-bold text-xs lg:text-sm">{t('convidadoPor')}: <span className="font-normal">{blockchainData?.invite?.inviter}</span></p> */}
                                <p className="text-white font-bold text-xs lg:text-sm">{t('eraAtualNaPool')}: <span className="font-normal">{blockchainData?.pool?.currentEra}</span></p>
                                <p className="text-white font-bold text-xs lg:text-sm">{t('hashFotoProva')}: <span className="font-normal">{blockchainData?.proofPhoto}</span></p>
                                <p className="text-white font-bold text-xs lg:text-sm">User type: <span className="font-normal">{blockchainData?.userType}</span></p>
                            </>
                        )}

                        {userType === 4 && blockchainData.userType === userType && (
                            <>
                                <p className="text-white font-bold text-xs lg:text-sm">{t('nivel')}: <span className="font-normal">{blockchainData?.pool?.level}</span></p>
                                {/* <p className="text-white font-bold text-xs lg:text-sm">{t('convidadoPor')}: <span className="font-normal">{blockchainData?.invite?.inviter}</span></p> */}
                                <p className="text-white font-bold text-xs lg:text-sm">{t('eraAtualNaPool')}: <span className="font-normal">{blockchainData?.pool?.currentEra}</span></p>
                                <p className="text-white font-bold text-xs lg:text-sm">{t('hashFotoProva')}: <span className="font-normal">{blockchainData?.proofPhoto}</span></p>
                                <p className="text-white font-bold text-xs lg:text-sm">User type: <span className="font-normal">{blockchainData?.userType}</span></p>
                            </>
                        )}

                        {userType === 5 && blockchainData.userType === userType && (
                            <>
                                <p className="text-white font-bold text-xs lg:text-sm">{t('nivel')}: <span className="font-normal">{blockchainData?.pool?.level}</span></p>
                                {/* <p className="text-white font-bold text-xs lg:text-sm">{t('convidadoPor')}: <span className="font-normal">{blockchainData?.invite?.inviter}</span></p> */}
                                <p className="text-white font-bold text-xs lg:text-sm">{t('eraAtualNaPool')}: <span className="font-normal">{blockchainData?.pool?.currentEra}</span></p>
                                <p className="text-white font-bold text-xs lg:text-sm">{t('hashFotoProva')}: <span className="font-normal">{blockchainData?.proofPhoto}</span></p>
                                <p className="text-white font-bold text-xs lg:text-sm">User type: <span className="font-normal">{blockchainData?.userType}</span></p>
                            </>
                        )}

                        {userType === 6 && blockchainData.userType === userType && (
                            <>
                                {/* <p className="text-white font-bold text-xs lg:text-sm">{t('convidadoPor')}: <span className="font-normal">{blockchainData?.invite?.inviter}</span></p> */}
                                <p className="text-white font-bold text-xs lg:text-sm">{t('eraAtualNaPool')}: <span className="font-normal">{blockchainData?.pool?.currentEra}</span></p>
                                <p className="text-white font-bold text-xs lg:text-sm">{t('hashFotoProva')}: <span className="font-normal">{blockchainData?.proofPhoto}</span></p>
                                <p className="text-white font-bold text-xs lg:text-sm">User type: <span className="font-normal">{blockchainData?.userType}</span></p>
                            </>
                        )}

                        {userType === 7 && blockchainData.userType === userType && (
                            <>
                                {/* <p className="text-white font-bold text-xs lg:text-sm">{t('convidadoPor')}: <span className="font-normal">{blockchainData?.invite?.inviter}</span></p> */}
                                <p className="text-white font-bold text-xs lg:text-sm">User type: <span className="font-normal">{blockchainData?.userType}</span></p>
                            </>
                        )}
                    </div>
                </div>

                {/* {userType === 1 && (
                    <>
                        <div className="p-2 rounded-md bg-[#03364B] gap-2 w-full flex flex-col">
                            <p className="text-xs text-center text-gray-400 mb-1">{t('mapaPropriedade')}</p>

                            <div className="flex items-center justify-center bg-gray-400 rounded-md w-full h-[300px]">
                                <ReactMapGL
                                    style={{ width: '100%', height: '100%' }}
                                    mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
                                    mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESSTOKEN}
                                    latitude={mapProperty?.latitude}
                                    longitude={mapProperty?.longitude}
                                    onDrag={(e) => {
                                        setMapProperty({ latitude: e.viewState.latitude, longitude: e.viewState.longitude })
                                    }}
                                    minZoom={12}
                                >
                                    <Marker latitude={initialRegion?.latitude} longitude={initialRegion?.longitude} color="red" />

                                    <Polyline
                                        coordinates={pathProperty}
                                        lineColor='yellow'
                                        lineWidth={4}
                                    />
                                </ReactMapGL>
                            </div>
                        </div>
                    </>
                )} */}
            </div>
        </div>
    )
}