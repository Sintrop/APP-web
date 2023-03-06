import React from 'react';
import { GoogleMap, LoadScript, DrawingManager, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '450px',
  height: '400px'
};

// const center = {
//   lat: -3.745,
//   lng: -38.523
// };

export function MapView({center, setCenter, editable, setPolyline}){
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
                                setPolyline()
                            }}
                        />
                    )}
                </>
                }
                {!editable && (
                    <Marker position={center}/>
                )}
            </GoogleMap>
        </LoadScript>
    )
}