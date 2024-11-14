/* eslint import/no-webpack-loader-syntax: off */
import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header/header";
import { api } from "../../services/api";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/TopBar";
import { Feedback } from "../../components/Feedback";
import { Helmet } from "react-helmet";
import 'mapbox-gl/dist/mapbox-gl.css';
import { Chat } from "../../components/Chat";
import { useTranslation } from "react-i18next";
import { getProportionallity } from "../../services/getProportionality";
import { ModalSignUp } from "../../components/ModalSignUp/ModalSignUp";
import { CardUserVacancy } from "./components/CardUserVacancy";
import { ModalConnectAccount } from "../../components/ModalConnectAccount";
import * as Dialog from '@radix-ui/react-dialog';
import { ActivityIndicator } from "../../components/ActivityIndicator";

export function Community() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [usersCount, setUsersCount] = useState({});
    const [vacancies, setVacancies] = useState({});
    const [showSignUp, setShowSignUp] = useState(false);
    const [showModalConnect, setShowModalConnect] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCountUsers();
        getVacancies();
    }, []);

    async function getVacancies() {
        const response = await getProportionallity();
        setVacancies(response);
    }

    async function getCountUsers() {
        setLoading(true);
        const response = await api.get('/users_count');
        setUsersCount(response.data);
        setLoading(false);
    }

    function navigateToRanking(userType) {
        navigate(`/ranking/${userType}`)
    }

    return (
        <div className={`bg-gradient-to-b from-[#043832] to-[#1F5D38] flex flex-col h-[100vh] overflow-hidden`} >
            <Helmet>
                <meta charSet="utf-8" />
                <title>Comunidade - Sintrop</title>
                <link rel="canonical" href={`https://app.sintrop.com/community`} />
                <link rel="icon" href="/favicon.png" />
                <meta
                    name="description"
                    content="Sistema Descentralizado de Regeneração da Natureza"
                />
            </Helmet>
            <TopBar />
            <Header routeActive='community' />

            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                    <ActivityIndicator size={180} />
                </div>
            ) : (
                <div className="flex flex-col items-center overflow-scroll">
                    <div className="flex flex-col w-full max-w-[1024px] pt-10 lg:pt-32 pb-20" >
                        <h3 className="font-bold text-white text-lg">{t('comunidade')}</h3>

                        <div className="flex gap-5 mt-10 w-full flex-wrap">
                            <div className="flex items-center h-[150px] w-full lg:w-[49%] bg-green-secondary p-3 rounded-md justify-between px-8">
                                <img
                                    src={require('../../assets/img/users.png')}
                                    className="w-20 h-20 object-contain"
                                    alt='Icone de usuários'
                                />

                                <p className="font-bold text-white max-w-[120px] text-lg text-center">
                                    {t('textTotalCadastros')}
                                </p>

                                <div className="w-24 h-20 rounded-md bg-container-primary flex items-center justify-center">
                                    <p className="font-bold text-green-primary text-5xl">{usersCount?.totalCount}</p>
                                </div>
                            </div>

                            <div className="flex w-full h-[150px] lg:w-[49%] px-8 py-6 bg-container-primary p-3 rounded-md items-center justify-between">
                                <p className="text-white">
                                    {t('descInfoComunidade')}
                                </p>
                            </div>

                            <CardUserVacancy
                                userType={1}
                                countUsers={usersCount?.producersCount}
                                navigateToRanking={navigateToRanking}
                                showModalSignUp={() => setShowSignUp(true)}
                                showModalConnect={() => setShowModalConnect(true)}
                                avaliableVacancy={true}
                            />

                            <CardUserVacancy
                                userType={7}
                                countUsers={usersCount?.supportersCount}
                                navigateToRanking={navigateToRanking}
                                showModalSignUp={() => setShowSignUp(true)}
                                showModalConnect={() => setShowModalConnect(true)}
                                avaliableVacancy={true}
                            />
                        </div>

                        <div className="flex gap-2 mt-5 w-full flex-wrap">
                            <CardUserVacancy
                                userType={2}
                                countUsers={usersCount?.inspectorsCount}
                                amountVacancies={vacancies.amountVacancyInspector}
                                avaliableVacancy={vacancies.avaliableVacancyInspector}
                                navigateToRanking={navigateToRanking}
                                showModalSignUp={() => setShowSignUp(true)}
                                showModalConnect={() => setShowModalConnect(true)}
                            />

                            <CardUserVacancy
                                userType={3}
                                countUsers={usersCount?.researchersCount}
                                amountVacancies={vacancies.amountVacancyResearcher}
                                avaliableVacancy={vacancies.avaliableVacancyResearcher}
                                navigateToRanking={navigateToRanking}
                                showModalSignUp={() => setShowSignUp(true)}
                                showModalConnect={() => setShowModalConnect(true)}
                            />

                            <CardUserVacancy
                                userType={4}
                                countUsers={usersCount?.developersCount}
                                amountVacancies={vacancies.amountVacancyDeveloper}
                                avaliableVacancy={vacancies.avaliableVacancyDeveloper}
                                navigateToRanking={navigateToRanking}
                                showModalSignUp={() => setShowSignUp(true)}
                                showModalConnect={() => setShowModalConnect(true)}
                            />

                            <CardUserVacancy
                                userType={5}
                                countUsers={usersCount?.contributorsCount}
                                amountVacancies={vacancies.amountVacancyContributor}
                                avaliableVacancy={vacancies.avaliableVacancyContributor}
                                navigateToRanking={navigateToRanking}
                                showModalSignUp={() => setShowSignUp(true)}
                                showModalConnect={() => setShowModalConnect(true)}
                            />

                            <CardUserVacancy
                                userType={6}
                                countUsers={usersCount?.activistsCount}
                                amountVacancies={vacancies.amountVacancyActivist}
                                avaliableVacancy={vacancies.avaliableVacancyActivist}
                                navigateToRanking={navigateToRanking}
                                showModalSignUp={() => setShowSignUp(true)}
                                showModalConnect={() => setShowModalConnect(true)}
                            />

                            <CardUserVacancy
                                userType={8}
                                countUsers={usersCount?.validatorsCount}
                                amountVacancies={vacancies.amountVacancyValidator}
                                avaliableVacancy={vacancies.avaliableVacancyValidator}
                                navigateToRanking={navigateToRanking}
                                showModalSignUp={() => setShowSignUp(true)}
                                showModalConnect={() => setShowModalConnect(true)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {showSignUp && (
                <ModalSignUp
                    close={() => setShowSignUp(false)}
                    success={() => navigate('/profile')}
                />
            )}

            <Dialog.Root open={showModalConnect} onOpenChange={(open) => setShowModalConnect(open)}>
                <ModalConnectAccount
                    close={() => setShowModalConnect(false)}
                />
            </Dialog.Root>

            <div className="hidden lg:flex">
                <Feedback />
                <Chat />
            </div>
        </div>
    )
}