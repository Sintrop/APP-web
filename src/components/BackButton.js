import React from 'react';
import { useNavigate } from 'react-router';
import {ImArrowLeft2} from 'react-icons/im';

export function BackButton(){
    const navigate = useNavigate();
    return(
        <button onClick={() => navigate(-1)}>
            <ImArrowLeft2 size={20} color='white'/>
        </button>
    )
}