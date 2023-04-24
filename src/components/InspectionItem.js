import React, {useEffect, useState} from 'react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import {AiFillCaretDown, AiFillCaretUp} from 'react-icons/ai';
import { api } from '../services/api';
import {useMainContext} from '../hooks/useMainContext';
import { ToastContainer, toast } from 'react-toastify';
import * as Dialog from '@radix-ui/react-dialog';
import { LoadingTransaction } from './LoadingTransaction';
import { useParams } from 'react-router';
import { AcceptInspection } from '../services/manageInspectionsService';
import {GetProducer} from '../services/producerService';

export function InspectionItem({data, type}){
    const {walletAddress} = useParams();
    const {user} = useMainContext();
    const {t} = useTranslation();
    const [loading, setLoading] = useState(false);
    const [moreInfo, setMoreInfo] = useState(false);
    const [producerData, setProducerData] = useState({});
    const [producerDataApi, setProducerDataApi] = useState([]);
    const [producerAddress, setProducerAddress] = useState({});
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});
    const [loadingTransaction, setLoadingTransaction] = useState(false);

    useEffect(() => {
        getProducerDataApi();
        getProducer()
    }, []);

    async function getProducer() {
        setLoading(true);
        const response = await GetProducer(data?.createdBy)
        setProducerData(response);
    }

    async function getProducerDataApi(){
        try{
            const response = await api.get(`/user/${String(data?.createdBy).toUpperCase()}`);
            setProducerDataApi(response.data);
            const address = JSON.parse(response.data.user.address);
            setProducerAddress(address);
        }catch(err){
            console.log(err);
        }
    }

    function handleAccept(){
        if(user !== '2'){
            toast.error(`${t('This account is not activist')}!`);
            return;
        }
        if(data.status === '2'){
            toast.error(`${t('This inspection has been inspected')}!`);
            return;
        }
        if(data.status === '3'){
            toast.error(`${t('This inspection has been expired')}!`);
            return;
        }
        if(data.status === '1'){
            toast.error(`${t('This inspection has been accepted')}!`);
            return;
        }

        if(!producerData || !producerDataApi){
            return;
        }
        
        acceptInspection();
    }

    async function acceptInspection(){
        setModalTransaction(true);
        setLoadingTransaction(true);
        AcceptInspection(data.id, walletAddress)
        .then(res => {
            setLogTransaction({
                type: res.type,
                message: res.message,
                hash: res.hashTransaction
            })
            setLoadingTransaction(false);
            registerInspectionAPI();
        })
        .catch(err => {
            setLoadingTransaction(false);
            const message = String(err.message);
            if(message.includes("Can't accept yet")){
                setLogTransaction({
                    type: 'error',
                    message: "Can't accept yet",
                    hash: ''
                })
                return;
            }
            if(message.includes("Please register as activist")){
                setLogTransaction({
                    type: 'error',
                    message: "Please register as activist!",
                    hash: ''
                })
                return;
            }
            if(message.includes("This inspection don't exists")){
                setLogTransaction({
                    type: 'error',
                    message: "This inspection don't exists!",
                    hash: ''
                })
                return;
            }
            if(message.includes("Already inspected this producer")){
                setLogTransaction({
                    type: 'error',
                    message: "Already inspected this producer!",
                    hash: ''
                })
                return;
            }
            setLogTransaction({
                type: 'error',
                message: 'Something went wrong with the transaction, please try again!',
                hash: ''
            })
        })
    }

    async function registerInspectionAPI(){
        const data = {
            name: producerData?.name,
            totalInspections: producerData?.totalInspections,
            recentInspection: producerData?.recentInspection,
            propertyAddress: JSON.parse(producerDataApi?.address),
            propertyArea: producerData?.certifiedArea,
            propertyGeolocation: producerDataApi?.propertyGeolocation,
            proofPhoto: producerDataApi?.imgProfileUrl,
            producerWallet: producerData?.producerWallet,
            pool: {
                currentEra: producerData?.pool?.currentEra
            },
            lastRequestAt: producerData?.lastRequestAt,
            isa: {
                isaAverage: producerData?.isa?.isaAverage,
                isaScore: producerData?.isa?.isaScore,
                sustainable: producerData?.isa?.sustainable
            }
        }

        const propertyData = JSON.stringify(data);

        try{
            await api.post('/inspections',{
                inspectionId: String(data.id),
                createdBy: String(data.createdBy),
                createdAt: String(data.createdAtTimestamp),
                userWallet: String(walletAddress).toUpperCase(),
                propertyData
            })
        }catch(err){
            console.log(err);
        }finally{

        }
    }

    return(
        <div className='flex flex-col'>
            <div className="flex items-center w-full py-2 gap-3 bg-[#0a4303]">
                <div className='flex items-center lg:w-[300px] bg-[#0A4303] px-2'>
                    <p className='text-white max-w-[10ch] text-ellipsis overflow-hidden'>{data.createdBy}</p>
                </div>

                {type === 'manage' && (
                    <div className='hidden lg:flex items-center h-full w-full bg-[#0A4303]'>
                        <p className='text-white'>{producerAddress?.city}/{producerAddress?.state}, {producerAddress?.street}</p>
                    </div>
                )}

                <div className='hidden lg:flex items-center h-full w-[300px] bg-[#0A4303]'>
                    <p className='text-white max-w-[10ch] text-ellipsis overflow-hidden'>{data.acceptedBy}</p>
                </div>

                <div className='hidden lg:flex items-center h-full w-[300px] bg-[#0A4303]'>
                    <p className='text-white '>{format(new Date(Number(data?.createdAtTimestamp) * 1000), 'dd/MM/yyyy kk:mm')}</p>
                </div>

                {type === 'manage' && (
                    <div className='hidden lg:flex items-center h-full w-[300px] bg-[#0A4303]'>
                        <p className='text-white'>0 Blocks to expire</p>
                    </div>
                )}

                {type === 'manage' && (
                    <div className='flex items-center h-full w-[300px] bg-[#0A4303]'>
                        {data.status === '0' && (
                            <div className='flex items-center justify-center w-full h-8 rounded-lg bg-[#F4A022]'>
                                <p className='text-xs text-white font-bold'>{t('OPEN')}</p>
                            </div>
                        )}

                        {data.status === '1' && (
                            <div className='flex items-center justify-center w-full h-8 rounded-lg bg-[#3E9EF5]'>
                                <p className='text-xs text-white font-bold'>{t('ACCEPTED')}</p>
                            </div>
                        )}

                        {data.status === '2' && (
                            <div className='flex items-center justify-center w-full h-8 rounded-lg bg-[#2AC230]'>
                                <p className='text-xs text-white font-bold'>{t('INSPECTED')}</p>
                            </div>
                        )}

                        {data.status === '3' && (
                            <div className='flex items-center justify-center w-full h-8 rounded-lg bg-[#C52A15]'>
                                <p className='text-xs text-white font-bold'>{t('EXPIRED')}</p>
                            </div>
                        )}
                    </div>
                )}

                {type === 'history' && (
                    <div className='flex items-center h-full w-[300px] bg-[#0A4303]'>
                        <p className='text-white'>{data.isaScore}</p>
                    </div>
                )}

                <div className='flex justify-end pr-2 items-center h-full w-[300px] bg-[#0A4303]'>
                    {type === 'history' && (
                        <>
                        <button
                            onClick={() => {
                                if(data.status === '0'){
                                    handleAccept()
                                }
                            }}
                            className='font-bold w-full text-[#062C01] text-sm bg-[#ff9900] rounded-md py-2'
                        >
                            {t('See Result')}
                        </button>
                        </>
                    )}

                    {type === 'manage' && (
                        <>
                            <div className='flex lg:hidden'>
                                <button
                                    onClick={() => setMoreInfo(!moreInfo)}
                                >
                                    {moreInfo ? (
                                        <AiFillCaretUp
                                            size={30}
                                            color='white'
                                        />    
                                    ) : (
                                        <AiFillCaretDown
                                            size={30}
                                            color='white'
                                        />
                                    )}
                                </button>
                            </div>
                            <div className='hidden lg:flex w-full h-full'>
                                {user === '2' && (
                                    <button
                                        onClick={() => {
                                            if(data.status === '0'){
                                                handleAccept()
                                            }
                                        }}
                                        className='font-bold w-full text-[#062C01] text-sm bg-[#ff9900] rounded-md'
                                    >
                                        {data.status === '0' && `${t('Accept')} ${t('Inspection')}`}
                                        {data.status === '1' && t('Realize Inspection')}
                                    </button>
                                )}
                            </div>
                        </>
                    )}

                </div>
            </div>

            {moreInfo && (
                <div className='w-full bg-[#0a4303] flex flex-col p-2 border-b-2 border-green-950'>
                    <p className='font-bold text-white'>{t('Address')}:</p>
                    <p className='text-white'>Cidade/Estado, complemento</p>

                    <p className='font-bold text-white mt-3'>{t('Accepted By')}:</p>
                    <p className='text-white'>{data.acceptedBy}</p>

                    <p className='font-bold text-white mt-3'>{t('Created At')}:</p>
                    <p className='text-white'>{format(new Date(Number(data?.createdAtTimestamp) * 1000), 'dd/MM/yyyy kk:mm')}</p>

                    {type === 'manage' && (
                        <>
                        <p className='font-bold text-white mt-3'>{t('Expires In')}:</p>
                        <p className='text-white'>0 Blocks to expire</p>

                        <div className='w-full mt-3'>
                            <button
                                onClick={() => {
                                    if(data.status === '0'){
                                        handleAccept()
                                    }
                                }}
                                className='font-bold w-full text-[#062C01] text-sm bg-[#ff9900] rounded-md py-2'
                            >
                                {data.status === '0' && `${t('Accept')} ${t('Inspection')}`}
                                {data.status === '1' && t('Realize Inspection')}
                            </button>
                        </div>
                        </>
                    )}
                </div>
            )}

                <Dialog.Root
                        open={modalTransaction}
                        onOpenChange={(open) => {
                            if(!loadingTransaction){
                                setModalTransaction(open);
                                //reloadInspection();
                                //close();
                            }
                        }}
                >
                        <LoadingTransaction
                            loading={loadingTransaction}
                            logTransaction={logTransaction}
                        />
                </Dialog.Root>

            <ToastContainer/>
        </div>
    )
}