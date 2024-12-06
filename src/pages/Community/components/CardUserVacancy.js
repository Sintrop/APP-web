import React from "react";
import { useTranslation } from "react-i18next";
import { useMainContext } from "../../../hooks/useMainContext";

export function CardUserVacancy({ userType, avaliableVacancy, amountVacancies, countUsers, navigateToRanking, showModalConnect, showModalSignUp }) {
    const { t } = useTranslation();
    const { walletConnected, userData } = useMainContext();

    if (userType === 1 || userType === 7) {
        return (
            <div className="flex w-full h-[190px] lg:w-[49%] px-8 py-6 bg-container-primary p-3 rounded-md items-center justify-between">
                <div className="flex flex-col justify-between h-full">
                    <div className="flex items-center gap-4">
                        {userType === 1 && (
                            <img
                                src={require('../../../assets/icon-produtor.png')}
                                className="w-12 h-12 object-contain"
                                alt='icon produtor'
                            />
                        )}

                        {userType === 7 && (
                            <img
                                src={require('../../../assets/icon-apoiador.png')}
                                className="w-12 h-12 object-contain"
                                alt='icon apoiador'
                            />
                        )}
                        <p className="font-bold text-white text-lg">
                            {userType === 1 && t('produtores')}
                            {userType === 7 && t('apoiadores')}
                        </p>
                    </div>

                    <div>
                        {walletConnected === '' ? (
                            <button
                                className="text-center text-green-400 underline mb-3"
                                onClick={showModalConnect}
                            >
                                {t('textConecteSuaWalletParaCandidatar')}
                            </button>
                        ) : (
                            <>
                                {userData?.id === 'anonimous' && (
                                    <>
                                        <button
                                            className={`text-white w-[80%] h-10 bg-green-btn rounded-md my-3 ${!avaliableVacancy && 'opacity-40'}`}
                                            disabled={!avaliableVacancy}
                                            onClick={showModalSignUp}
                                        >
                                            {t('textCandidatese')}
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                        <button
                            className="w-[80%] h-10 rounded-md bg-blue-primary text-white"
                            onClick={() => navigateToRanking(userType)}
                        >
                            {userType === 1 && t('textVerProdutores')}
                            {userType === 7 && t('textVerApoiadores')}
                        </button>
                    </div>
                </div>
                <div className="w-24 h-20 rounded-md bg-green-secondary flex items-center justify-center">
                    <p className="font-bold text-green-primary text-5xl">{countUsers}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full lg:w-[250px] p-3 py-7 rounded-md bg-container-primary flex flex-col items-center gap-3">
            {userType === 2 && (
                <img
                    src={require('../../../assets/icon-inspetor.png')}
                    className="w-20 h-20 object-contain"
                    alt='icon inspetor'
                />
            )}

            {userType === 3 && (
                <img
                    src={require('../../../assets/icon-pesquisadores.png')}
                    className="w-20 h-20 object-contain"
                    alt='icon pesquisador'
                />
            )}

            {userType === 4 && (
                <img
                    src={require('../../../assets/centro-dev.png')}
                    className="w-20 h-20 object-contain"
                    alt='icon desenvolvedores'
                />
            )}

            {userType === 5 && (
                <img
                    src={require('../../../assets/icon-contribuir.png')}
                    className="w-20 h-20 object-contain"
                    alt='icon contribuidor'
                />
            )}

            {userType === 6 && (
                <img
                    src={require('../../../assets/icon-ativista.png')}
                    className="w-20 h-20 object-contain"
                    alt='icon ativista'
                />
            )}

            {userType === 8 && (
                <img
                    src={require('../../../assets/validacao-icon.png')}
                    className="w-20 h-20 object-contain"
                    alt='icon validador'
                />
            )}

            <p className="font-bold text-white text-lg uppercase">
                {userType === 2 && t('inspetores')}
                {userType === 3 && t('pesquisadores')}
                {userType === 4 && t('desenvolvedores')}
                {userType === 5 && t('contribuidores')}
                {userType === 6 && t('ativistas')}
                {userType === 8 && t('validadores')}
            </p>

            <div className="flex items-center justify-between w-full p-2 bg-green-secondary mt-5 rounded-md">
                <p className="font-semibold text-white">{t('textCadastrados')}</p>
                <p className="font-bold text-green-primary">{countUsers}</p>
            </div>
            <div className="flex items-center justify-between w-full p-2 bg-green-secondary rounded-md">
                <p className="font-semibold text-white">{t('textVagasDisponiveis')}</p>
                <p className="font-bold text-green-primary">
                    {amountVacancies}
                </p>
            </div>

            {walletConnected === '' ? (
                <button
                    className="text-center text-green-400 underline"
                    onClick={showModalConnect}
                >
                    {t('textConecteSuaWalletParaCandidatar')}
                </button>
            ) : (
                <>
                    {userData?.id === 'anonimous' && (
                        <>
                            <button
                                className={`text-white w-[80%] h-10 bg-green-btn rounded-md mt-5 ${!avaliableVacancy && 'opacity-40'}`}
                                disabled={!avaliableVacancy}
                                onClick={showModalSignUp}
                            >
                                {t('textCandidatese')}
                            </button>
                        </>
                    )}
                </>
            )}

            <button
                className="text-white w-[80%] h-10 bg-blue-primary rounded-md"
                onClick={() => navigateToRanking(String(userType))}
            >
                {userType === 2 && t('textVerInspetores')}
                {userType === 3 && t('textVerPesquisadores')}
                {userType === 4 && t('textVerDesenvolvedores')}
                {userType === 5 && t('textVerContribuidores')}
                {userType === 6 && t('textVerAtivistas')}
                {userType === 8 && t('textVerValidadores')}
            </button>
        </div>
    )
}