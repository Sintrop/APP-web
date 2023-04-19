import React, {useEffect, useState, useContext} from 'react';
import './isa.css';
import './manageInspections.css';
import {useParams} from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { LoadingTransaction } from '../LoadingTransaction';
import { MainContext } from '../../contexts/main';
import {FaLock} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

//components
import Loading from '../Loading';
import ItemListInspections from '../ManageInspectionsComponents/ItemListInspections';

//services
import {GetProducer} from '../../services/producerService';
import {GetInspections, RequestInspection} from '../../services/manageInspectionsService';
import { InspectionItem } from '../InspectionItem';

export default function ManageInpections({walletAddress, setTab}){
    const {t} = useTranslation();
    const {user, blockNumber, walletConnected, getAtualBlockNumber} = useContext(MainContext);
    const [inspections, setInpections] = useState([])
    const [loading, setLoading] = useState(false);
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    const {tabActive} = useParams();
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});
    const [lastResquested, setLastRequested] = useState('');
    const [btnRequestHover, setBtnRequestHover] = useState(false);
    
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
        setLastRequested(producer.lastRequestAt);
    }

    async function getInspections(){
        setLoading(true);
        const res = await GetInspections();
        const inspections = res.filter(item => item.status !== '2')
        setInpections(inspections);
        setLoading(false);
        console.log(res);
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

    return(
        <div className='flex flex-col bg-green-950 h-[95vh] px-2 lg:px-10 pt-3 lg:pt-10 overflow-auto'>
            <div className='flex flex-col lg:flex-row lg:items-center justify-between mb-3 lg:mb-10'> 
                <h1 className='font-bold text-2xl text-white'>{t('Manage Inspections')}</h1>
                <div className='flex justify-center items-center gap-5'>
                    {user == 1 && (
                        <button
                            
                            className='flex mt-5 py-2 px-10 bg-[#FF9900] hover:bg-orange-400 font-bold duration-200 rounded-lg lg:mt-0'
                            onClick={() => {
                                if(Number(lastResquested) === 0){
                                    requestInspection()
                                }
                                if(Number(lastResquested) !== 0){
                                    if((Number(lastResquested) + Number(process.env.REACT_APP_TIME_BETWEEN_INSPECTIONS)) - Number(blockNumber) < 0){
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
                                {(Number(lastResquested) + Number(process.env.REACT_APP_TIME_BETWEEN_INSPECTIONS)) - Number(blockNumber) < 0 ? (
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
                                            {t('Wait')} {(Number(lastResquested) + Number(process.env.REACT_APP_TIME_BETWEEN_INSPECTIONS)) - Number(blockNumber)} {t('blocks to request')}
                                        </>
                                    ) : `${t('Request New Inspection')}`}
                                    </>
                                )}
                                </>
                            )}
                        </button>
                    )}
                    
                </div>
            </div>

            <div className="flex items-center h-12 lg:w-full mb-3">
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
                    <h3>{t('There are no open inspections')}</h3>
                ) : (
                    <div className="flex flex-col border-4 border-[#3E9EF5] rounded-sm">
                        <div className="flex items-center gap-3 py-1 w-full bg-[#0a4303] border-b-2 border-[#3E9EF5]">
                            <div className='flex items-center h-full lg:w-[300px] px-2 font-bold'>
                                <p className='text-white'>{t('Requested By')}</p>
                            </div>
                            <div className='hidden lg:flex items-center h-full w-full px-1 font-bold'>
                                <p className='text-white'>{t('Producer Address')}</p>
                            </div>
                            <div className='hidden lg:flex items-center h-full w-[300px] px-1 font-bold'>
                                <p className='text-white'>{t('Inspected By')}</p>
                            </div>
                            <div className='hidden lg:flex items-center h-full w-[300px] px-1 font-bold'>
                                <p className='text-white'>{t('Created At')}</p>
                            </div>
                            <div className='hidden lg:flex items-center h-full w-[300px] px-1 font-bold'>
                                <p className='text-white'>{t('Expires In')}</p>
                            </div>
                            <div className='flex items-center h-full w-[300px] px-1 font-bold'>
                                <p className='text-white'>Status</p>
                            </div>
                            <div className='flex items-center h-full w-[300px] px-1 font-bold'>
                                <p className='text-white'>{t('Actions')}</p>
                            </div>
                        </div>

                        <div className='flex flex-col'>
                            {inspections.map(item => (
                                <InspectionItem
                                    key={item.id}
                                    data={item}
                                    type='manage'
                                />
                            ))}
                        </div>
                    </div>

                    // <table>
                    //     <thead>
                    //         <th className='th-wallet'>{t('Requested By')}</th>
                    //         <th>{t('Producer Address')}</th>
                    //         <th className='th-wallet'>{t('Inspected By')}</th>
                    //         <th>{t('Created At')}</th>
                    //         <th>{t('Expires In')}</th>
                    //         <th className='th-wallet'>Status</th>
                    //         <th className='th-wallet'>Isa {t('Score')}</th>
                    //         <th className='th-wallet'>{t('Actions')}</th>
                    //     </thead>
                    //     <tbody>
                    //         {inspections.map(item => {
                    //             if(item.status != '2'){
                    //                 return(
                    //                     <ItemListInspections
                    //                         data={item}
                    //                         user={user}
                    //                         walletAddress={walletAddress}
                    //                         key={item.id}
                    //                         reloadInspections={() => getInspections()}
                    //                         setTab={(tab, wallet) => setTab(tab, wallet)}
                    //                     />
                    //                 )
                    //             }
                    //         })}
                    //     </tbody>
                    // </table>
                
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
                />
            </Dialog.Root>
            {loading && (
                <Loading/>
            )}
        </div>
    )
}