import React, {useState, useEffect} from 'react';
import { MapView } from './Map';

export function Map({setCenter, editable, position, setPolyline}) {
    const [loading, setLoading] = useState(false);
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);

    useEffect(() => {
        if(editable){
            getLocale();
        }else{
            setLocale();
        }
    }, []);

    function getLocale(){
        //setLoading(true)
        navigator.geolocation.getCurrentPosition(res => {
            setLat(Number(res.coords.latitude));
            setLng(Number(res.coords.longitude));
            setTimeout(() => {
                setLoading(false);
            }, 500)
        })
    }

    function setLocale(){
        const arrayPosition = position.split(',');
        setLat(Number(arrayPosition[0]));
        setLng(Number(arrayPosition[1]));
    }

    return(
        <MapView 
            center={{lat, lng}}
            setCenter={(position) => {
                setCenter(position)
                const arrayPosition = position.split(',');
                setLat(Number(arrayPosition[0]));
                setLng(Number(arrayPosition[1]));
            }}
            editable={editable}
            setPolyline={() => setPolyline()}
        />
    )
}