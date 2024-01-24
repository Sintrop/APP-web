import React from 'react';
import './loading.css';
import Loader from '../Loader';

export default function Loading({text}){
    return(
        <div className="container-loading">
            <div className="card-loading">
                <Loader
                    color='#0a4303'
                    type='hash'
                    noText
                />

                {text && (
                    <p className='text-xs text-center'>{text}</p>
                )}
            </div>
        </div>
    )
}