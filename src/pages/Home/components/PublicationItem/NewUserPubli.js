import React, { useEffect, useState } from 'react';
import ReactMapGL, { Layer, Marker, Source } from 'react-map-gl';
import { Polyline } from '../../../../components/Mapbox/Polyline';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTranslation } from 'react-i18next';

export function NewUserPubli({ userData }) {
    const { t } = useTranslation();
    const [pathPolyline, setPathPolyline] = useState([]);
    const [mapProperty, setMapProperty] = useState(null);

    useEffect(() => {
        if (userData?.userType === 1) {
            createPath();
        }
    }, [userData]);

    function createPath() {
        const path = JSON.parse(userData?.propertyGeolocation);
        let array = [];
        for (var i = 0; i < path.length; i++) {
            array.push([path[i].longitude, path[i].latitude]);
        }
        array.push([path[0].longitude, path[0].latitude]);
        setMapProperty({ latitude: path[0].latitude, longitude: path[0].longitude })
        setPathPolyline(array)
    }

    return (
        <div>
            <p className='text-white'>
                {t('oUsuario')} <span className='font-bold text-green-600'>{userData?.name} </span>
                se cadastrou como
                <span className='font-bold text-green-600'>
                    {userData?.userType === 1 && ` ${t('textProdutor')} `}
                    {userData?.userType === 2 && ` ${t('textInspetor')} `}
                    {userData?.userType === 3 && ` ${t('textPesquisador')} `}
                    {userData?.userType === 4 && ` ${t('textDesenvolvedor')} `}
                    {userData?.userType === 5 && ` ${t('textContribuidor')} `}
                    {userData?.userType === 6 && ` ${t('textAtivista')} `}
                    {userData?.userType === 7 && ` ${t('textApoiador')} `}
                    {userData?.userType === 8 && ` ${t('textValidador')} `}
                </span>
                {t('textVersao6')}
            </p>

            {userData?.userType === 1 && (
                <>
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
                </>
            )}
        </div>
    )
}