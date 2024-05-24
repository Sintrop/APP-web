import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { useMainContext } from '../../hooks/useMainContext';
import { DeveloperActions } from "./components/DeveloperActions";
import { ValidatorActions } from "./components/ValidatorActions";
import { TopBar } from "../../components/TopBar";
import { ActivistActions } from "./components/ActivistActions";
import { SupporterActions } from "./components/SupporterActions";
import * as Dialog from '@radix-ui/react-dialog';
import { ModalConnectAccount } from "../../components/ModalConnectAccount";
import { MdHelpOutline } from "react-icons/md";
import { SiReadthedocs } from 'react-icons/si';
import { FaMobile } from 'react-icons/fa';

export function Actions() {
    const { walletConnected, userData, connectionType } = useMainContext();
    const [modalConnect, setModalConnect] = useState(false);

    return (
        <div className={`bg-[#062c01] flex flex-col h-[100vh]`}>
            <TopBar />
            <Header routeActive='actions' />

            <div className="flex flex-col items-center w-full mt-32 overflow-y-auto">
                <div className="flex gap-3 flex-wrap lg:w-[1024px] mt-3 justify-center">
                    {walletConnected === '' ? (
                        <div className="mt-3 flex flex-col w-full">
                            <p className="font-semibold text-white">Você não está conectado, escolha uma das opções abaixo</p>
                            <Dialog.Root open={modalConnect} onOpenChange={(open) => setModalConnect(open)}>
                                <Dialog.Trigger
                                    className="w-fit py-2 px-5 bg-blue-500 rounded-md text-white font-bold mt-1"
                                >
                                    Conectar wallet
                                </Dialog.Trigger>

                                <ModalConnectAccount close={() => setModalConnect(false)} />
                            </Dialog.Root>

                            <div className="p-2 rounded-md bg-[#0a4303] flex flex-col w-full mt-5">
                                <div className="flex items-center gap-2">
                                    <MdHelpOutline color='white' size={25} />
                                    <p className="font-semibold text-white">Ajuda</p>
                                </div>

                                <div className="flex items-center flex-wrap gap-2 mt-1">
                                    <a
                                        href='https://docs.sintrop.com'
                                        target="_blank"
                                        className="p-2 rounded-md bg-green-950 flex items-center gap-2"
                                    >
                                        <SiReadthedocs size={25} color='white' />
                                        <p className="font-bold text-white text-sm">Documentação</p>
                                    </a>

                                    <a
                                        href='https://www.sintrop.com/app'
                                        target="_blank"
                                        className="p-2 rounded-md bg-green-950 flex items-center gap-2"
                                    >
                                        <FaMobile size={25} color='white' />
                                        <p className="font-bold text-white text-sm">App mobile</p>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full flex flex-col">
                            {userData?.userType === 4 && (
                                <DeveloperActions />
                            )}

                            {userData?.userType === 8 && (
                                <ValidatorActions />
                            )}

                            {userData?.userType === 6 && (
                                <ActivistActions />
                            )}

                            {userData?.userType === 7 && (
                                <SupporterActions />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}