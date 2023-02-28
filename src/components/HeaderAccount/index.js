import React, {useState, useContext, useEffect} from 'react';
import './headerAccount.css';
import {useNavigate} from 'react-router-dom';
import {VscAccount} from 'react-icons/vsc';
import {MdVisibility, MdVisibilityOff} from 'react-icons/md';
import { MainContext } from '../../contexts/main';
import {GetTokensBalance} from '../../services/voteService';
import * as Dialog from '@radix-ui/react-dialog';
import { ModalAccountOptions } from './ModalAccountOptions';
import { useTranslation } from 'react-i18next';
//import { ChooseLang } from '../ChooseLang';

export default function HeaderAccount({wallet}){
    const {t} = useTranslation();
    const {user, walletConnected} = useContext(MainContext);
    const [visibilityBalance, setVisibilityBalance] = useState(false);
    const [balanceUser, setBalanceUser] = useState(0);
    const [modalOptions, setModalOptions] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getBalanceUser();
    },[walletConnected])

    async function logout(){
      navigate('/');
    }

    async function getBalanceUser(){
        const response = await GetTokensBalance(wallet);
        setBalanceUser(Number(response) / 10**18);
        //alert(Number(response) / 10**18);
    }
    
    return(
        <div className='container-header-account'>
            <p>{t('Account')}: {wallet}</p>

            <div className='header-account__area-right'>
                
                    <div className='header-account__area-balance'>
                        
                        <h1 className='header-account__title-balance'>{t('Balance')}: </h1>
                        <p className='header-account__balance'>{visibilityBalance ? balanceUser : '******'} SAC Tokens</p>
                        <button 
                            className='header-account__choose-visibility'
                            onClick={() => setVisibilityBalance(!visibilityBalance)}
                        >
                            {visibilityBalance ? (
                                <MdVisibility color='purple' size={25}/>
                            ) : (
                                <MdVisibilityOff color='purple' size={25}/>
                            )}
                        </button>
                    </div>
               
                <button
                    onClick={() => setModalOptions(true)}
                    className='header-account__btn-options-account'
                >
                    <VscAccount color='#000' size={30}/>
                </button>
            </div>

            <Dialog.Root
                open={modalOptions}
                onOpenChange={(open) => setModalOptions(open)}
            >
                <ModalAccountOptions
                    user={user}
                    walletConnected={walletConnected}
                    close={() => setModalOptions(false)}
                />
            </Dialog.Root>
        </div>
    )
}