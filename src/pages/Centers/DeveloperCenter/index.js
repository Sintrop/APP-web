import React from "react";
import { DeveloperActions } from "../../Actions/components/DeveloperActions";
import { Header } from "../../../components/Header";
import { TopBar } from "../../../components/TopBar";

export function DeveloperCenter(){
    return(
        <div className={`bg-gradient-to-b from-[#043832] to-[#1F5D38] flex flex-col h-[100vh]`}>
            <TopBar/>
            <Header/>

            <div className="flex flex-col items-center w-full pt-32 overflow-y-auto">
                <div className="flex gap-3 flex-wrap max-w-[1024px] mt-3 justify-center">
                    <DeveloperActions />
                </div>
            </div>
        </div>
    )
}