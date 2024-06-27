import React from "react";
import { Source, Layer } from "react-map-gl";

export function Polyline({coordinates, lineColor, lineWidth}) {
    if(coordinates.length > 0){
        return (
            <Source
                id='pathProperty'
                type="geojson"
                data={{
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates
                    }
                }}
            >
                <Layer
                    id='lineLayer'
                    type='line'
                    source='pathProperty'
                    layout={{
                        "line-join": 'round',
                        "line-cap": 'round'
                    }}
                    paint={{
                        'line-color': lineColor,
                        'line-width': lineWidth
                    }}
                />
            </Source>
        )
    }
}