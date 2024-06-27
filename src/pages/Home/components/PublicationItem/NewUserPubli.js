import React, { useEffect, useState } from 'react';
import ReactMapGL, { Layer, Marker, Source } from 'react-map-gl';
import { Polyline } from '../../../../components/Mapbox/Polyline';
import 'mapbox-gl/dist/mapbox-gl.css';

export function NewUserPubli({ userData }) {
    const [centerProperty, setCenterProperty] = useState([]);
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
        setMapProperty({latitude: path[0].latitude, longitude: path[0].longitude})
        setPathPolyline(array)
    }

    return (
        <div>
            <p className='text-white'>
                O(a) usuário(a) <span className='font-bold text-green-600'>{userData?.name} </span>
                se cadastrou como
                <span className='font-bold text-green-600'>
                    {userData?.userType === 1 && ' Produtor(a) '}
                    {userData?.userType === 2 && ' Inspetor(a) '}
                    {userData?.userType === 3 && ' Pesquisador(a) '}
                    {userData?.userType === 4 && ' Desenvolvedor(a) '}
                    {userData?.userType === 5 && ' Produtor(a) '}
                    {userData?.userType === 6 && ' Ativista '}
                    {userData?.userType === 7 && ' Apoiador(a) '}
                    {userData?.userType === 8 && ' Validador(a) '}
                </span>
                na versão 6 do Sistema Descentralizado de Regeneração da Natureza
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