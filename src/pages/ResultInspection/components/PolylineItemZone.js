import React, {useEffect, useState} from "react";
import { Polyline } from '@react-google-maps/api';

export function PolylineItemZone({data, index}){
    const [path, setPath] = useState([]);
    const [color, setColor] = useState('red')

    useEffect(() => {
        fixPath();

        if(index === 0){
            setColor('red');
        }
        
        if(index === 1){
            setColor('blue');
        }

        
        if(index === 2){
            setColor('green');
        }

        
        if(index === 3){
            setColor('yellow');
        }

        
        if(index === 4){
            setColor('purple');
        }
    }, []);

    function fixPath(){
        let newArray = [];
        for(var i = 0; i < data.length; i++){
            const object = {
                lat: data[i].lat,
                lng: data[i].lng
            }

            newArray.push(object);
        } 

        newArray.push({
            lat: data[0].lat,
            lng: data[0].lng,
        })
        
        setPath(newArray);
    }

    if(path.length > 0){
        return(
            <Polyline
                path={path}
                options={{
                    strokeColor: color
                }}
            />
        );
    }
}