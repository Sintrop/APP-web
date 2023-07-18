import React, {useState, useEffect} from 'react';
import { PointCoord } from './PointCoord';
import { GoogleMap, LoadScript, DrawingManager, Marker, Polyline } from '@react-google-maps/api';

const containerStyle = {
    width: '300px',
    height: '250px',
    borderRadius: 8,
};

export function ZoneItem({data}){
    //console.log(data)
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
        const dataSubZone = [
            data.subZone[0],
            data.subZone[1],
            data.subZone[2],
            data.subZone[3],
            data.subZone[0],
        ]
        setPathSubZone(dataSubZone)
        setPathZone(dataZone)
    }
    
    return(
        <div className="w-full flex flex-col border-b-2 mb-5">
            <div className="w-full justify-center flex flex-col gap-3 lg:flex-row lg:justify-between">
                <div className="flex flex-col gap-2 ">
                    <p className="font-bold text-[#ff9900] text-lg">{data.title}</p>
                    {data.path.map(item => (
                        <PointCoord
                            data={item}
                            zones
                        />
                    ))}
                </div>
                
                <div className="w-[300px] h-[250px] bg-gray-500">
                    <LoadScript
                        googleMapsApiKey='AIzaSyCqCzu0lAn29w7h5y4KF4DwrD2hYDn11M4'
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

                            <Polyline
                                path={pathSubZone}
                                options={{
                                    strokeColor: 'blue'  
                                }}
                            />  
                        </GoogleMap>
                    </LoadScript>
                </div>
            </div>

            <div className="w-full justify-center flex flex-col gap-5 mt-2 lg:flex-row">
                <div className="flex flex-col gap-2 ">
                    <p className="font-bold text-[#ff9900] text-lg">Sub Zona</p>
                    {data.subZone.map(item => (
                        <PointCoord
                            data={item}
                            zones
                        />
                    ))}
                </div>
                <div className="flex flex-col gap-3 border-2 border-green-950 rounded-md p-3">
                    <p className="font-bold text-[#ff9900]">Análise de solo da zona</p>
                    {data.analiseSolo.map(item => (
                        <PointCoord
                            data={item}
                            analiseSolo
                        />
                    ))}
                </div>

                <div className="flex flex-col gap-3 border-2 border-green-950 rounded-md p-3">
                    <p className="font-bold text-[#ff9900]">Análise de árvores da sub-zona</p>
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-[#ff9900]">Árvores Mudas:</p>
                        <p className="font-bold text-white">{data.arvores[0].value}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-[#ff9900]">Árvores Jovens:</p>
                        <p className="font-bold text-white">{data.arvores[1].value}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-[#ff9900]">Árvores Adultas:</p>
                        <p className="font-bold text-white">{data.arvores[2].value}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-[#ff9900]">Árvores Anciâs:</p>
                        <p className="font-bold text-white">{data.arvores[3].value}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-[#ff9900]">Biodiversidade de Árvores:</p>
                        <p className="font-bold text-white">{data.arvores[4].value}</p>
                    </div>
                </div>         
            </div>
        </div>
    )
}