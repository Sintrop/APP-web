import React from 'react';
import './headerAccount.css';
import {useNavigate} from 'react-router-dom';

export default function HeaderAccount({wallet}){
    const navigate = useNavigate();
    async function logout(){
      navigate('/');
    }
    
    return(
        <div className='container-header-account'>
            <p>ACCOUNT: {wallet}</p>
            <button
                onClick={() => logout()}
            >Logout</button>
        </div>
    )
}