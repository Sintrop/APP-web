import React, {useState, useEffect} from 'react';
import './onlyOwner.css';

//services
import {NewAllowedResearcher} from '../../services/onlyOwnerService';

export default function OnlyOwner(){
    const [wallet, setWallet] = useState('');
    const [walletDeveloperPool, setWalletDeveloperPool] = useState('');
    const [loading, setLoading] = useState(false);

    async function addAllowedUser(type){
        if(wallet == ''){
            return;
        }
        if(type == 'researcher'){
            setLoading(true);
            await NewAllowedResearcher(wallet, '0x7Fc819D7387350b2A0494b7Fc00ee1A5e036D62A');
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