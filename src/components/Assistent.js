import React from 'react';
import { useMainContext } from '../hooks/useMainContext';

export function Assistent({close, loginPage}){
    const {chooseModalTutorial, user, userData} = useMainContext();
    return(
        <div className="bg-green-950 absolute bottom-3 right-5 w-[300px] h-[400px] flex flex-col p-3 justify-between rounded-md border-2 ">
            {user === '0' ? (
                <>
                    {loginPage ? (
                        <>
                            <p className="font-bold text-white text-center">Dificuldades?</p>
                            <p className="font-bold text-white text-center">Se você estiver com dificuldade ou precisar de ajuda da nossa equipe, agende no link abaixo uma reunião online e nós te ajudaremos no processo de cadastro da plataforma.</p>
                        </>
                    ) : (
                        <>
                            <p className="font-bold text-white text-center">Missão 1</p>
                            <p className="font-bold text-white">Se cadastre na plataforma, clicando no botão na barra de status superior.</p>
                        </>
                    )}
                </>
            ) : (
                <>
                {user === '1' && (
                    <>
                        {userData?.level === 1 && (
                            <>
                                <p className="font-bold text-white text-center">Missão 2</p>
                                <p className="font-bold text-white text-center">Clique em gerenciar inspeções e depois em requisitar nova inspeção</p>
                            </>
                        )}
                        {userData?.level > 1 && (
                            <>
                                <p className="font-bold text-white text-center">Tudo certo</p>
                                <p className="font-bold text-white text-center">Nada a fazer por enquanto</p>
                            </>
                        )}
                    </>
                )}

                {user === '2' && (
                    <>
                        {userData?.level === 1 && (
                            <>
                                <p className="font-bold text-white text-center">Missão 2</p>
                                <p className="font-bold text-white">Clique em gerenciar inspeções, procure uma inspeção e aceite</p>
                            </>
                        )}
                        {userData?.level > 1 && (
                            <>
                                <p className="font-bold text-white text-center">Tudo certo</p>
                                <p className="font-bold text-white text-center">Nada a fazer por enquanto</p>
                            </>
                        )}
                    </>
                )}

                {user === '3' && (
                    <>
                        {userData?.level === 1 && (
                            <>
                            <p className="font-bold text-white text-center">Missão 2</p>
                            <p className="font-bold text-white">Clique em centro de pesquisa e depois em publicar pesquisa</p>
                            </>
                        )}
                        {userData?.level > 1 && (
                            <>
                                <p className="font-bold text-white text-center">Tudo certo</p>
                                <p className="font-bold text-white text-center">Nada a fazer por enquanto</p>
                            </>
                        )}
                    </>
                )}

                {user === '4' && (
                    <>
                        <p className="font-bold text-white text-center">Tudo certo</p>
                        <p className="font-bold text-white text-center">Nada a fazer por enquanto</p>
                    </>
                )}

                {user === '5' && (
                    <>
                        <p className="font-bold text-white text-center">Tudo certo</p>
                        <p className="font-bold text-white text-center">Nada a fazer por enquanto</p>
                    </>
                )}

                {user === '6' && (
                    <>
                        <p className="font-bold text-white text-center">Tudo certo</p>
                        <p className="font-bold text-white text-center">Nada a fazer por enquanto</p>
                    </>
                )}

                {user === '7' && (
                    <>
                        <p className="font-bold text-white text-center">Tudo certo</p>
                        <p className="font-bold text-white text-center">Nada a fazer por enquanto</p>
                    </>
                )}
                </>
            )}

            <div className="flex items-center  gap-4">
                {loginPage && (
                    <a
                        className="w-28 h-10 flex items-center justify-center bg-red-500 rounded-md text-white font-bold"
                        target='_blank'
                        href='https://calendly.com/d/yvf-qv9-sxg/onboarding-na-plataforma'
                    >
                        Agendar
                    </a>
                )}
                {user === '1' || user === '2' && (
                    <button 
                        className="w-28 h-10 flex items-center justify-center bg-red-500 rounded-md text-white font-bold"
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