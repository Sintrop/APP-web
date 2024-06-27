import React, { useEffect, useState } from "react";
import ReactMapGL, { Marker } from 'react-map-gl';
import { Polyline } from "../../../components/Mapbox/Polyline";

export function RegenerationZoneProfile({ data }) {
    const [mapZone, setMapZone] = useState(null);
    const [pathZone, setPathZone] = useState([]);

    useEffect(() => {
        setMapZone({ longitude: data?.path[0].lng, latitude: data?.path[0].lat });
        fixCoordinatesZone(data?.path);
    }, []);

    function fixCoordinatesZone(coords) {
        let array = [];
        for (var i = 0; i < coords.length; i++) {
            array.push([coords[i].lng, coords[i].lat]);
        }
        array.push([coords[0].lng, coords[0].lat]);
        setPathZone(array);
    }

    return (
        <div className="flex flex-col w-full rounded-md bg-[#0a4303] overflow-hidden">
            {mapZone && (
                <ReactMapGL
                    style={{ width: '100%', height: 200 }}
                    mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
                    mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESSTOKEN}
                    latitude={mapZone?.latitude}
                    longitude={mapZone?.longitude}
                    onDrag={(e) => {
                        setMapZone({ latitude: e.viewState.latitude, longitude: e.viewState.longitude })
                    }}
                    minZoom={15}
                >
                    <Polyline
                        coordinates={pathZone}
                        lineColor='red'
                        lineWidth={4}
                    />

                    {pathZone.length > 0 && (
                        <>
                            {pathZone.map(item => (
                                <Marker
                                    key={item[0]}
                                    latitude={item[1]}
                                    longitude={item[0]}
                                />
                            ))}
                        </>
                    )}
                </ReactMapGL>
            )}

            <div className="p-3 flex flex-col">
                <p className="font-semibold text-white text-xl">{data?.title}</p>
                <p className="text-white">{Intl.NumberFormat('pt-BR', {maximumFractionDigits: 0}).format(data?.areaZone)} m²</p>
            </div>
        </div>
    )
}