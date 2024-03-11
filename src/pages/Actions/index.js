import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";

export function Actions() {

    return (
        <div className={`bg-[#062c01] flex flex-col h-[100vh]`}>
            <Header routeActive='actions' />

            <div className="flex flex-col items-center w-full mt-20">
                Ações
            </div>
        </div>
    )
}