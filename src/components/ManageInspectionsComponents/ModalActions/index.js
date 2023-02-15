import React, {useState, useContext, useEffect} from 'react';
import  './modalActions.css';
import * as Dialog from '@radix-ui/react-dialog';
import { LoadingTransaction } from '../../LoadingTransaction';
import { useNavigate } from 'react-router-dom';
import {MainContext} from '../../../contexts/main';
import { ToastContainer, toast } from 'react-toastify';
import {get} from '../../../config/infura';
import {format} from 'date-fns';
//services
import {AcceptInspection} from '../../../services/manageInspectionsService';
import {GetProducer} from '../../../services/producerService';
import {GetActivist} from '../../../services/activistService';

export default function ModalActions({close, item, walletAddress, showRealize, reloadInspection, showSeeResult, setLoading}){
    const navigate = useNavigate();
    const {user, walletConnected} = useContext(MainContext);
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    const [producerData, setProducerData] = useState({});
    const [proofPhotoProducer, setProofPhotoProducer] = useState('');
    const [activistData, setActivistData] = useState({});
    const [proofPhotoActivist, setProofPhotoActivist] = useState('');
    const [createdDate, setCreatedDate] = useState('');
    const [acceptedDate, setAcceptedDate] = useState('');
    const [inspectedDate, setInspectedDate] = useState('');

    useEffect(() => {
        getData();
        formatDates();
    }, []);

    function formatDates(){
        setCreatedDate(format(new Date(Number(item.createdAtTimestamp) * 1000), 'dd/MM/yyyy - kk:mm'))
        setAcceptedDate(format(new Date(Number(item.acceptedAtTimestamp) * 1000), 'dd/MM/yyyy - kk:mm'))
        setInspectedDate(format(new Date(Number(item.inspectedAtTimestamp) * 1000), 'dd/MM/yyyy - kk:mm'))
    }

    async function getData(){
        const producer = await GetProducer(item?.createdBy);
        setProducerData(producer);
        getBase64(producer?.proofPhoto, 'producer');
        const activist = await GetActivist(item?.acceptedBy);
        setActivistData(activist);
        getBase64(activist?.proofPhoto, 'activist');
    }

    async function getBase64(path, user){
        const base64 = await get(path);
        if(user === 'producer'){
            setProofPhotoProducer(base64);
        }else{
            setProofPhotoActivist(base64);
        }
    }

    async function acceptInspection(){
        setModalTransaction(true);
        setLoadingTransaction(true);
        AcceptInspection(item.id, walletAddress)
        .then(res => {
            setLogTransaction({
                type: res.type,
                message: res.message,
                hash: res.hashTransaction
            })
            setLoadingTransaction(false);
            reloadInspection();
            close();
        })
        .catch(err => {
            setLoadingTransaction(false);
            const message = String(err.message);
            console.log(message);
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

    function handleAccept(){
        if(user !== '2'){
            toast.error('This account is not activist!');
            return;
        }
        if(item.status === '2'){
            toast.error('This inspection has been inspected!');
            return;
        }
        if(item.status === '1'){
            toast.error('This inspection has been accepted!')
            return;
        }
        acceptInspection();
    }

    function handleRealize(){
        if(item.status === '0'){
            toast.error('It is necessary to accept the inspection before!')
            return;
        }
        if(item.status === '1' && String(walletConnected).toUpperCase() !== String(item.acceptedBy).toUpperCase()){
            toast.error('You cannot carry out this inspection, another activist has already accepted it!');
            return
        }
        if(item.status === '2'){
            toast.error('This inspection has been inspected!');
            return;
        }
        showRealize();
    }

    function handleSeeResult(){
        if(item.status !== '2'){
            toast.error('Inspection not realized!');
            return;
        }
        showSeeResult();
    }
    return(
        <Dialog.Portal className='modal-actions__portal'>
            <Dialog.Overlay className='modal-actions__overlay'/>
            <Dialog.Content className='modal-actions__content'>
                <Dialog.Title className='modal-actions__title'>
                    Options inspection
                </Dialog.Title>
                    <>
                    <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <p className='modal-actions__label'>Producer</p>
                            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10}}>
                                <div className='modal-action__area-photo'>
                                    <img
                                        src={`data:image/png;base64,${proofPhotoProducer}`}
                                        style={{width: 80, height: 80, borderRadius: 40, objectFit: 'cover'}}
                                    />
                                </div>
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <p style={{margin: 0, fontWeight: 'bold', fontSize: 16}}>{producerData?.name}</p>
                                    <p style={{margin: 0, fontSize: 16}}>
                                        {producerData?.propertyAddress?.street}, {producerData?.propertyAddress?.city} - {producerData?.propertyAddress?.state}
                                    </p>
                                    <a 
                                        onClick={() => navigate(`/dashboard/${walletConnected}/producer-page/${item.createdBy}`)}
                                        style={{textDecoration: 'underline', color: 'blue', cursor: 'pointer'}} 
                                    >
                                        <p style={{margin: 0}} title={item.createdBy}>{item.createdBy}</p>
                                    </a>
                                </div>
                            </div>
                        </div>
                        {Number(item.status) > 0 && (
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <p className='modal-actions__label'>Activist</p>
                                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10}}>
                                    <div className='modal-action__area-photo'>
                                        <img
                                            src={`data:image/png;base64,${proofPhotoActivist}`}
                                            style={{width: 80, height: 80, borderRadius: 40, objectFit: 'cover'}}
                                        />
                                    </div>
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <p style={{margin: 0, fontWeight: 'bold', fontSize: 16}}>{activistData?.name}</p>
                                        <p style={{margin: 0, fontSize: 16}}>
                                            {activistData?.activistAddress?.city} - {activistData?.activistAddress?.state}
                                        </p>
                                        <a 
                                            onClick={() => navigate(`/dashboard/${walletConnected}/activist-page/${item.acceptedBy}`)}
                                            style={{textDecoration: 'underline', color: 'blue', cursor: 'pointer'}} 
                                        >
                                            <p style={{margin: 0}} title={item.acceptedBy}>{item.acceptedBy}</p>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{display: 'flex', flexDirection: 'column', gap: 5}}>
                        <p style={{margin: 0, display: 'flex', flexDirection: 'row'}}>
                            <p style={{fontWeight: 'bold', color: 'green', margin: 0}}>Created At:</p> 
                            {createdDate}
                        </p>
                        {Number(item.status) > 0 && (
                            <p style={{margin: 0, display: 'flex', flexDirection: 'row'}}>
                                <p style={{fontWeight: 'bold', color: 'green', margin: 0}}>Accepted At:</p> 
                                {acceptedDate}
                            </p>
                        )}
                        {Number(item.status) > 1 && (
                            <p style={{margin: 0, display: 'flex', flexDirection: 'row'}}>
                                <p style={{fontWeight: 'bold', color: 'green', margin: 0}}>Inspected At:</p> 
                                {inspectedDate}
                            </p>
                        )}
                    </div>
                    </>
                
                    <div className='modal-actions__area-btn'>            
                        <button 
                            onClick={handleAccept}
                        >
                            Accept
                        </button>
                        

                        
                        <button 
                            onClick={handleRealize}
                        >
                            Realize
                        </button>
                        
                
                        <button 
                            onClick={handleSeeResult}
                        >
                            See result
                        </button>
                    </div>

                    <Dialog.Root 
                        open={modalTransaction} 
                        onOpenChange={(open) => {
                            if(!loadingTransaction){
                                setModalTransaction(open);
                                reloadInspection();
                                close();
                            }
                        }}
                    >
                        <LoadingTransaction
                            loading={loadingTransaction}
                            logTransaction={logTransaction}
                        />
                    </Dialog.Root>
            </Dialog.Content>
            <ToastContainer position='top-center'/>
        </Dialog.Portal>
    )
}