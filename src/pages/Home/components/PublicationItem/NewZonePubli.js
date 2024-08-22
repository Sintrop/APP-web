import React, { useEffect, useState } from 'react';
import ReactMapGL, { Layer, Marker, Source } from 'react-map-gl';
import { Polyline } from '../../../../components/Mapbox/Polyline';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTranslation } from 'react-i18next';

export function NewZonePubli({ data }) {
    const {t} = useTranslation();
    const addData = JSON.parse(data?.additionalData);
    const [pathPolyline, setPathPolyline] = useState([]);
    const [mapProperty, setMapProperty] = useState(null);

    useEffect(() => {
        createPath()
    }, []);

    function createPath() {
        const path = addData?.pathZone;
        let array = [];
        for (var i = 0; i < path.length; i++) {
            array.push([path[i].lng, path[i].lat]);
        }
        array.push([path[0].lng, path[0].lat]);
        setMapProperty({latitude: path[0].lat, longitude: path[0].lng})
        setPathPolyline(array)
    }

    return (
        <div>
            <p className='text-white'>
                {t('cadastrouNovaZona')}
            </p>

            {pathPolyline.length > 0 && (
                <ReactMapGL
                    style={{ width: '100%', height: 120, marginTop: 10 }}
                    mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
                    mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESSTOKEN}
                    latitude={mapProperty?.latitude}
                    longitude={mapProperty?.longitude}
                    onDrag={(e) => {
                        setMapProperty({ latitude: e.viewState.latitude, longitude: e.viewState.longitude })
                    }}
                    minZoom={16}
                >
                    <Polyline
                        coordinates={pathPolyline}
                        lineColor='yellow'
                        lineWidth={4}
                    />
                </ReactMapGL>
            )}
            
            <div className='flex items-center gap-2 mt-1'>
                <div className="w-5 h-1 rounded-md bg-yellow-300" />
                <p className='text-xs text-gray-300'>{t('zona')}</p>
            </div>

            <p className='text-white text-sm'>{t('nome')}: <span className='font-bold'> {addData?.titleZone}</span></p>
            <p className='text-white text-sm'>{t('area')}: <span className='font-bold'> {Intl.NumberFormat('pt-BR', {maximumFractionDigits: 0}).format(addData?.areaZone)} m²</span></p>
        </div>
    )
}