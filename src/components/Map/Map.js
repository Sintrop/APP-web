import React from 'react';
import { GoogleMap, LoadScript, DrawingManager, Marker, Polyline } from '@react-google-maps/api';

const containerStyle = {
  width: '450px',
  height: '400px'
};

// const center = {
//   lat: -3.745,
//   lng: -38.523
// };

function MapView({center, setCenter, editable, setPolyline, pathPolyline}){
    return(
        <LoadScript
            googleMapsApiKey='AIzaSyD9854_llv58ijiMNKxdLbe6crnQuCpGuo'
            libraries={['drawing']}
        >
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={18}
                mapTypeId='satellite'
            >
                { 
                <>
                    {editable && (
                        <DrawingManager
                            onMarkerComplete={e => {
                                setCenter(`${e.position.lat()}, ${e.position.lng()}`)
                            }}
                            onPolylineComplete={(e) => {
                                setPolyline(e.latLngs.h[0].h)
                            }}
                        />
                    )}
                </>
                }
                {!editable && (
                    <Marker position={center}/>
                )}

                {/* {!editable && (
                    <Polyline
                        path={pathPolyline}
                    />
                )} */}
            </GoogleMap>
        </LoadScript>
    )
}

export default React.memo(MapView)