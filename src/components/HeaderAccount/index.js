import React, {useState} from 'react';
import './headerAccount.css';
import {useNavigate} from 'react-router-dom';
import {VscAccount} from 'react-icons/vsc';
import {MdVisibility, MdVisibilityOff} from 'react-icons/md';

export default function HeaderAccount({wallet}){
    const [visibilityBalance, setVisibilityBalance] = useState(false);
    const navigate = useNavigate();

    async function logout(){
      navigate('/');
    }
    
    return(
        <div className='container-header-account'>
            <p>ACCOUNT: {wallet}</p>

            <div className='header-account__area-right'>
                <div className='header-account__area-balance'>
                    <h1 className='header-account__title-balance'>Balance: </h1>
                    <p className='header-account__balance'>{visibilityBalance ? '15000' : '******'} SAC Tokens</p>
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
                    className='header-account__btn-options-account'
                >
                    <VscAccount color='#000' size={30}/>
                </button>
            </div>
        </div>
    )
}