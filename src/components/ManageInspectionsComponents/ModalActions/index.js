import React, {useState} from 'react';
import  './modalActions.css';

//services
import {AcceptInspection} from '../../../services/manageInspectionsService';

export default function ModalActions({close, user, item, walletAddress, showRealize, reloadInspection, showSeeResult, setLoading}){
    async function acceptInspection(){
        setLoading();
        await AcceptInspection(item.id, walletAddress);
        reloadInspection();
        close();
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
        </div>
    )
}