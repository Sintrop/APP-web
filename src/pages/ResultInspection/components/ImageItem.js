import React from "react";

export function ImageItem({src, type}) {
    if(type === 'biodiversity-zone'){
        return (
            <div className="w-[250px] h-[300px] border-4 border-white rounded-md relative overflow-hidden">
                <img
                    src={src.photo}
                    className="w-[250px] h-[300px] object-cover"
                />

                <div className="w-full h-[70px] absolute bottom-0 bg-[rgba(0,0,0,0.7)] flex flex-col items-center justify-center rounded-t-lg">
                    <p className="text-sm text-white text-center">Lat: {src?.coord?.lat}, Lng: {src?.coord?.lng}</p>
                    <p className="text-sm text-white text-center">Tipo: {src?.type}</p>
                    <p className="text-sm text-white text-center">Espécie: {src?.especieSelected?.name}</p>
                </div>
            </div>
        )
    }

    if(type === 'biodiversity-soil'){
        return (
            <div className="w-[250px] h-[300px] border-4 border-white rounded-md relative overflow-hidden">
                <img
                    src={src.photo}
                    className="w-[250px] h-[300px] object-cover"
                />

                <div className="w-full h-[70px] absolute bottom-0 bg-[rgba(0,0,0,0.7)] flex flex-col items-center justify-center rounded-t-lg">
                    <p className="text-sm text-white text-center">Lat: {src?.coord?.lat}, Lng: {src?.coord?.lng}</p>
                    <p className="text-sm text-white text-center">Espécies vistas: {src?.value}</p>
                </div>
            </div>
        )
    }

    if(type === 'analise-soil'){
        return (
            <div className="w-[250px] h-[300px] border-4 border-white rounded-md relative overflow-hidden">
                <img
                    src={src.photo}
                    className="w-[250px] h-[300px] object-cover"
                />

                <div className="w-full h-[70px] absolute bottom-0 bg-[rgba(0,0,0,0.7)] flex flex-col items-center justify-center rounded-t-lg">
                    <p className="text-sm text-white text-center">Lat: {src?.coord?.lat}, Lng: {src?.coord?.lng}</p>
                    <p className="text-sm text-white text-center">Biomassa: {src?.value} kg</p>
                </div>
            </div>
        )
    }

    if(type === 'trees'){
        return (
            <div className="w-[250px] h-[300px] border-4 border-white rounded-md relative overflow-hidden">
                <img
                    src={src.photo}
                    className="w-[250px] h-[300px] object-cover"
                />

                <div className="w-full h-[70px] absolute bottom-0 bg-[rgba(0,0,0,0.7)] flex flex-col items-center justify-center rounded-t-lg">
                    <p className="text-sm text-white text-center">Lat: {src?.lat}, Lng: {src?.lng}</p>
                    <p className="text-sm text-white text-center">Diâmetro: {src?.ray} cm, Altura: {src?.height} m</p>
                </div>
            </div>
        )
    }

    if(type === 'photos-zone'){
        return (
            <div className="w-[250px] h-[300px] border-4 border-white rounded-md relative overflow-hidden">
                <img
                    src={src.photo}
                    className="w-[250px] h-[300px] object-cover"
                />
            </div>
        )
    }

    return (
        <div className="w-[250px] h-[300px] border-4 border-white rounded-md flex overflow-hidden">
            <img
                src={src}
                className="w-[250px] h-[300px] object-cover"
            />
        </div>
    )
}