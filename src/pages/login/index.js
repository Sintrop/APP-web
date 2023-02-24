import React, {useState, useEffect, useContext} from "react";
import { useNavigate } from 'react-router-dom';
import './login.css';
import { useNetwork } from "../../hooks/useNetwork";
import loginImg from '../../assets/img/sintrop_login_alpha.png';
import logo from '../../assets/img/262543420-sintrop-logo-com-degrade.png';
import { MainContext } from "../../contexts/main";
import { UnsupportedNetwork } from "../../components/UnsupportedNetwork";
import {useTranslation} from 'react-i18next';

function Login(){
    const {t} = useTranslation();
    const {isSupported} = useNetwork();
    const {Sync, chooseLanguage} = useContext(MainContext);
    const navigate = useNavigate();

    async function handleSync(){
        const response = await Sync();
        if(response.status === 'connected'){
            navigate(`/dashboard/${response.wallet}/isa/main`)
        }
    }

    if(!isSupported){
        return(
            <UnsupportedNetwork/>
        )
    }

    return(
        <div className="container-page-login">
            <div className="area-img-login">
                <img src={loginImg} className="img-login"/>
                <div className="card-info-img-login">
                    <p>{t('We want to make the world a sustainable place where living beings and nature can live in harmony. Our project consists of a decentralized certification of rural producers, with a sustainability token reward system, using blockchain technology and the Ethereum platform.')}</p>
                </div>
            </div>
            <div className="area-login">
                <div className="card-login">
                    <img src={logo} className="logo-login"/>
                    <h1>{t('Welcome')}</h1>
                    <h2>{t('Our mission is to make agriculture sustainable in the world through technology.')}</h2>

                    <button className="btn-sync-wallet" onClick={handleSync}>
                        {t('Synchronize')}
                    </button>
                    <p>{t('Click the button above to sync your Metamask wallet')}</p>
                </div>
            </div>
        </div>
    )
}

export default Login;