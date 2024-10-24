/* eslint import/no-webpack-loader-syntax: off */
import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { api } from "../../services/api";
import { useNavigate } from "react-router";
import { TopBar } from "../../components/TopBar";
import { ActivityIndicator } from "../../components/ActivityIndicator";
import { Feedback } from "../../components/Feedback";
import { Helmet } from "react-helmet";
import 'mapbox-gl/dist/mapbox-gl.css';
import { Chat } from "../../components/Chat";
import { useTranslation } from "react-i18next";
import { getProportionallity } from "../../services/getProportionality";
import { ModalSignUp } from "../../components/ModalSignUp";

export function Community() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [usersCount, setUsersCount] = useState({});
    const [vacancies, setVacancies] = useState({});
    const [showSignUp, setShowSignUp] = useState(false);

    useEffect(() => {
        getCountUsers();
        getVacancies();
    }, []);

    async function getVacancies() {
        const response = await getProportionallity();
        setVacancies(response);
    }

    async function getCountUsers() {
        const response = await api.get('/users_count');
        setUsersCount(response.data);
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

            <div className="flex flex-col items-center overflow-scroll">
                <div className="flex flex-col w-full max-w-[1024px] pt-10 lg:pt-32 pb-20" >
                    <h3 className="font-bold text-white text-lg">{t('comunidade')}</h3>

                    <div className="flex gap-5 mt-10 w-full flex-wrap">
                        <div className="flex items-center h-[150px] w-full lg:w-[49%] bg-green-secondary p-3 rounded-md justify-between px-8">
                            <div
                                className="w-24 h-24 bg-red-500"
                            />

                            <p className="font-bold text-white max-w-[120px] text-lg text-center">Total de cadastros na comunidade</p>

                            <div className="w-24 h-20 rounded-md bg-container-primary flex items-center justify-center">
                                <p className="font-bold text-green-primary text-5xl">{usersCount?.totalCount}</p>
                            </div>
                        </div>

                        <div className="flex w-full h-[150px] lg:w-[49%] px-8 py-6 bg-container-primary p-3 rounded-md items-center justify-between">
                            <p className="text-white">Descrição aqui</p>
                        </div>

                        <div className="flex w-full h-[150px] lg:w-[49%] px-8 py-6 bg-container-primary p-3 rounded-md items-center justify-between">
                            <div className="flex flex-col justify-between h-full">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={require('../../assets/icon-produtor.png')}
                                        className="w-12 h-12 object-contain"
                                    />
                                    <p className="font-bold text-white text-lg">{t('produtores')}</p>
                                </div>

                                <button
                                    className="px-10 h-10 rounded-md bg-blue-primary text-white"
                                    onClick={() => navigateToRanking('1')}
                                >
                                    {t('verProdutores')}
                                </button>
                            </div>
                            <div className="w-24 h-20 rounded-md bg-green-secondary flex items-center justify-center">
                                <p className="font-bold text-green-primary text-5xl">{usersCount?.producersCount}</p>
                            </div>
                        </div>

                        <div className="flex w-full h-[150px] lg:w-[49%] px-8 py-6 bg-container-primary p-3 rounded-md items-center justify-between">
                            <div className="flex flex-col justify-between h-full">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={require('../../assets/icon-apoiador.png')}
                                        className="w-12 h-12 object-contain"
                                    />
                                    <p className="font-bold text-white text-lg">{t('apoiadores')}</p>
                                </div>

                                <button
                                    className="px-10 h-10 rounded-md bg-blue-primary text-white"
                                    onClick={() => navigateToRanking('7')}
                                >
                                    {t('verApoiadores')}
                                </button>
                            </div>
                            <div className="w-24 h-20 rounded-md bg-green-secondary flex items-center justify-center">
                                <p className="font-bold text-green-primary text-5xl">{usersCount?.supportersCount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 mt-5 w-full flex-wrap">
                        <div className="w-full lg:w-[250px] p-3 py-7 rounded-md bg-container-primary flex flex-col items-center gap-3">
                            <img
                                src={require('../../assets/icon-inspetor.png')}
                                className="w-20 h-20 object-contain"
                            />
                            <p className="font-bold text-white text-lg uppercase">{t('inspetores')}</p>

                            <div className="flex items-center justify-between w-full p-2 bg-green-secondary mt-5 rounded-md">
                                <p className="font-semibold text-white">{t('textCadastrados')}</p>
                                <p className="font-bold text-green-primary">{usersCount?.inspectorsCount}</p>
                            </div>
                            <div className="flex items-center justify-between w-full p-2 bg-green-secondary rounded-md">
                                <p className="font-semibold text-white">{t('textVagasDisponiveis')}</p>
                                <p className="font-bold text-green-primary">
                                    {vacancies.amountVacancyInspector}
                                </p>
                            </div>

                            <button
                                className={`text-white w-[80%] h-10 bg-green-btn rounded-md mt-5 ${!vacancies.avaliableVacancyInspector && 'opacity-40'}`}
                                disabled={!vacancies.avaliableVacancyInspector}
                            >
                                {t('candidatarse')}
                            </button>

                            <button
                                className="text-white w-[80%] h-10 bg-blue-primary rounded-md"
                                onClick={() => navigateToRanking('2')}
                            >
                                {t('verInspetores')}
                            </button>
                        </div>

                        <div className="w-full lg:w-[250px] p-3 py-7 rounded-md bg-container-primary flex flex-col items-center gap-3">
                            <img
                                src={require('../../assets/icon-pesquisadores.png')}
                                className="w-20 h-20 object-contain"
                            />
                            <p className="font-bold text-white text-lg uppercase">{t('pesquisadores')}</p>

                            <div className="flex items-center justify-between w-full p-2 bg-green-secondary mt-5 rounded-md">
                                <p className="font-semibold text-white">{t('textCadastrados')}</p>
                                <p className="font-bold text-green-primary">{usersCount?.researchersCount}</p>
                            </div>
                            <div className="flex items-center justify-between w-full p-2 bg-green-secondary rounded-md">
                                <p className="font-semibold text-white">{t('textVagasDisponiveis')}</p>
                                <p className="font-bold text-green-primary">
                                    {vacancies.amountVacancyResearcher}
                                </p>
                            </div>

                            <button
                                className={`text-white w-[80%] h-10 bg-green-btn rounded-md mt-5 ${!vacancies.avaliableVacancyResearcher && 'opacity-40'}`}
                                disabled={!vacancies.avaliableVacancyResearcher}
                            >
                                {t('candidatarse')}
                            </button>

                            <button
                                className="text-white w-[80%] h-10 bg-blue-primary rounded-md"
                                onClick={() => navigateToRanking('3')}
                            >
                                {t('verPesquisadores')}
                            </button>
                        </div>

                        <div className="w-full lg:w-[250px] p-3 py-7 rounded-md bg-container-primary flex flex-col items-center gap-3">
                            <img
                                src={require('../../assets/centro-dev.png')}
                                className="w-20 h-20 object-contain"
                            />
                            <p className="font-bold text-white text-lg uppercase">{t('desenvolvedores')}</p>

                            <div className="flex items-center justify-between w-full p-2 bg-green-secondary mt-5 rounded-md">
                                <p className="font-semibold text-white">{t('textCadastrados')}</p>
                                <p className="font-bold text-green-primary">{usersCount?.developersCount}</p>
                            </div>
                            <div className="flex items-center justify-between w-full p-2 bg-green-secondary rounded-md">
                                <p className="font-semibold text-white">{t('textVagasDisponiveis')}</p>
                                <p className="font-bold text-green-primary">
                                    {vacancies.amountVacancyDeveloper}
                                </p>
                            </div>

                            <button
                                className={`text-white w-[80%] h-10 bg-green-btn rounded-md mt-5 ${!vacancies.avaliableVacancyDeveloper && 'opacity-40'}`}
                                disabled={!vacancies.avaliableVacancyDeveloper}
                            >
                                {t('candidatarse')}
                            </button>

                            <button
                                className="text-white w-[80%] h-10 bg-blue-primary rounded-md"
                                onClick={() => navigateToRanking('4')}
                            >
                                {t('verDesenvolvedores')}
                            </button>
                        </div>

                        <div className="w-full lg:w-[250px] p-3 py-7 rounded-md bg-container-primary flex flex-col items-center gap-3">
                            <img
                                src={require('../../assets/icon-contribuir.png')}
                                className="w-20 h-20 object-contain"
                            />
                            <p className="font-bold text-white text-lg uppercase">{t('contribuidores')}</p>

                            <div className="flex items-center justify-between w-full p-2 bg-green-secondary mt-5 rounded-md">
                                <p className="font-semibold text-white">{t('textCadastrados')}</p>
                                <p className="font-bold text-green-primary">{usersCount?.contributorsCount}</p>
                            </div>
                            <div className="flex items-center justify-between w-full p-2 bg-green-secondary rounded-md">
                                <p className="font-semibold text-white">{t('textVagasDisponiveis')}</p>
                                <p className="font-bold text-green-primary">
                                    {vacancies.amountVacancyContributor}
                                </p>
                            </div>

                            <button
                                className={`text-white w-[80%] h-10 bg-green-btn rounded-md mt-5 ${!vacancies.avaliableVacancyContributor && 'opacity-40'}`}
                                disabled={!vacancies.avaliableVacancyContributor}
                            >
                                {t('candidatarse')}
                            </button>

                            <button
                                className="text-white w-[80%] h-10 bg-blue-primary rounded-md"
                                onClick={() => navigateToRanking('5')}
                            >
                                {t('verContribuidores')}
                            </button>
                        </div>

                        <div className="w-full lg:w-[250px] p-3 py-7 rounded-md bg-container-primary flex flex-col items-center gap-3">
                            <img
                                src={require('../../assets/icon-ativista.png')}
                                className="w-20 h-20 object-contain"
                            />
                            <p className="font-bold text-white text-lg uppercase">{t('ativistas')}</p>

                            <div className="flex items-center justify-between w-full p-2 bg-green-secondary mt-5 rounded-md">
                                <p className="font-semibold text-white">{t('textCadastrados')}</p>
                                <p className="font-bold text-green-primary">{usersCount?.activistsCount}</p>
                            </div>
                            <div className="flex items-center justify-between w-full p-2 bg-green-secondary rounded-md">
                                <p className="font-semibold text-white">{t('textVagasDisponiveis')}</p>
                                <p className="font-bold text-green-primary">
                                    {vacancies.amountVacancyActivist}
                                </p>
                            </div>

                            <button
                                className={`text-white w-[80%] h-10 bg-green-btn rounded-md mt-5 ${!vacancies.avaliableVacancyActivist && 'opacity-40'}`}
                                disabled={!vacancies.avaliableVacancyActivist}
                            >
                                {t('candidatarse')}
                            </button>

                            <button
                                className="text-white w-[80%] h-10 bg-blue-primary rounded-md"
                                onClick={() => navigateToRanking('6')}
                            >
                                {t('verAtivistas')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showSignUp && (
                <ModalSignUp
                    close={() => setShowSignUp(false)}
                    success={() => {}}
                />
            )}
            <div className="hidden lg:flex">
                <Feedback />
                <Chat />
            </div>
        </div>
    )
}