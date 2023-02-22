import React, {useState, useEffect, useContext} from "react";
import { useNavigate } from 'react-router-dom';
import './login.css';
import { useNetwork } from "../../hooks/useNetwork";
import loginImg from '../../assets/img/sintrop_login_alpha.png';
import logo from '../../assets/img/262543420-sintrop-logo-com-degrade.png';
import { MainContext } from "../../contexts/main";
import { UnsupportedNetwork } from "../../components/UnsupportedNetwork";

function Login(){
    const {isSupported} = useNetwork();
    const {Sync} = useContext(MainContext);
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
                    <p>Queremos tornar o mundo um lugar sustentável onde seres vivos e natureza possam viver em harmonia. Nosso projeto consiste em uma certificação descentralizada de produtores rurais, com sistema de recompensas de tokens de sustentabilidade, usando tecnologia blockchain e a plataforma Ethereum.</p>
                </div>
            </div>
            <div className="area-login">
                <div className="card-login">
                    <img src={logo} className="logo-login"/>
                    <h1>Seja Bem-vindo</h1>
                    <h2>Nossa missão é tornar a agricultura sustentável no mundo através da tecnologia.</h2>

                    <button className="btn-sync-wallet" onClick={handleSync}>
                        Sicronizar
                    </button>
                    <p>Clique no botão acima para sicronizar sua carteira Metamask</p>
                </div>
            </div>
        </div>
    )
}

export default Login;