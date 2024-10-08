import React, { useEffect, useState } from "react";
import { api } from "../../../../services/api";
import { QRCode } from "react-qrcode-logo";
import { FaCalculator, FaChevronRight } from "react-icons/fa";
import { ItemsCalculator } from "./ItemsCalculator";
import { useTranslation } from "react-i18next";

export function ContributeTokensPubli({ data }) {
    const {t} = useTranslation();
    const additionalData = JSON.parse(data?.additionalData);
    const userData = additionalData?.userData;

    const [modalItems, setModalItems] = useState(false);
    const [transactionHash, setTransactionHash] = useState('');
    const [impact, setImpact] = useState(null);
    const [itemsCalculator, setItensCalculator] = useState([]);

    useEffect(() => {
        getImpact(additionalData?.transactionHash, additionalData?.tokens);
        if (additionalData?.itens?.length > 0) {
            setItensCalculator(additionalData.itens)
        }
    }, []);

    async function getImpact(transactionHash, tokens) {
        const response = await api.get(`/tokens-burned/by-hash/${transactionHash}`);
        const resImpact = response.data.tokensBurned[0]

        setTransactionHash(response.data.tokensBurned[0].transactionHash)

        let data = {
            soil: Number(resImpact?.soil) * Number(tokens),
            carbon: Number(resImpact?.carbon) * Number(tokens),
            water: Number(resImpact?.water) * Number(tokens),
            bio: Number(resImpact?.bio) * Number(tokens),
        }
        setImpact(data)
    }

    if (additionalData?.tokens === 0) {
        return (
            <div />
        )
    }

    return (
        <div className="flex flex-col">
            <div className="flex flex-col bg-green-950">
                <div className="h-9 flex items-center justify-center border-b border-green-700 w-full">
                    <p className="text-white">
                        {t('contribuiuCom')} <span className="font-bold text-green-700">{Intl.NumberFormat('pt-BR').format(Number(additionalData?.tokens))}</span> {t('creditosRegen')}
                    </p>

                    <img
                        src={require('../../../../assets/token.png')}
                        className="h-6 w-6 rounded-full object-contain ml-3"
                    />
                </div>

                <div className="h-9 flex items-center px-3 border-b border-green-700 w-full">
                    <p className="text-gray-400 text-sm">{t('financiandoOImpacto')}:</p>
                </div>

                <div className="flex justify-between p-3">
                    <div className="flex flex-col gap-1">
                        <p className="text-white text-sm">
                            {t('carbono')}: <span className="font-bold">{Intl.NumberFormat('pt-BR').format(Number(impact?.carbon).toFixed(2))} kg</span>
                        </p>

                        <p className="text-white text-sm">
                            {t('solo')}: <span className="font-bold">{Intl.NumberFormat('pt-BR').format(Number(impact?.soil).toFixed(2))} m²</span>
                        </p>

                        <p className="text-white text-sm">
                            {t('agua')}: <span className="font-bold">{Intl.NumberFormat('pt-BR').format((Number(impact?.water) * 1000).toFixed(2))} L</span>
                        </p>

                        <p className="text-white text-sm">
                            {t('bio')}: <span className="font-bold">{Intl.NumberFormat('pt-BR').format(Number(impact?.bio).toFixed(2))} uv</span>
                        </p>

                        <a
                            className="mt-5 underline text-blue-400"
                            href={`https://${window.location.host}/supporter/${String(userData?.wallet).toLowerCase()}`}
                            target="_blank"
                        >
                            {t('verContribuicoes')}
                        </a>
                    </div>

                    <div className="flex bg-[#0a4303] p-3 rounded-md">
                        <QRCode
                            value={`https://${window.location.host}/supporter/${String(userData?.wallet).toLowerCase()}`}
                            size={120}
                            logoImage={require('../../../../assets/icone.png')}
                            qrStyle="dots"
                            logoPadding={2}
                            logoPaddingStyle="square"
                            logoWidth={30}
                            removeQrCodeBehindLogo
                            eyeColor='#0a4303'
                        />
                    </div>
                </div>
            </div>

            {itemsCalculator.length > 0 && (
                <button className="flex items-center justify-between mt-2 bg-green-600 rounded-md px-3 py-2" onClick={() => setModalItems(true)}>
                    <div className="flex items-center gap-1">
                        <FaCalculator size={25} color='white'/>

                        <div className="flex flex-col items-start">
                            <p className="font-semibold text-white text-sm">Esta contribuição foi feita com a calculadora de impacto</p>
                            <p className="text-gray-300 text-xs">Toque para ver detalhes</p>
                        </div>
                    </div>

                    <FaChevronRight size={20} color='white' />
                </button>
            )}

            {modalItems && (
                <ItemsCalculator
                    items={itemsCalculator}
                    close={() => setModalItems(false)}
                />
            )}
        </div>
    )
}