import React from 'react';
import './headerAccount.css';
import {useNavigate} from 'react-router-dom';

export default function HeaderAccount({wallet}){
    const navigate = useNavigate();
    async function logout(){
<<<<<<< HEAD
        navigate('/');
    }
    
=======
      navigate('/');
    }
>>>>>>> ffec6e2779625fb1f164315b9e6132b8de4fdc00
    return(
        <div className='container-header-account'>
            <p>ACCOUNT: {wallet}</p>
            <button
                onClick={() => logout()}
            >Logout</button>
        </div>
    )
}