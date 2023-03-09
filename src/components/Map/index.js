import React, {useState, useEffect} from 'react';
import  MapView  from './Map';

function Map({setCenter, editable, position, setPolyline, pathPolyline}) {
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

    function convertToPath(path){
        let array = [];

        for(var i = 0; i < path.length; i++){
            let data = {
                lat: path[i].lat(),
                lng: path[i].lng()
            }

            array.push(data);
        }

        setPolyline(JSON.stringify(array));
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
            setPolyline={(path) => convertToPath(path)}
            pathPolyline={pathPolyline}
        />
    )
}

export default Map