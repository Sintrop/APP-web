import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import {useMainContext} from '../../hooks/useMainContext';
import { DeveloperActions } from "./components/DeveloperActions";
import { ValidatorActions } from "./components/ValidatorActions";
import { TopBar } from "../../components/TopBar";
import { ActivistActions } from "./components/ActivistActions";

export function Actions() {
    const {walletConnected, userData, connectionType} = useMainContext();

    return (
        <div className={`bg-[#062c01] flex flex-col h-[100vh]`}>
            <TopBar/>
            <Header routeActive='actions' />

            <div className="flex flex-col items-center w-full mt-32 overflow-y-auto">
                <div className="flex gap-3 flex-wrap max-w-[1024px] mt-3 justify-center">
                    {walletConnected === '' ? (
                        <div className="mt-3 flex justify-center">
                            <p className="font-bold text-white">Você não está conectado</p>
                        </div>
                    ) : (
                        <div className="w-full flex flex-col">
                            {userData?.userType === 4 && (
                                <DeveloperActions/>
                            )}

                            {userData?.userType === 8 && (
                                <ValidatorActions/>
                            )}

                            {userData?.userType === 6 && (
                                <ActivistActions/>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}