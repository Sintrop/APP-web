import React from "react";
import { DeveloperActions } from "../../Actions/components/DeveloperActions";
import { Header } from "../../../components/Header";

export function DeveloperCenter(){
    return(
        <div className={`bg-[#062c01] flex flex-col h-[100vh]`}>
            <Header/>

            <div className="flex flex-col items-center w-full mt-20 overflow-y-auto">
                <div className="flex gap-3 flex-wrap max-w-[1024px] mt-3 justify-center">
                    <DeveloperActions />
                </div>
            </div>
        </div>
    )
}