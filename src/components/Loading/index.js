import React from 'react';
import './loading.css';
import Loader from '../Loader';

export default function Loading(){
    return(
        <div className="container-loading">
            <div className="card-loading">
                <Loader
                    color='#0a4303'
                    type='hash'
                    noText
                />
            </div>
        </div>
    )
}