import React, {useState, useEffect} from 'react';
import { PointCoord } from './PointCoord';
import { GoogleMap, LoadScript, DrawingManager, Marker, Polyline } from '@react-google-maps/api';
import { useTranslation } from 'react-i18next';
import { PhotoCarrouselItem } from './PhotoCarrouselItem';

const containerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: 8,
};

export function ZoneItem({data}){
    const {t} = useTranslation();
    const [pathZone, setPathZone] = useState([]);
    const [pathSubZone, setPathSubZone] = useState([]);
    useEffect(() => {
        fixPathZones();
        console.log(data.arvores)
    },[]);

    function fixPathZones(){
        const dataZone = [
            data.path[0],
            data.path[1],
            data.path[2],
            data.path[3],
            data.path[0],
        ]
        setPathZone(dataZone)
    }
    
    return(
        <div className="w-full flex flex-col border-b-2 mb-5">
            
            <div className="w-full h-[350px] bg-gray-500">
                    <LoadScript
                        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY}
                    >
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={data.path[0]}
                            zoom={18}
                            mapTypeId='satellite'
                        >
                            {/* <Marker position={position}/> */}
                            <Polyline
                                path={pathZone}
                                options={{
                                    strokeColor: 'red'  
                                }}
                            />  
                        </GoogleMap>
                    </LoadScript>
            </div>

            <h3 className="font-bold text-white text-xl mt-5">Zona 1</h3>

            <div className="flex flex-wrap justify-center w-full gap-4">
                <div className="flex flex-col w-full lg:w-[49%] bg-[#0a4303] rounded p-2">
                    <p className="font-bold text-[#ff9900]">{t('Name')}: <span className="text-white">{data.title}</span></p>
                    <p className="font-bold text-[#ff9900]">{t('Área')}: <span className="text-white">{Number(data.areaZone).toFixed(1)} m²</span></p>
                    <p className="font-bold text-[#ff9900]">{t('Color on the map')}: <span className="text-white">{t('Red')}</span></p>
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
            <div className="flex items-center justify-center flex-wrap gap-3 overflow-auto">
                {data.path.map((item, index) => (
                    <PhotoCarrouselItem
                        data={item}
                    />
                ))}
            </div>
            
            <h4 className="font-bold text-white text-xl mt-5">{t('Sampling')} - {Number(data.areaSubZone).toFixed(0)} m²</h4>
            <div className="w-full flex flex-col gap-5 mt-2 lg:flex-row">
                <div className="flex flex-col gap-3 bg-[#0a4303] rounded-md p-3">
                    <p className="font-bold text-[#ff9900]">{t('Sampling tree analysis')}</p>
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-white">Árvores Mudas:</p>
                        <p className="font-bold text-[#ff9900]">{data.arvores[0].value}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-white">Árvores Jovens:</p>
                        <p className="font-bold text-[#ff9900]">{data.arvores[1].value}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-white">Árvores Adultas:</p>
                        <p className="font-bold text-[#ff9900]">{data.arvores[2].value}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-white">Árvores Anciâs:</p>
                        <p className="font-bold text-[#ff9900]">{data.arvores[3].value}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 bg-[#0a4303] rounded-md p-3">
                    <p className="font-bold text-[#ff9900]">{t('Estimate of trees for the zone')} - {Number(data.areaZone).toFixed(0)} m²</p>
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-white">Árvores Mudas:</p>
                        <p className="font-bold text-[#ff9900]">{((Number(data.arvores[0].value) / Number(data.areaSubZone)) * Number(data.areaZone)).toFixed(0)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-white">Árvores Jovens:</p>
                        <p className="font-bold text-[#ff9900]">{((Number(data.arvores[1].value) / Number(data.areaSubZone)) * Number(data.areaZone)).toFixed(0)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-white">Árvores Adultas:</p>
                        <p className="font-bold text-[#ff9900]">{((Number(data.arvores[2].value) / Number(data.areaSubZone)) * Number(data.areaZone)).toFixed(0)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-white">Árvores Anciâs:</p>
                        <p className="font-bold text-[#ff9900]">{((Number(data.arvores[3].value) / Number(data.areaSubZone)) * Number(data.areaZone)).toFixed(0)}</p>
                    </div>
                    
                </div>      
            </div>

            <h4 className="font-bold text-white text-xl mt-5">{t('Soil analysis')}</h4>
            <div className="flex items-center flex-wrap justify-center gap-3 overflow-auto mt-1">
                {data.analiseSolo.map(item => (
                    <PhotoCarrouselItem
                        data={item}
                    />
                ))}
            </div>
        </div>
    )
}