import React from "react";
import { ActivistActions } from "../../Actions/components/ActivistActions";
import { Header } from "../../../components/Header";
import { TopBar } from "../../../components/TopBar";

export function ActivistCenter(){
    return(
        <div className={`bg-[#062c01] flex flex-col h-[100vh]`}>
            <TopBar/>
            <Header/>

            <div className="flex flex-col items-center w-full pt-32 overflow-y-auto">
                <div className="flex gap-3 flex-wrap max-w-[1024px] mt-3 justify-center">
                    <ActivistActions />
                </div>
            </div>
        </div>
    )
}