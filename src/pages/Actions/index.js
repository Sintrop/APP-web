import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header/header";
import { useMainContext } from '../../hooks/useMainContext';
import { TopBar } from "../../components/TopBar";
import * as Dialog from '@radix-ui/react-dialog';
import { ModalConnectAccount } from "../../components/ModalConnectAccount/index.js";
import { MdHelpOutline } from "react-icons/md";
import { SiReadthedocs } from 'react-icons/si';
import { FaMobile } from 'react-icons/fa';
import { QRCode } from "react-qrcode-logo";
import { Feedback } from "../../components/Feedback";
import { api } from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import { ActivityIndicator } from "../../components/ActivityIndicator/ActivityIndicator";
import { FaChevronRight } from "react-icons/fa";
import { Helmet } from "react-helmet";
import { Chat } from "../../components/Chat/index.js";
import { useTranslation } from "react-i18next";
import { ModalWhereExecuteTransaction } from "../../components/ModalWhereExecuteTransaction/ModalWhereExecuteTransaction";
import { ModalRealizeAction } from "./components/ModalRealizeAction/ModalRealizeAction";
import { DeveloperActions } from "./components/DeveloperActions/DeveloperActions";
import { ProducerActions } from "./components/ProducerActions/ProducerActions";
import { InspectorActions } from "./components/InspectorActions/InspectorActions";
import { ResearcherActions } from "./components/ResearcherActions/ResearcherActions";
import { SupporterActions } from "./components/SupporterActions/SupporterActions";
import { ValidatorActions } from "./components/ValidatorActions/ValidatorActions";
import { ActvistActions } from "./components/ActivistActions/ActvistActions";

export function Actions() {
    const { t } = useTranslation();
    const { walletConnected, userData } = useMainContext();
    const [modalConnect, setModalConnect] = useState(false);
    const [impactInvestor, setImpactInvestor] = useState({});
    const [input, setInput] = useState('');
    const [impactToken, setImpactToken] = useState(null);
    const [balanceData, setBalanceData] = useState(null);
    const [maxAmmount, setMaxAmmount] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showModalWhereExecuteTransaction, setShowModalWhereExecuteTransaction] = useState(false);
    const [addDataTransaction, setAddDataTransaction] = useState({});
    const [showModalRealizeAction, setShowModalRealizeAction] = useState(false);

    useEffect(() => {
        setAddDataTransaction({
            value: Number(input),
            itens: []
        });
        if (impactToken) {
            let credits = Number(input);

            let data = {
                carbon: credits * impactToken.carbon,
                bio: Math.abs(credits * impactToken.bio),
                soil: credits * impactToken.soil,
                water: credits * impactToken.water,
            }

            if (credits > Number(balanceData?.balance)) {
                setMaxAmmount(true);
            } else {
                setMaxAmmount(false);
            }

            setImpactInvestor(data)
        } else {
            let data = {
                carbon: 0,
                bio: 0,
                soil: 0,
                water: 0,
            }

            setImpactInvestor(data)
        }
    }, [input, balanceData, impactToken]);

    useEffect(() => {
        getImpact();
        if (walletConnected !== '') getBalance();
    }, [walletConnected]);

    async function getImpact() {
        setLoading(true);
        const response = await api.get('/impact-per-token');
        setImpactToken(response.data.impact);
        setLoading(false);
    }

    async function getBalance() {
        const response = await api.get(`/web3/balance-tokens/${walletConnected}`);
        setBalanceData(response.data);
    }

    async function handleContribute() {
        if (walletConnected === '') {
            toast.error(t('voceNaoConectado'))
            return
        }

        if (input === '') {
            toast.error(t('digiteUmValor'))
            return
        }

        if (maxAmmount) {
            toast.error(t('saldoInsuficiente'))
            return
        }

        setShowModalWhereExecuteTransaction(true);
    }

    function successBurn(successType) {
        setShowModalWhereExecuteTransaction(false);
        if (successType === 'checkout') {
            toast.success(t('transacaoEnviadaCheckout'));
            setInput('');
        }

        if (successType === 'blockchain') {
            toast.success('Contribuição realizada com sucesso!');
            getImpact();
            getBalance();
            setInput('');
        }
    }

    return (
        <div className={`bg-gradient-to-b from-[#043832] to-[#1F5D38] flex flex-col h-[100vh]`}>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Sintrop App</title>
                <link rel="canonical" href={`https://app.sintrop.com/actions`} />
                <link rel="icon" href="/favicon.png" />
                <meta
                    name="description"
                    content="Sistema Descentralizado de Regeneração da Natureza"
                />
            </Helmet>
            <TopBar />
            <Header routeActive='actions' />

            <div className="flex flex-col items-center w-full mt-32 overflow-y-auto">
                <div className="flex gap-3 flex-wrap lg:w-[1024px] mt-3 justify-center">
                    {walletConnected === '' ? (
                        <div className="mt-3 flex flex-col w-full">
                            <p className="font-semibold text-white">{t('voceNaoConectado')}</p>
                            <Dialog.Root open={modalConnect} onOpenChange={(open) => setModalConnect(open)}>
                                <Dialog.Trigger
                                    className="w-fit py-2 px-5 bg-blue-500 rounded-md text-white font-bold mt-1"
                                >
                                    {t('conectar')}
                                </Dialog.Trigger>

                                <ModalConnectAccount close={() => setModalConnect(false)} />
                            </Dialog.Root>

                            <div className="p-2 rounded-md bg-[#03364B] flex flex-col w-full mt-5">
                                <div className="flex items-center gap-2">
                                    <MdHelpOutline color='white' size={25} />
                                    <p className="font-semibold text-white">{t('ajuda')}</p>
                                </div>

                                <div className="flex items-center flex-wrap gap-2 mt-1">
                                    <a
                                        href='https://docs.sintrop.com'
                                        target="_blank"
                                        className="p-2 rounded-md bg-[#012939] flex items-center gap-2"
                                    >
                                        <SiReadthedocs size={25} color='white' />
                                        <p className="font-bold text-white text-sm">{t('documentacao')}</p>
                                    </a>

                                    <a
                                        href='https://www.sintrop.com/app'
                                        target="_blank"
                                        className="p-2 rounded-md bg-[#012939] flex items-center gap-2"
                                    >
                                        <FaMobile size={25} color='white' />
                                        <p className="font-bold text-white text-sm">App mobile</p>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full flex flex-col">
                            <p className="font-bold text-white text-lg">{t('contribuicao')}</p>
                            <div className="flex flex-col bg-[#03364B] p-3 rounded-md mt-1 gap-8 lg:flex-row">
                                <div className="flex flex-col w-full lg:w-[300px]">
                                    <p className="text-gray-300 text-sm">{t('vejaImpactoContribuicao')}</p>

                                    <div className="w-full border-b border-green-600 my-3" />

                                    <p className="text-white text-sm mb-1">{t('quantoDesejaContribuir')}</p>
                                    <input
                                        type="number"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        className="px-2 py-2 bg-[#012939] rounded-md font-bold text-white"
                                        placeholder={t('digiteAqui')}
                                    />

                                    {maxAmmount && (
                                        <p className="text-red-500 mt-1 text-sm">{t('saldoInsuficiente')}</p>
                                    )}

                                    {walletConnected === '' ? (
                                        <p className="text-white mt-3 text-xs">{t('voceNaoConectado')}</p>
                                    ) : (
                                        <div className="flex flex-col mt-3">
                                            <p className="text-white text-xs">{t('seuSaldo')}</p>
                                            <div className="flex items-center gap-2 bg-[#012939] p-2 rounded-md">
                                                <img
                                                    src={require('../../assets/token.png')}
                                                    className="w-8 h-8 object-contain"
                                                    alt='icon do credito de regeneração'
                                                />

                                                <p className="font-bold text-white text-sm">{Intl.NumberFormat('pt-BR').format(Number(balanceData?.balance).toFixed(5))}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col w-[300px]">
                                    <p className="text-gray-300 text-sm">{t('impactoSuaContribuicao')}:</p>

                                    <div className="w-full border-b border-green-600 my-3" />

                                    <p className="text-white text-sm mb-1">{t('carbono')}: <span className="font-bold">{Intl.NumberFormat('pt-BR').format(Number(impactInvestor?.carbon).toFixed(2))} kg</span></p>
                                    <p className="text-white text-sm mb-1">{t('solo')}: <span className="font-bold">{Intl.NumberFormat('pt-BR').format(Number(impactInvestor?.soil).toFixed(2))} m²</span></p>
                                    <p className="text-white text-sm mb-1">{t('agua')}: <span className="font-bold">{Intl.NumberFormat('pt-BR').format((Number(impactInvestor?.water) * 1000).toFixed(2))} L</span></p>
                                    <p className="text-white text-sm mb-1">{t('bio')}: <span className="font-bold">{Intl.NumberFormat('pt-BR').format(Number(impactInvestor?.bio).toFixed(2))} uv</span></p>
                                </div>
                            </div>

                            <button
                                className="w-full p-3 bg-blue-500 rounded-md flex justify-between items-center mt-3 mb-5"
                                onClick={handleContribute}
                            >
                                {loading ? (
                                    <>
                                        <div />
                                        <ActivityIndicator size={25} />
                                        <div />
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={require('../../assets/icon-contribuir.png')}
                                                className="w-8 h-8 object-contain"
                                                alt='Icone do botão contribuir'
                                            />
                                            <p className="font-bold text-white">{t('contribuir')}</p>
                                        </div>

                                        <FaChevronRight size={20} color='white' />
                                    </>
                                )}
                            </button>

                            <div className="flex flex-col w-full gap-1 mb-5">
                                <p className="font-semibold text-white">{t('ações')}</p>

                                <div className="p-2 rounded-md bg-[#03364B] flex flex-col w-full">
                                    {userData?.userType === 1 && (
                                        <ProducerActions />
                                    )}

                                    {userData?.userType === 2 && (
                                        <InspectorActions />
                                    )}

                                    {userData?.userType === 3 && (
                                        <ResearcherActions />
                                    )}

                                    {userData?.userType === 4 && (
                                        <DeveloperActions />
                                    )}

                                    {userData?.userType === 6 && (
                                        <ActvistActions />
                                    )}

                                    {userData?.userType === 7 && (
                                        <SupporterActions />
                                    )}

                                    {userData?.userType === 8 && (
                                        <ValidatorActions />
                                    )}
                                </div>
                            </div>

                            {userData?.userType === 1 && (
                                <div className="flex flex-col w-full">
                                    <p className="font-semibold text-white">{t('demaisAcoesNoApp')}</p>

                                    <div className="p-2 rounded-md bg-[#03364B] flex flex-col w-full mt-2">
                                        <div className="flex items-center gap-2">
                                            <FaMobile color='white' size={25} />
                                            <p className="font-semibold text-white">{t('baixeNossoApp')}</p>
                                        </div>

                                        <div className="flex mt-5 items-center gap-8">
                                            <div className="flex flex-col items-center gap-1">
                                                <QRCode
                                                    value='https://www.sintrop.com/app'
                                                    size={120}
                                                    qrStyle="dots"
                                                    logoPadding={2}
                                                    logoPaddingStyle="square"
                                                    logoWidth={30}
                                                    removeQrCodeBehindLogo
                                                    eyeColor='#03364B'
                                                />

                                                <p className="text-sm text-gray-300">{t('leiaQRCode')}</p>
                                            </div>

                                            <p className="text-sm text-gray-300">{t('ou')}</p>

                                            <a
                                                className="py-1 px-5 rounded-md text-white font-semibold bg-blue-500"
                                                href="https://www.sintrop.com/app"
                                                target="_blank"
                                            >
                                                {t('cliqueAquiParaAcessar')}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {userData?.userType === 2 && (
                                <div className="flex flex-col w-full">
                                    <p className="font-semibold text-white">{t('demaisAcoesNoApp')}</p>

                                    <div className="p-2 rounded-md bg-[#03364B] flex flex-col w-full mt-2">
                                        <div className="flex items-center gap-2">
                                            <FaMobile color='white' size={25} />
                                            <p className="font-semibold text-white">{t('baixeNossoApp')}</p>
                                        </div>

                                        <div className="flex mt-5 items-center gap-8">
                                            <div className="flex flex-col items-center gap-1">
                                                <QRCode
                                                    value='https://www.sintrop.com/app'
                                                    size={120}
                                                    qrStyle="dots"
                                                    logoPadding={2}
                                                    logoPaddingStyle="square"
                                                    logoWidth={30}
                                                    removeQrCodeBehindLogo
                                                    eyeColor='#03364B'
                                                />

                                                <p className="text-sm text-gray-300">{t('leiaQRCode')}</p>
                                            </div>

                                            <p className="text-sm text-gray-300">{t("ou")}</p>

                                            <a
                                                className="py-1 px-5 rounded-md text-white font-semibold bg-blue-500"
                                                href="https://www.sintrop.com/app"
                                                target="_blank"
                                            >
                                                {t('cliqueAquiParaAcessar')}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* {userData?.userType === 3 && (
                                <ResearcherActions />
                            )}

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
                            )} */}
                        </div>
                    )}
                </div>
            </div>

            <div className="hidden lg:flex">
                <Feedback />
                <Chat />
            </div>

            {showModalWhereExecuteTransaction && (
                <ModalWhereExecuteTransaction
                    additionalData={JSON.stringify(addDataTransaction)}
                    transactionType='burn-tokens'
                    close={() => setShowModalWhereExecuteTransaction(false)}
                    success={successBurn}
                />
            )}

            {showModalRealizeAction && (
                <ModalRealizeAction
                    close={() => setShowModalRealizeAction(false)}
                />
            )}

            <ToastContainer />
        </div>
    )
}