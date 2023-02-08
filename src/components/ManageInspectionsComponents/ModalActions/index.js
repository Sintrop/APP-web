import React, {useState} from 'react';
import  './modalActions.css';
import * as Dialog from '@radix-ui/react-dialog';
import { LoadingTransaction } from '../../LoadingTransaction';

//services
import {AcceptInspection} from '../../../services/manageInspectionsService';

export default function ModalActions({close, user, item, walletAddress, showRealize, reloadInspection, showSeeResult, setLoading}){
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

    return(
        <div className='container_modal_options'>
            <div className='header-options'>
                <p>Options</p>
                <button
                    className='btn-close-modal'
                    onClick={() => close()}
                >X</button>
            </div>
            <div className='container__options'>            
                {user == '2' && item.status == '0' &&(
                    <button 
                        className='btn-action-options'
                        onClick={() => acceptInspection()}
                    >Accept</button>
                )}

                {item.acceptedBy.toUpperCase() == walletAddress.toUpperCase() && user == '2' && item.status == '1' &&(
                    <button 
                        className='btn-action-options'
                        onClick={() => showRealize()}
                    >Realize</button>
                )}
            
                <button className='btn-action-options'
                    onClick={() => showSeeResult()}
                >See Result</button>
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
    )
}