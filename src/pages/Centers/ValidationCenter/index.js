import React from "react";
import { ValidatorActions } from "../../Actions/components/ValidatorActions";
import { Header } from "../../../components/Header";

export function ValidationCenter(){
    return(
        <div className={`bg-[#062c01] flex flex-col h-[100vh]`}>
            <Header/>

            <div className="flex flex-col items-center w-full mt-20 overflow-y-auto">
                <div className="flex gap-3 flex-wrap max-w-[1024px] mt-3 justify-center">
                    <ValidatorActions />
                </div>
            </div>
        </div>
    )
}