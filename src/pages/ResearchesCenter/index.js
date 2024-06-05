import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { TopBar } from '../../components/TopBar';
import { ResearcherActions } from "../Actions/components/ResearcherActions";

export function ResearchesCenter() {
    return (
        <div className={`bg-[#062c01] flex flex-col h-[100vh]`}>
            <TopBar />
            <Header />

            <div className="flex flex-col items-center w-full mt-32 overflow-y-auto">
                <ResearcherActions />
            </div>
        </div>
    )
}