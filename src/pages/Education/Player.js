import React from "react";
import { useParams } from "react-router";

export function Player(){
    const {fileServer} = useParams();
    return(
        <div className="flex w-screen h-screen bg-black">
            <video
                className="w-full h-full bg-black"
                src={`http://edevappsserver.ddns.net:5000/video/${fileServer}`}
                controls={true}
                autoPlay={true}
            />
        </div>
    )
}