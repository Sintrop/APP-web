import React, {useState, useContext} from 'react';
import  './modalActions.css';
import * as Dialog from '@radix-ui/react-dialog';
import { LoadingTransaction } from '../../LoadingTransaction';
import {FaCheck, FaClipboardList, FaEdit} from 'react-icons/fa';
import {MainContext} from '../../../contexts/main';
import { ToastContainer, toast } from 'react-toastify';
//services
import {AcceptInspection} from '../../../services/manageInspectionsService';

export default function ModalActions({close, item, walletAddress, showRealize, reloadInspection, showSeeResult, setLoading}){
    const {user} = useContext(MainContext);
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    
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
        if(item.status === '1'){
            toast.error('This inspection has been accepted!')
            return;
        }
        acceptInspection();
    }
    return(
        <Dialog.Portal className='modal-actions__portal'>
            <Dialog.Overlay className='modal-actions__overlay'/>
            <Dialog.Content className='modal-actions__content'>
                <Dialog.Title className='modal-actions__title'>
                    Options inspection
                </Dialog.Title>
                <div className='container_modal_options'>
                    <div className='container__options'>            
                        
                        <button 
                            className='btn-action-options'
                            onClick={handleAccept}
                        >
                            <FaCheck size={20}/>
                            Accept
                        </button>
                        

                        
                        <button 
                            className='btn-action-options'
                            onClick={() => showRealize()}
                        >
                            <FaEdit size={20}/>
                            Realize
                        </button>
                        
                
                        <button className='btn-action-options'
                            onClick={() => showSeeResult()}
                        >
                            <FaClipboardList size={20}/>
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
                </div>
            </Dialog.Content>
            <ToastContainer position='top-center'/>
        </Dialog.Portal>
    )
}