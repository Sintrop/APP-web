import React, {useEffect, useState} from "react";
import { MdClose } from "react-icons/md";
import { api } from "../../../services/api";
import { IoMdSearch } from "react-icons/io";
import { ActivityIndicator } from "../../../components/ActivityIndicator";
import { format } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import { useMainContext } from "../../../hooks/useMainContext";
import { useTranslation } from "react-i18next";

export function ModalAddRecord({close, registered}){
    const {t} = useTranslation();
    const {userData} = useMainContext();
    const [items, setItems] = useState([]);
    const [filterItems, setFilterItems] = useState([]);
    const [loadingItems, setLoadingItems] = useState(false);
    const [itemSelected, setItemSelected] = useState(null);
    const [quant, setQuant] = useState('');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [loadingRecord, setLoadingRecord] = useState(false);
    const [visibleDatePicker, setVisibleDatePicker] = useState(false);
    const [impactToken, setImpactToken] = useState({});
    const atualMonth = new Date().getMonth();
    const atualYear = new Date().getFullYear();
    const maxDate = format(new Date(), 'yyyy-MM-dd');
    const minDate = format(new Date(`${atualYear}-${atualMonth + 1}-01`), 'yyyy-MM-dd');

    useEffect(() => {
        getItems();
        getImpactToken();
    }, []);

    async function getItems() {
        try {
            setLoadingItems(true);
            const response = await api.get('calculator/items')
            setItems(response.data.items)
        } catch (error) {
            console.log('Erro ao obter itens: ', error)
        } finally {
            setLoadingItems(false);
        }
    }

    async function getImpactToken() {
        const response = await api.get('/impact-per-token');
        setImpactToken(response.data.impact)
    }

    async function handleRecord() {
        if (!itemSelected) return;
        if (!quant.trim()) {
            toast.error(t('digiteQuantidade'))
            return
        }

        try {
            setLoadingRecord(true);
            const response = await api.post('/invoice/record', {
                userId: userData?.id,
                itemId: itemSelected?.id,
                quant: Number(String(quant).replace(',', '.')),
                date: new Date(date),
                impactTokenCarbon: impactToken?.carbon,
                impactTokenWater: impactToken?.water,
                impactTokenSoil: impactToken?.soil,
                impactTokenBio: impactToken?.bio,
            })
            registered();
            close();
        } catch (err) {
            console.log(err);
            toast.error(t('algoDeuErrado'))
        } finally {
            setLoadingRecord(false);
        }
    }

    return(
        <div className='flex justify-center items-center inset-0'>
            <div className='bg-black/60 fixed inset-0' onClick={close} />
            <div className='absolute flex flex-col p-3 lg:w-[450px] h-[420px] bg-[#03364B] rounded-md m-auto inset-0 border-2 z-50'>
                <div className="flex items-center justify-between">
                    <div className="w-[25px]"/>
                    <p className="font-bold text-white">{t('registrarConsumo')}</p>
                    <button onClick={close}>
                        <MdClose size={25} color='white'/>
                    </button>
                </div>

                <div className="flex flex-col">
                    {itemSelected ? (
                        <>
                            <p className="text-white text-sm mt-5">{t('itemSelecionado')}</p>
                            <button
                                className="flex flex-col w-full bg-[#012939] rounded-md h-11 px-3 text-white"
                                onClick={() => setItemSelected(null)}
                            >
                                {itemSelected?.name}
                                <p className="text-xs text-gray-400">{t('cliqueSelecioneOutro')}</p>
                            </button>

                            <p className="text-white text-sm mt-5">{t('quantidade')} ({itemSelected?.unit})</p>
                            <input
                                value={quant}
                                onChange={(e) => setQuant(e.target.value)}
                                className="w-full h-10 rounded-md bg-[#012939] text-white px-2"
                                placeholder={t('digiteAqui')}
                                type="number"
                            />

                            <p className="text-white text-sm mt-5">{t('data')}</p>
                            <input
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full h-10 rounded-md bg-[#012939] text-white px-2"
                                placeholder={t('digiteAqui')}
                                type="date"
                                max={maxDate}
                            />

                            <button
                                className="mt-10 h-10 w-full bg-blue-500 rounded-md text-white"
                                onClick={handleRecord}
                            >
                                {loadingRecord ? (
                                    <ActivityIndicator size={25}/>
                                ) : (
                                    t('registrarConsumo')
                                )}
                            </button>
                        </>
                    ) : (
                        <>
                            {loadingItems ? (
                                <div className="mt-10">
                                    <ActivityIndicator size={50}/> 
                                </div>
                            ) : (
                                <>
                                    <div className="bg-[#012939] rounded-md w-full flex items-center gap-2 h-10 px-3">
                                        <IoMdSearch size={20} color='white'/>

                                        <input
                                            className="w-full text-white bg-transparent"
                                            placeholder={t('pesquisar')}
                                            onChange={(e) => {
                                                const text = e.target.value;
                                                if (text === '') {
                                                    setFilterItems([]);
                                                    return;
                                                }
                                                const filter = items.filter((item) => item.name.toLowerCase().includes(text.toLowerCase()))
                                                setFilterItems(filter);
                                            }}
                                        />
                                    </div>
                                    
                                    <div className="flex flex-col overflow-y-scroll h-[330px]">
                                        {filterItems.length === 0 ? (
                                            <>
                                                {items.map(item => (
                                                    <button
                                                        key={item.id}
                                                        className="flex items-center w-full px-3 py-2 border-b border-gray-400 text-white font-semibold"
                                                        onClick={() => setItemSelected(item)}
                                                    >
                                                        {item?.name}
                                                    </button>
                                                ))}
                                            </>
                                        ) : (
                                            <>
                                                {filterItems.map(item => (
                                                    <button
                                                        key={item.id}
                                                        className="flex items-center w-full px-3 py-2 border-b border-gray-400 text-white font-semibold"
                                                        onClick={() => setItemSelected(item)}
                                                    >
                                                        {item?.name}
                                                    </button>
                                                ))}
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>

            <ToastContainer/>
        </div>
    )
}