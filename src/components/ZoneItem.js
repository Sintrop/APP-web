import React, {useState, useEffect} from 'react';
import { PointCoord } from './PointCoord';
import { GoogleMap, LoadScript, DrawingManager, Marker, Polyline } from '@react-google-maps/api';
import { useTranslation } from 'react-i18next';
import { PhotoCarrouselItem } from './PhotoCarrouselItem';
import * as Dialog from '@radix-ui/react-dialog';
import { ModalViewPhoto } from './ModalViewPhoto';

const containerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: 8,
};

export function ZoneItem({data, index}){
    const {t} = useTranslation();
    const [pathZone, setPathZone] = useState([]);
    const [pathSubZone, setPathSubZone] = useState([]);
    const [modalViewPhoto, setModalViewPhoto] = useState(false);
    const [hashSelected, setHashSelected] = useState('');
    const [color, setColor] = useState('Red')

    useEffect(() => {
        fixPathZones();
        if(index === 0){
            setColor('Red');
        }
        if(index === 1){
            setColor('Green');
        }
        if(index === 2){
            setColor('Blue');
        }
        if(index === 3){
            setColor('Yellow');
        }
        if(index === 4){
            setColor('Purple');
        }
    },[]);

    function fixPathZones(){
        const coords = data.path;
        let newArrayCoords = [];
        for(var i = 0; i < coords.length; i++){
            newArrayCoords.push(coords[i]);
        }
        newArrayCoords.push(data.path[0])
        setPathZone(newArrayCoords)
    }
    
    return(
        <div className="w-full flex flex-col border-b-2 mb-2 pb-2 rounded-b-md">
            <h3 className="font-bold text-white text-xl">Detalhes da zona</h3>

            <div className="flex flex-wrap justify-center w-full gap-4">
                <div className="flex flex-col w-full lg:w-[49%] bg-[#0a4303] rounded p-2">
                    <p className="font-bold text-[#ff9900]">{t('Name')}: <span className="text-white">{data.title}</span></p>
                    <p className="font-bold text-[#ff9900]">{t('Área')}: <span className="text-white">{Number(data.areaZone).toFixed(1)} m²</span></p>
                    <p className="font-bold text-[#ff9900]">{t('Color on the map')}: <span className="text-white">{t(`${color}`)}</span></p>
                    <div className='flex items-center gap-2'>
                        <img src={require('../assets/icon-arvore.png')}/>
                        <p className='text-white font-bold'>{t('Registered trees')}</p>
                    </div>
                </div>
                
                <div className="flex flex-col lg:w-[49%] bg-[#0a4303] rounded p-2">
                    <h4 className="font-bold text-[#ff9900]">{t('Zone points')}</h4>
                    {data.path.map((item, index) => (
                        <p className=" text-white">
                            {t('Point')} {index + 1} | Lat: {item.lat}, Lng: {item.lng};
                        </p>
                    ))}
                </div>
            </div>
            
            <h4 className="font-bold text-white text-xl mt-5">{t('Photos of the zone')}</h4>
            <div className="flex items-center flex-wrap gap-3 overflow-auto">
                {data.path.map((item, index) => (
                    <PhotoCarrouselItem
                        data={item}
                        click={(hash) => {
                            setHashSelected(hash, item);
                            setModalViewPhoto(true)
                        }}
                    />
                ))}
            </div>
            
            <h4 className="font-bold text-white text-xl mt-5">{t('Sampling')} 1 - {Number(data.arvores?.sampling1?.area).toFixed(0)} m²</h4>
            <div className="w-full flex flex-col gap-5 mt-2 lg:flex-row">
                <div className="flex flex-col gap-3 bg-[#0a4303] rounded-md p-3">
                    <p className="font-bold text-[#ff9900]">{t('Sampling tree analysis')}</p>
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-white">{t('Registered trees')}:</p>
                        <p className="font-bold text-[#ff9900]">{data.arvores?.sampling1?.trees.length}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 bg-[#0a4303] rounded-md p-3">
                    <p className="font-bold text-[#ff9900]">{t('Estimate of trees for the zone')} - {Number(data.areaZone).toFixed(0)} m²</p>
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-white">{t('Estimated total')}:</p>
                        <p className="font-bold text-[#ff9900]">{(Number(data.areaZone) * (Number(data.arvores?.sampling1?.trees.length) / Number(data.arvores?.sampling1?.area))).toFixed(0)}</p>
                    </div>
                </div>      
            </div>
            <h4 className="font-bold text-white text-xl mt-5">{t('Images')}</h4>
            <div className="flex items-center gap-3 overflow-auto flex-wrap">
                {data.arvores?.sampling1?.trees.map(item => (
                    <PhotoCarrouselItem
                        data={item}
                        click={(hash) => {
                            setHashSelected(hash, item);
                            setModalViewPhoto(true)
                        }}
                    />
                ))}
            </div>

            {data.arvores.sampling2 && (
                <>
                <h4 className="font-bold text-white text-xl mt-5">{t('Sampling')} 2 - {Number(data.arvores?.sampling2?.area).toFixed(0)} m²</h4>
                <div className="w-full flex flex-col gap-5 mt-2 lg:flex-row">
                    <div className="flex flex-col gap-3 bg-[#0a4303] rounded-md p-3">
                        <p className="font-bold text-[#ff9900]">{t('Sampling tree analysis')}</p>
                        <div className="flex items-center gap-2">
                            <p className="font-bold text-white">{t('Registered trees')}:</p>
                            <p className="font-bold text-[#ff9900]">{data.arvores?.sampling2?.trees.length}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 bg-[#0a4303] rounded-md p-3">
                        <p className="font-bold text-[#ff9900]">{t('Estimate of trees for the zone')} - {Number(data.areaZone).toFixed(0)} m²</p>
                        <div className="flex items-center gap-2">
                            <p className="font-bold text-white">{t('Estimated total')}:</p>
                            <p className="font-bold text-[#ff9900]">{(Number(data.areaZone) * (Number(data.arvores?.sampling2?.trees.length) / Number(data.arvores?.sampling2?.area))).toFixed(0)}</p>
                        </div>
                    </div>      
                </div>
                <h4 className="font-bold text-white text-xl mt-5">{t('Images')}</h4>
                <div className="flex items-center gap-3 overflow-auto flex-wrap">
                    {data.arvores?.sampling2?.trees.map(item => (
                        <PhotoCarrouselItem
                            data={item}
                            click={(hash) => {
                                setHashSelected(hash, item);
                                setModalViewPhoto(true)
                            }}
                        />
                    ))}
                </div>
                </>
            )}

            <h4 className="font-bold text-white text-xl mt-5">{t('Soil analysis')}</h4>
            <div className="flex items-center flex-wrap gap-3 overflow-auto mt-1">
                {data.analiseSolo.map(item => (
                    <PhotoCarrouselItem
                        data={item}
                        click={(hash) => {
                            setHashSelected(hash, item);
                            setModalViewPhoto(true)
                        }}
                    />
                ))}
            </div>

            <Dialog.Root
                open={modalViewPhoto}
                onOpenChange={(open) => setModalViewPhoto(open)}
            >
                <ModalViewPhoto
                    close={() => setModalViewPhoto(false)}
                    hash={hashSelected}
                />
            </Dialog.Root>
        </div>
    )
}