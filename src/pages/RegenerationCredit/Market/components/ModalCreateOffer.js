import React, { useEffect, useState } from "react";
import { api } from "../../../../services/api";
import { useMainContext } from "../../../../hooks/useMainContext";
import { MdClose } from "react-icons/md";
import { Info } from "../../../../components/Info";
import { ActivityIndicator } from "../../../../components/ActivityIndicator";

export function ModalCreateOffer({ close, offerCreated }) {
    const { userData } = useMainContext();
    const [tokens, setTokens] = useState('');
    const [balanceData, setBalanceData] = useState({});
    const [maxAmmout, setMaxAmmount] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getBalance();
    }, []);

    useEffect(() => {
        if (balanceData) {
            if (Number(String(tokens).replace(',', '.')) > Number(String(balanceData?.balance).replace(',', '.'))) {
                setMaxAmmount(true);
            } else {
                setMaxAmmount(false)
            }
        }
    }, [tokens]);

    async function getBalance() {
        setLoading(true);
        const response = await api.get(`/web3/balance-tokens/${userData?.wallet}`);
        setBalanceData(response.data);
        setLoading(false);
    }

    async function handleCreateOffer() {
        if (loading) {
            return;
        }
        if (maxAmmout) {
            return;
        }
        if(!tokens.trim()){
            return;
        }
        if(tokens === '0'){
            return;
        }

        try {
            setLoading(true);
            const response = await api.post('/offer', {
                userId: userData?.id,
                tokens: Number(String(tokens).replace(',', '.'))
            });

            offerCreated();
            close();
        } catch (err) {
            alert('Algo deu errado, tente novamente!');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='flex justify-center items-center inset-0'>
            <div className='bg-[rgba(0,0,0,0.6)] fixed inset-0' onClick={close} />
            <div className='absolute flex flex-col p-3 lg:w-[400px] lg:h-[400px] bg-[#0a4303] rounded-md mx-2 my-2 lg:my-auto lg:mx-auto inset-0 border-2 z-50'>
                <div className="flex items-center w-full justify-between mb-5">
                    <div className="w-[25px]" />
                    <p className="font-bold text-white">Criar oferta</p>
                    <button onClick={close}>
                        <MdClose size={25} color='white' />
                    </button>
                </div>

                <Info
                    text1='Toda a negociação é feita pelos usuários, essa é só uma forma de conectar o vendedor ao comprador, por isso, nunca transfira os tokens antes do pagamento!'
                />

                <div className="flex flex-col mt-3">
                    <p className="text-white font-semibold">Seu saldo</p>
                    <div className="flex items-center gap-2 bg-green-950 p-2 rounded-md">
                        <img
                            src={require('../../../../assets/token.png')}
                            className="w-8 h-8 object-contain"
                        />

                        <p className="font-bold text-white text-sm">{Intl.NumberFormat('pt-BR', {maximumFractionDigits: 0}).format(balanceData?.balance)} RC</p>
                    </div>
                </div>
                <p className="text-white font-semibold mt-3">Quantos tokens deseja vender?</p>
                <input
                    value={tokens}
                    onChange={(e) => setTokens(e.target.value)}
                    placeholder="Digite aqui"
                    className="p-2 rounded-md bg-green-950 text-white"
                    type="number"
                />

                {maxAmmout && (
                    <p className="mt-1 text-center text-red-500 text-sm">Saldo insuficiente!</p>
                )}

                <div className="mt-5 flex items-center justify-center gap-3">
                    <button
                        onClick={handleCreateOffer}
                        className="text-white font-semibold text-center h-10 w-full bg-blue-500 rounded-md px-10"
                    >
                        {loading ? (
                            <ActivityIndicator size={20}/>
                        ) : (
                            'Criar oferta'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}