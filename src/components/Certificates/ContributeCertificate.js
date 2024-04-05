import React, {useEffect, useState} from "react";
import { api } from "../../services/api";
import { QRCode } from "react-qrcode-logo";

export function ContributeCertificate({wallet}){
    const [userData, setUserData] = useState({});
    const [impactInvestor, setImpactInvestor] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getDataUser()
    }, []);

    async function getDataUser() {
        setLoading(true);
        const responseUser = await api.get(`/web3/contributions/${String(wallet).toLowerCase()}`);
        setUserData(responseUser.data);

        let carbon = 0;
        let water = 0;
        let bio = 0;
        let soil = 0;
        const response = await api.get(`/tokens-burned/by-wallet/${String(wallet).toLowerCase()}`);
        const arrayTokens = response.data.tokensBurned;
        for (var i = 0; i < arrayTokens.length; i++) {
            const tokens = arrayTokens[i].tokens;
            carbon += tokens * arrayTokens[i]?.carbon;
            water += tokens * arrayTokens[i]?.water;
            bio += tokens * arrayTokens[i]?.bio;
            soil += tokens * arrayTokens[i]?.soil;
        }

        setImpactInvestor({ carbon, water, bio, soil })
        setLoading(false);
    }

    return(
        <div className="flex flex-col bg-green-950 rounded-md border-2 border-white lg:w-[500px]">
            <div className="flex w-full items-center justify-center py-3 border-b border-green-500">
                <p className="text-white text-center text-xs lg:text-sm">Já contribuiu com: <span className="font-bold text-white text-base">{Intl.NumberFormat('pt-BR').format(Number(userData?.tokensBurned))}</span> Créditos de Regeneração</p>
            </div>
            <div className="flex w-full items-center pl-3 py-3 border-b border-green-500">
                <p className="text-xs lg:text-sm text-white">Financiando o impacto de:</p>
            </div>
            <div className="flex w-full items-center py-3">
                <div className="flex flex-col pl-3 w-[50%]">
                    <p className="text-white text-xs lg:text-base">Carbono: <span className="font-bold">{Intl.NumberFormat('pt-BR', {maximumFractionDigits: 2}).format(impactInvestor?.carbon)} kg</span></p>
                    <p className="text-white text-xs lg:text-base">Solo: <span className="font-bold">{Intl.NumberFormat('pt-BR', {maximumFractionDigits: 2}).format(impactInvestor?.soil)} m²</span></p>
                    <p className="text-white text-xs lg:text-base">Água: <span className="font-bold">{Intl.NumberFormat('pt-BR', {maximumFractionDigits: 2}).format(impactInvestor?.water)} m³</span></p>
                    <p className="text-white text-xs lg:text-base">Biodiversidade: <span className="font-bold">{Intl.NumberFormat('pt-BR', {maximumFractionDigits: 2}).format(impactInvestor?.bio)} uv</span></p>
                </div>

                <div className="flex flex-col w-[50%] items-end pr-3">
                    <div className="flex bg-green-950 p-3 rounded-md w-fit">
                        <div className="bg-white p-1 rounded-md hidden lg:flex">
                            <QRCode
                                value={`https://${window.location.host}/supporter/${wallet}`}
                                size={120}
                                qrStyle="dots"
                                logoImage={require('../../assets/token.png')}
                                logoPadding={2}
                                logoPaddingStyle="square"
                                logoWidth={30}
                                removeQrCodeBehindLogo
                                eyeColor='#0a4303'
                            />
                        </div>

                        <div className="bg-white p-1 rounded-md lg:hidden flex">
                            <QRCode
                                value={`https://${window.location.host}/supporter/${wallet}`}
                                size={80}
                                qrStyle="dots"
                                logoImage={require('../../assets/token.png')}
                                logoPadding={1}
                                logoPaddingStyle="square"
                                logoWidth={20}
                                removeQrCodeBehindLogo
                                eyeColor='#0a4303'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}