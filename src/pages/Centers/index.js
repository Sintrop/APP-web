import React from "react";
import { Header } from "../../components/Header";

export function Centers(){
    return(
        <div className="bg-[#062c01] flex flex-col h-[100vh]">
            <Header routeActive='centers'/>

            <div className="flex flex-col items-center w-full mt-20">
                Centros
            </div>
        </div>
    )
}