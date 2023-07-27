import React, {useEffect, useState, useContext} from 'react';
import './isa.css';
import './manageInspections.css';
import {useParams} from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { LoadingTransaction } from '../LoadingTransaction';
import { MainContext } from '../../contexts/main';
import {FaLock} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import Loader from '../Loader';

//components
import Loading from '../Loading';
import ItemListInspections from '../ManageInspectionsComponents/ItemListInspections';
import { BackButton } from '../BackButton';

//services
import {GetProducer} from '../../services/producerService';
import {GetInspections, RequestInspection} from '../../services/manageInspectionsService';
import { InspectionItem } from '../InspectionItem';

export default function ManageInpections({walletAddress, setTab}){
    const {t} = useTranslation();
    const {user, blockNumber, walletConnected, getAtualBlockNumber} = useContext(MainContext);
    const [inspections, setInpections] = useState([])
    const [loading, setLoading] = useState(false);
    const {tabActive} = useParams();
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});
    const [lastResquested, setLastRequested] = useState('');
    const [btnRequestHover, setBtnRequestHover] = useState(false);
    const [userData, setUserData] = useState({});
    
    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])

    useEffect(() => {
        getInspections();
        if(user === '1'){
            isProducer()
        }
    }, []);

    async function isProducer() {
        const producer = await GetProducer(walletConnected);
        setUserData(producer);
        setLastRequested(producer.lastRequestAt);
    }

    async function getInspections(){
        setLoading(true);
        const res = await GetInspections();
        const inspections = res.filter(item => item.status !== '2')
        setInpections(inspections.reverse());
        setLoading(false);
    }

    async function requestInspection(){
        setModalTransaction(true);
        setLoadingTransaction(true);
        RequestInspection(walletAddress)
        .then(res => {
            setLogTransaction({
                type: res.type,
                message: res.message,
                hash: res.hashTransaction
            })
            setLoadingTransaction(false);
            getInspections();
        })
        .catch(err => {
            setLoadingTransaction(false);
            const message = String(err.message);
            console.log(message);
            if(message.includes("Request OPEN or ACCEPTED")){
                setLogTransaction({
                    type: 'error',
                    message: 'Request OPEN or ACCEPTED',
                    hash: ''
                })
                return;
            }
            if(message.includes("Recent inspection")){
                setLogTransaction({
                    type: 'error',
                    message: 'Recent inspection!',
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

    if(loading){
        return(
            <div className="flex items-center justify-center bg-green-950 w-full h-screen">
                <Loader
                    color='white'
                    type='hash'
                />
            </div>
        )
    }

    return(
        <div className='flex flex-col bg-green-950 h-[95vh] px-2 lg:px-10 pt-2 lg:pt-10 overflow-auto'>
            <div className='flex flex-col lg:flex-row lg:items-center justify-between mb-2 lg:mb-10'> 
                <div className='flex items-center gap-2'>
                    <BackButton/>
                    <h1 className='font-bold text-lg lg:text-2xl text-white'>{t('Manage Inspections')}</h1>
                </div>
                <div className='flex justify-center items-center gap-5'>
                    {user == 1 && (
                        <button
                            
                            className='flex mt-5 py-2 px-10 bg-[#FF9900] hover:bg-orange-400 font-bold duration-200 rounded-lg lg:mt-0'
                            onClick={() => {
                                if(Number(userData?.totalInspections) < 3){
                                    requestInspection();
                                }
                                if(Number(lastResquested) !== 0){
                                    if((Number(lastResquested) + 33230) - Number(blockNumber) < 0){
                                        requestInspection()
                                    }
                                }
                            }}
                            onMouseEnter={() => setBtnRequestHover(true)}
                            onMouseOut={() => setBtnRequestHover(false)}
                        >
                            {Number(lastResquested) === 0 ? (
                                `${t('Request New Inspection')}`
                            ) : (
                                <>
                                {Number(userData?.totalInspections) < 3 ? (
                                    `${t('Request New Inspection')}`
                                ) : (
                                    <>
                                    {(Number(lastResquested) + 33230) - Number(blockNumber) < 0 ? (
                                        `${t('Request New Inspection')}`
                                    ) : (
                                        <>
                                        {btnRequestHover ? (
                                            <>
                                                <FaLock 
                                                    size={25}
                                                    onMouseEnter={() => setBtnRequestHover(true)}
                                                    onMouseOut={() => setBtnRequestHover(false)}
                                                />
                                                {t('Wait')} {(Number(lastResquested) + 33230) - Number(blockNumber)} {t('blocks to request')}
                                            </>
                                        ) : `${t('Request New Inspection')}`}
                                        </>
                                    )}
                                    </>
                                )}
                                </>
                            )}
                        </button>
                    )}
                    
                </div>
            </div>

            <div className="flex items-center h-10 lg:h-12 lg:w-full mb-3">
                <div className="flex bg-white h-full w-[30%] border-r-2 rounded-l-md px-3">
                    <select
                        className="bg-white border-0 h-full w-full cursor-pointer"
                    >
                        <option value="">Todas as inspeções</option>
                        <option value="">Buscar pela wallet do ativista</option>
                        <option value="">Buscar pela wallet do produtor</option>
                    </select>
                </div>
                <div className="flex bg-white h-full w-[70%] px-3 rounded-r-md">
                    <input
                        className="bg-white border-0 h-full w-full"
                        placeholder="Digite aqui"
                    />
                    <button
                        className="font-bold py-2 rounded-md bg-white"
                    >
                        <img
                            src={require('../../assets/icon-search.png')}
                            className="w-[30px] h-[30px] object-contain"
                        />
                    </button>
                </div>
            </div>
            
                {inspections.length === 0 ? (
                    <h3 className='font-bold text-white'>{t('There are no open inspections')}</h3>
                ) : (
                    <div className='flex flex-col'>
                    <div className="flex flex-col rounded-sm">
                        <div className="flex items-center gap-3 py-1 w-full bg-[#80421A]">
                            <div className='flex items-center h-full lg:w-[50px] px-2 font-bold'>
                                <p className='text-white'>ID</p>
                            </div>

                            <div className='hidden lg:flex items-center h-full lg:w-[200px] px-2 font-bold'>
                                <p className='text-white'>{t('Created At')}</p>
                            </div>
                        </div>

                        <div className='flex flex-col h-[66vh] overflow-auto pb-12'>
                            {inspections.map(item => (
                                <InspectionItem
                                    key={item.id}
                                    data={item}
                                    type='manage'
                                    reload={getInspections}
                                    statusExpired={(id) => {}}
                                />
                            ))}
                        </div>
                    </div> 
                    </div>
                )}
            
            <Dialog.Root 
                open={modalTransaction} 
                onOpenChange={(open) => {
                    if(!loadingTransaction){
                        setModalTransaction(open);
                        getInspections();
                    }
                }}
            >
                <LoadingTransaction
                    loading={loadingTransaction}
                    logTransaction={logTransaction}
                    action='request-inspection'
                />
            </Dialog.Root>
            
        </div>
    )
}