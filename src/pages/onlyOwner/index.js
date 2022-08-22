import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import './onlyOwner.css';

//services
import {NewAllowedResearcher} from '../../services/onlyOwnerService';

export default function OnlyOwner(){
    const navigate = useNavigate();
    const [wallet, setWallet] = useState('');
    const [walletDeveloperPool, setWalletDeveloperPool] = useState('');
    const [walletConnected, setWalletConnected] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function checkConnection(){
            if(window.ethereum){
                await window.ethereum.request({
                    method: 'eth_accounts'
                })
                .then((accounts) => {
                    if(accounts.length == 0){
                        navigate('/')
                    }else{
                        setWalletConnected(accounts[0]);
                    }
                })
                .catch(() => {
                    console.log('error')
                })
            }
        }
        checkConnection();
    },[])

    async function addAllowedUser(type){
        if(wallet == ''){
            return;
        }
        if(type == 'researcher'){
            setLoading(true);
            await NewAllowedResearcher(wallet, walletConnected);
            setLoading(false);
        }
    }

    return(
        <div className='only-owner__container'>
                <h3 className='container__title-wallet'>Only Owner</h3>
                <input
                    className='only-owner__input-wallet' 
                    type='text' 
                    placeholder='wallet is here'
                    value={wallet}
                    onChange={(e) => setWallet(e.target.value)}
                />

                <div className='container__area-btn'>
                    <button
                        className='area-btn__btn-add'
                        onClick={() => addAllowedUser('researcher')}
                    >
                        Add Researcher
                    </button>
                    <button
                        className='area-btn__btn-add'
                        onClick={() => {}}
                    >
                        Add Contributor
                    </button>
                    <button
                        className='area-btn__btn-add'
                        onClick={() => {}}
                    >
                        Add Advisor
                    </button>
                    <button
                        className='area-btn__btn-add'
                        onClick={() => {}}
                    >
                        Add Developer
                    </button>
                </div>

                <div className='container__area-developer-pool'>
                    <h3 className='container__title-wallet'>Developer pool</h3>
                    <input
                        className='only-owner__input-wallet' 
                        type='text' 
                        placeholder='wallet is here'
                        value={walletDeveloperPool}
                        onChange={(e) => setWalletDeveloperPool(e.target.value)}
                    />

                    <div className='container__area-btn'>
                        <button
                            className='area-btn__btn-add'
                            onClick={() => {}}
                        >
                            Undo Level
                        </button>
                        <button
                            className='area-btn__btn-add'
                            onClick={() => {}}
                        >
                            Up Level
                        </button>
                    </div>
                </div>
        </div>
    )
}