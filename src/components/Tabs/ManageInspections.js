import React, {useEffect, useState, useContext} from 'react';
import './isa.css';
import './manageInspections.css';
import {useParams} from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { LoadingTransaction } from '../LoadingTransaction';
import { MainContext } from '../../contexts/main';
import {FaLock} from 'react-icons/fa';

//components
import Loading from '../Loading';
import ItemListInspections from '../ManageInspectionsComponents/ItemListInspections';

//services
import {GetProducer} from '../../services/producerService';
import {GetInspections, RequestInspection, CanRequestInspection} from '../../services/manageInspectionsService';

export default function ManageInpections({walletAddress, setTab}){
    const {user, blockNumber, walletConnected, getAtualBlockNumber} = useContext(MainContext);
    const [inspections, setInpections] = useState([])
    const [loading, setLoading] = useState(false);
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    const {tabActive} = useParams();
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});
    const [mayRequestInspection, setMayRequestInspection] = useState(false);
    const [lastResquested, setLastRequested] = useState('');
    const [btnRequestHover, setBtnRequestHover] = useState(false);
    
    useEffect(() => {
        setTab(tabActive, '')
    }, [tabActive])

    useEffect(() => {
        getAtualBlockNumber()
        getInspections();
        if(user === '1'){
            isProducer()
        }
    }, []);

    async function isProducer() {
        console.log('block: '+ blockNumber);
        const mayRequest = await CanRequestInspection(walletConnected);
        setMayRequestInspection(mayRequest);
        const producer = await GetProducer(walletConnected);
        setLastRequested(producer.lastRequestAt);
        console.log('producer last request' + producer.lastRequestAt);
    }

    async function getInspections(){
        setLoading(true);
        const res = await GetInspections();
        setInpections(res);
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
        <div className='container-isa-page'>
            <div className='header-isa'>
                <h1>Manage Inspections</h1>
                <div className='area-btn-header-isa-page'>
                    {user == 1 && (
                        <button
                            
                            className='btn-new-category-isa'
                            onClick={() => {
                                if(mayRequestInspection){
                                    requestInspection()
                                }
                            }}
                            onMouseEnter={() => setBtnRequestHover(true)}
                            onMouseOut={() => setBtnRequestHover(false)}
                        >
                            {mayRequestInspection ? (
                                'Request New Inspection'
                            ) : (
                                <>
                                    {btnRequestHover ? (
                                        <>
                                            <FaLock 
                                                size={25}
                                                onMouseEnter={() => setBtnRequestHover(true)}
                                                onMouseOut={() => setBtnRequestHover(false)}
                                            />
                                            Wait {(Number(lastResquested) + 1000) - Number(blockNumber)} blocks to request
                                        </>
                                    ) : 'Request new inspection'}
                                </>
                                
                            )}
                            
                        </button>
                    )}
                    <button
                        className='btn-load-categories-isa'
                        onClick={() => getInspections()}
                    >
                        Load Inspections
                    </button>
                </div>
            </div>
            
                {inspections.length === 0 ? (
                    <h3>No open inspection</h3>
                ) : (
                    
                        <table>
                            <thead>
                                <th className='th-wallet'>Requested By</th>
                                <th className='th-wallet'>Inspected By</th>
                                <th>Created At</th>
                                <th>Expires In</th>
                                <th className='th-wallet'>Status</th>
                                <th>Accepted At</th>
                                <th className='th-wallet'>Isa Score</th>
                                <th className='th-wallet'>Actions</th>
                            </thead>
                            <tbody>
                                {inspections.map(item => {
                                    if(item.status != '2'){
                                        return(
                                            <ItemListInspections
                                                data={item}
                                                user={user}
                                                walletAddress={walletAddress}
                                                key={item.id}
                                                reloadInspections={() => getInspections()}
                                                setTab={(tab, wallet) => setTab(tab, wallet)}
                                            />
                                        )
                                    }
                                })}
                            </tbody>
                        </table>
                
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