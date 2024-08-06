import React, { useEffect, useState } from "react";
import { getImage } from "../../../../services/getImage";
import { QRCode } from "react-qrcode-logo";
import { SiGooglesheets } from "react-icons/si";
import axios from "axios";

export function ShortPubli({ data }) {
    const [images, setImages] = useState('');
    const [additionalData, setAdditionalData] = useState({});
    const [tokensWithdraw, setTokensWithdraw] = useState(0);

    useEffect(() => {
        if (data?.type === 'publi-user' || data?.type === 'proof-reduce') {
            verifyImages();
        }
        if (data?.additionalData) {
            const addData = JSON.parse(data?.additionalData);
            setAdditionalData(addData);

            if (data?.type === 'withdraw-tokens') {
                getTokensWithdraw(addData.transactionHash, String(addData?.userData.wallet).toLowerCase())
            }
        }
    }, []);

    async function verifyImages() {
        const imagesPubli = JSON.parse(data?.images);

        let newArray = [];

        for (var i = 0; i < imagesPubli.length; i++) {
            const response = await getImage(imagesPubli[i]);
            newArray.push(response);
        }

        setImages(newArray);
    }

    async function getTokensWithdraw(hash, wallet) {
        const response = await axios.get(`https://api-sepolia.etherscan.io/api?module=account&action=tokentx&contractaddress=${process.env.REACT_APP_RCTOKEN_CONTRACT_ADDRESS}&address=${wallet}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`)
        const transactions = response.data.result;

        for (var i = 0; i < transactions.length; i++) {
            if (transactions[i].hash === hash) {
                const tokens = String((Number(transactions[i].value) / 10 ** 18).toFixed(0))
                setTokensWithdraw(tokens)
            }
        }
    }


    return (
        <a
            className="w-[330px] h-[330px] bg-green-600 overflow-hidden"
            href={`https://app.sintrop.com/publication/${data?.id}`}
            target="_blank"
        >

            {data.type === 'publi-user' && (
                <>
                    {images.length === 0 ? (
                        <p className="text-white m-3 text-4xl">{data?.description}</p>
                    ) : (
                        <img
                            src={images[0]}
                            className="w-full h-full object-cover"
                        />
                    )}
                </>
            )}

            {data.type === 'accept-inspection' && (
                <div className="flex items-center p-3 h-full">
                    <p className="text-white font-bold text-4xl">Aceitou a inspeção #{additionalData?.inspectionId}</p>
                </div>
            )}

            {data.type === 'request-inspection' && (
                <div className="flex items-center p-3 h-full">
                    <p className="text-white font-bold text-4xl">Requisitou uma nova inspeção</p>
                </div>
            )}

            {data.type === 'dev-report' && (
                <div className="flex flex-col justify-center items-center p-3 h-full">
                    <p className="font-bold text-white text-xl text-center">Enviou seu relatório de contribuição</p>

                    <SiGooglesheets size={100} color='white' className="mt-5" />
                </div>
            )}

            {data.type === 'withdraw-tokens' && (
                <div className="flex flex-col justify-center items-center p-3 h-full">
                    {tokensWithdraw === 0 ? (
                        <p className="font-bold text-white text-xl text-center">Avançou de ERA na pool de distribuição de tokens</p>
                    ) : (
                        <>
                            <p className="font-bold text-white text-xl text-center">Sacou {Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(Number(tokensWithdraw))} Créditos de Regeneração</p>
                            <img
                                src={require('../../../../assets/token.png')}
                                className="w-28 h-28 object-contain"
                            />
                        </>
                    )}
                </div>
            )}

            {data.type === 'contribute-tokens' && (
                <div className="flex flex-col p-3 items-center justify-center h-full">
                    <p className="font-bold text-white text-xl text-center">Contribuiu com {Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(additionalData?.tokens)} Créditos de Regeneração</p>

                    <div className="mt-5">
                        <QRCode
                            value={`https://app.sintrop.com/supporter/${String(additionalData?.userData?.wallet).toLowerCase()}`}
                            size={130}
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
            )}

            {data.type === 'realize-inspection' && (
                <div className="flex items-center p-3 h-full">
                    <p className="text-white font-bold text-4xl">Realizou a inspeção #{additionalData?.inspectionId}</p>
                </div>
            )}

            {data.type === 'new-user' && (
                <div className="flex p-3 overflow-hidden items-center h-full">
                    <p className='text-white text-2xl'>
                        O(a) usuário(a) <span className='font-bold text-white'>{additionalData?.userData?.name} </span>
                        se cadastrou como
                        <span className='font-bold text-white'>
                            {additionalData?.userData?.userType === 1 && ' Produtor(a) '}
                            {additionalData?.userData?.userType === 2 && ' Inspetor(a) '}
                            {additionalData?.userData?.userType === 3 && ' Pesquisador(a) '}
                            {additionalData?.userData?.userType === 4 && ' Desenvolvedor(a) '}
                            {additionalData?.userData?.userType === 5 && ' Produtor(a) '}
                            {additionalData?.userData?.userType === 6 && ' Ativista '}
                            {additionalData?.userData?.userType === 7 && ' Apoiador(a) '}
                            {additionalData?.userData?.userType === 8 && ' Validador(a) '}
                        </span>
                        na versão 6 do Sistema Descentralizado de Regeneração da Natureza
                    </p>
                </div>
            )}

            {data.type === 'vote-invalidate-user' && (
                <div className="flex flex-col justify-center items-center p-3 h-full">
                    <p className="font-bold text-white text-xl text-center">Visualização indisponível, clique para acessar a publicação</p>
                </div>
            )}

            {data.type === 'vote-invalidate-inspection' && (
                <div className="flex flex-col justify-center items-center p-3 h-full">
                    <p className="font-bold text-white text-xl text-center">Visualização indisponível, clique para acessar a publicação</p>
                </div>
            )}

            {data.type === 'publish-researche' && (
                <div className="flex flex-col p-3 overflow-hidden gap-2 justify-center h-full">
                    <p className="font-bold text-white text-4xl">Publicou uma nova pesquisa</p>
                    <p className="font-bold text-white text-2xl">{additionalData?.title}</p>
                </div>
            )}

            {data.type === 'proof-reduce' && (
                <div className="border-[8px] border-green-500 flex w-full h-full relative">
                    {images.length === 0 ? (
                        <p className="text-white m-3 text-4xl">{data?.description}</p>
                    ) : (
                        <img
                            src={images[0]}
                            className="w-full h-full object-cover"
                        />
                    )}

                    <div className="w-full bg-green-500 p-2 absolute bottom-0 h-14 rounded-t-xl flex items-center">
                        <div className="flex flex-col">
                            <p className="font-bold text-white text-xs">
                                #ReduzirÉObrigaçãoRegenerarÉASolução
                            </p>
                            <p className="font-regular text-white text-xs">
                                Prova de redução do item {additionalData?.nameItem} da calculadora de impacto.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {data.type === 'invite-wallet' && (
                <div className="flex overflow-hidden p-3 items-center h-full">
                    <p className='text-white text-xl max-w-full'>
                        Convidou a wallet <span className='font-bold'>{additionalData?.walletInvited} </span>
                        para se cadastrar como
                        <span className='font-bold'>
                            {additionalData?.userType === 1 && ' Produtor(a) '}
                            {additionalData?.userType === 2 && ' Inspetor(a) '}
                            {additionalData?.userType === 3 && ' Pesquisador(a) '}
                            {additionalData?.userType === 4 && ' Desenvolvedor(a) '}
                            {additionalData?.userType === 5 && ' Produtor(a) '}
                            {additionalData?.userType === 6 && ' Ativista '}
                            {additionalData?.userType === 7 && ' Apoiador(a) '}
                            {additionalData?.userType === 8 && ' Validador(a) '}
                        </span>
                        no Sistema Descentralizado de Regeneração da Natureza e receberá 1% de comissão sobre as contribuições realizadas
                    </p>
                </div>
            )}

            {data.type === 'new-zone' && (
                <div className="flex items-center p-3 h-full">
                    <p className="text-white font-bold text-4xl">Cadastrou uma nova zona de regeneração</p>
                </div>
            )}

            {data.type === 'new-content' && (
                <div className="flex flex-col justify-center items-center p-3 h-full">
                    <p className="font-bold text-white text-xl text-center">Visualização indisponível, clique para acessar a publicação</p>
                </div>
            )}
        </a>
    )
}