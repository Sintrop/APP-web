import React, {useEffect, useState} from 'react';
import { Polyline, Marker } from '@react-google-maps/api';

export function PolylineItem({data, index}){
    const [path, setPath] = useState([]);
    const [colorBorder, setColorBorder] = useState('red');

    useEffect(() => {
        fixPathZones();
        if(index === 0){
            setColorBorder('red');
        }
        if(index === 1){
            setColorBorder('green');
        }
        if(index === 2){
            setColorBorder('blue');
        }
        if(index === 3){
            setColorBorder('yellow');
        }
        if(index === 4){
            setColorBorder('purple');
        }
    },[]);

    function fixPathZones(){
        const coords = data.path;
        let newArrayCoords = [];
        for(var i = 0; i < coords.length; i++){
            newArrayCoords.push(coords[i]);
        }
        newArrayCoords.push(data.path[0])
        setPath(newArrayCoords)
    }
    return(
        <>
        <Polyline
            path={path} 
            options={{
                strokeColor: colorBorder,
                strokeWeight: 5
            }}
        />
        {data.path.map(item => (
            <Marker
                position={{lat: item.lat, lng: item.lng}}
                options={{
                    label: data.title,

                }}
            />
        ))}

        {data.arvores?.sampling1?.trees.map(item => (
            <Marker
                position={{lat: item.lat, lng: item.lng}}
                options={{
                    icon:{
                        url: 'https://ipfs.io/ipfs/QmZ8EESuXdKQTPZM5uL2dyCDVpgfnd7Regqh7K5u1WLbFk'
                    }         
                }}
            />
        ))}

        {data.arvores.sampling2 && (
            <>
            {data.arvores?.sampling2?.trees.map(item => (
                <Marker
                    position={{lat: item.lat, lng: item.lng}}
                    options={{
                        icon:{
                            url: 'https://ipfs.io/ipfs/QmZ8EESuXdKQTPZM5uL2dyCDVpgfnd7Regqh7K5u1WLbFk'
                        }         
                    }}
                />
            ))}
            </>
        )}
        </>
    )
}