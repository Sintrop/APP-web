import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCheck, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useMainContext } from "../../../../../hooks/useMainContext";
import { useNavigate } from "react-router";
import { getProportionallity } from "../../../../../services/getProportionality";
import { ActivityIndicator } from "../../../../../components/ActivityIndicator/ActivityIndicator";

interface Props {
    check?: boolean;
    title: string;
    type?: string;
    handleShowSignUp?: () => void;
    handleEfetiveRegister?: () => void;
    loadingEfetive?: boolean;
}
export function CheckItem({ check, title, type, handleShowSignUp, handleEfetiveRegister, loadingEfetive }: Props) {
    //@ts-ignore
    const { userData, accountStatus } = useMainContext();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [showHideBtn, setShowHideBtn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [avaliableVacancy, setAvaliableVacancy] = useState(false);

    useEffect(() => {
        if (type === 'application') {
            if (userData?.id === 'anonimous') {
                setShowHideBtn(true);
                setOpen(true);
            } else {
                setOpen(false);
                setShowHideBtn(false);
            }
        }

        if (type === 'invite') {
            setShowHideBtn(true);
            if (check) {
                setOpen(false);
                setShowHideBtn(false);
            } else {
                setShowHideBtn(true);
                setOpen(true);
            }
        }

        if (type === 'efetive-register') {
            if (accountStatus === 'guest') {
                setShowHideBtn(true);
                setOpen(true);
                checkVancancies();
            } else {
                setShowHideBtn(false);
                setOpen(false);
            }
        }
    }, [check, userData, type, accountStatus]);

    async function checkVancancies() {
        setLoading(true);
        const response = await getProportionallity();

        if (userData.userType === 2) {
            if (response.avaliableVacancyInspector) {
                setAvaliableVacancy(true);
            }
        }

        if (userData.userType === 3) {
            if (response.avaliableVacancyResearcher) {
                setAvaliableVacancy(true);
            }
        }

        if (userData.userType === 4) {
            if (response.avaliableVacancyDeveloper) {
                setAvaliableVacancy(true);
            }
        }

        if (userData.userType === 5) {
            if (response.avaliableVacancyContributor) {
                setAvaliableVacancy(true);
            }
        }

        if (userData.userType === 6) {
            if (response.avaliableVacancyActivist) {
                setAvaliableVacancy(true);
            }
        }

        if (userData.userType === 8) {
            if (response.avaliableVacancyValidator) {
                setAvaliableVacancy(true);
            }
        }
        setLoading(false);
    }

    function toggleOpen() {
        setOpen(oldValue => !oldValue)
    }

    return (
        <div className="flex flex-col bg-[#052E16] rounded-md p-1 mb-1 w-full">
            <div className="w-full h-7 flex items-center gap-2 relative">
                <div className="h-full w-5 bg-container-primary rounded-md flex items-center justify-center">
                    {check && (
                        <FaCheck size={15} color='#18850B' />
                    )}
                </div>

                <p className="text-white text-xs">{t(title)}</p>

                {showHideBtn && (
                    <button
                        className="absolute right-1"
                        onClick={toggleOpen}
                    >
                        {open ? (
                            <FaChevronUp color='white' size={15} />
                        ) : (
                            <FaChevronDown color='white' size={15} />
                        )}
                    </button>
                )}
            </div>

            {open && (
                <div className="flex flex-col mt-2 items-center">
                    {type === 'application' && (
                        <>
                            <p className="text-white text-center text-xs">
                                {t('vamosPrecisarDeDadosSeus')}
                            </p>

                            <button
                                className="w-full h-10 rounded-md mt-5 text-white font-bold text-sm bg-blue-primary max-w-[300px]"
                                onClick={handleShowSignUp}
                            >
                                {t('queroMeCandidatar')}
                            </button>
                        </>
                    )}

                    {type === 'invite' && (
                        <>
                            <p className="text-white text-center text-xs">
                                {check ? `${t('voceRecebeuConviteDe')}` : `${t('vocePrecisaReceberConvite')}`}
                            </p>
                        </>
                    )}

                    {type === 'efetive-register' && (
                        <>

                            {loading ? (
                                <>
                                    <p className="text-white text-center text-xs">
                                        {t('vamosVerificarSeHaVagas')}
                                    </p>
                                    <p
                                        className="text-blue-500 underline text-xs text-center hover:cursor-pointer"
                                        onClick={() => navigate('/community')}
                                    >
                                        {t('saibaMaisSobreVagas')}
                                    </p>

                                    <p className="font-bold text-green-primary text-sm text-center my-5">{t('verificando')}</p>
                                </>
                            ) : (
                                <>
                                    {avaliableVacancy ? (
                                        <button
                                            className="w-full h-10 rounded-md mt-1 text-white font-bold text-sm bg-blue-primary max-w-[300px]"
                                            onClick={handleEfetiveRegister}
                                            disabled={loadingEfetive}
                                        >
                                            {loadingEfetive ? (
                                                <ActivityIndicator size={25} />
                                            ) : (
                                                t('efetivarCadastro')
                                            )}
                                        </button>
                                    ) : (
                                        <>
                                            <p className="font-bold text-yellow-500 text-sm text-center my-5">
                                                {t('naoHaVagasNoMomento')}
                                            </p>

                                            <p
                                                className="text-blue-500 underline text-xs text-center hover:cursor-pointer mb-3"
                                                onClick={() => navigate('/community')}
                                            >
                                                {t('saibaMaisSobreVagas')}
                                            </p>
                                        </>
                                    )}
                                </>
                            )}

                        </>
                    )}
                </div>
            )}
        </div>
    )
}