import React from 'react';
import { useMainContext } from '../hooks/useMainContext';

export function Assistent({close}){
    const {chooseModalTutorial, user, userData} = useMainContext();
    return(
        <div className="h-14 bg-[#ff9900] absolute bottom-3 w-full flex items-center px-3 justify-between rounded-full border-2">
            {user === '0' ? (
                <p className="font-bold text-white">Missão 1: Se cadastre na plataforma, clicando no botão na barra de status superior.</p>
            ) : (
                <>
                {user === '1' && (
                    <>
                        {userData?.level === 1 && (
                            <p className="font-bold text-white">Missão 2: Clique em gerenciar inspeções e depois em requisitar nova inspeção</p>
                        )}
                        {userData?.level > 1 && (
                            <p className="font-bold text-white">Nada a fazer por enquanto!</p>
                        )}
                    </>
                )}

                {user === '2' && (
                    <>
                        {userData?.level === 1 && (
                            <p className="font-bold text-white">Missão 2: Clique em gerenciar inspeções e procure uma inspeção e aceite</p>
                        )}
                    </>
                )}

                {user === '3' && (
                    <>
                        {userData?.level === 1 && (
                            <p className="font-bold text-white">Missão 2: Clique em centro de pesquisa e depois em publicar pesquisa</p>
                        )}
                    </>
                )}
                </>
            )}

            <div className="flex items-center gap-4">
                {user !== '0' && (
                    <button 
                        className="w-32 h-10 flex items-center justify-center bg-red-500 rounded-md text-white font-bold"
                        onClick={chooseModalTutorial}
                    >
                        Tutorial
                    </button>
                )}
                <p 
                    className="text-gray-200 border-b-2 border-gray-200 cursor-pointer"
                    onClick={close}
                >X Fechar assistente</p>
            </div>
        </div>
    )
}