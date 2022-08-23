import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import './onlyOwner.css';

//services
import {
    NewAllowedResearcher, 
    NewAllowedContributor, 
    NewAllowedAdvisor, 
    NewAllowedDeveloper,
    AddLevel,
    UndoLevel
} from '../../services/onlyOwnerService';

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
            console.log(walletConnected)
            return;
        }
        if(type == 'researcher'){
            setLoading(true);
            await NewAllowedResearcher(wallet, walletConnected);
            setLoading(false);
        }
        if(type == 'contributor'){
            setLoading(true);
            await NewAllowedContributor(wallet, '0xbBd63273de2984e16791425E1D3bb7aF82cf8C11');
            setLoading(false);
        }
        if(type == 'advisor'){
            setLoading(true);
            await NewAllowedAdvisor(wallet, walletConnected);
            setLoading(false);
        }
        if(type == 'developer'){
            setLoading(true);
            await NewAllowedDeveloper(wallet, walletConnected);
            setLoading(false);
        }
    }

    async function changeLevelDeveloper(type){
        if(walletDeveloperPool == ''){
            return;
        }
        if(type == 'addlevel'){
            setLoading(true);
            await AddLevel(walletDeveloperPool, walletConnected);
            setLoading(false);
        }
        if(type == 'undolevel'){
            setLoading(true);
            await UndoLevel(walletDeveloperPool, walletConnected);
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
                        onClick={() => addAllowedUser('contributor')}
                    >
                        Add Contributor
                    </button>
                    <button
                        className='area-btn__btn-add'
                        onClick={() => addAllowedUser('advisor')}
                    >
                        Add Advisor
                    </button>
                    <button
                        className='area-btn__btn-add'
                        onClick={() => addAllowedUser('developer')}
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
                            onClick={() => changeLevelDeveloper('undolevel')}
                        >
                            Undo Level
                        </button>
                        <button
                            className='area-btn__btn-add'
                            onClick={() => changeLevelDeveloper('addlevel')}
                        >
                            Up Level
                        </button>
                    </div>
                </div>
        </div>
    )
}