import React, {useEffect, useState} from 'react';
import logoSintrop from '../../assets/img/262543420-sintrop-logo-com-degrade.png';

export function UnsupportedNetwork(){
    const [text, setText] = useState('Loading...')

    useEffect(() => {
        setTimeout(() => {
            setText('Your connected network is unsupported. Please connect to Goerli Testnet!')
        }, 3000)
    }, [])
    return(
        <div style={{display: 'flex', flexDirection: 'column', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
            <img
                src={logoSintrop}
                style={{width: '705px', height: '237px'}}
            />
            <h1 style={{textAlign: 'center'}}>{text}</h1>
            {text !== 'Loading...' && (
                <>
                    <p>Follow our tutorial to more information:</p>
                    <a target="_blank" href='https://github.com/Sintrop/SMR/wiki/Como-acessar-a-v3-do-Sistema'>Click here</a>
                </>
            )}
        </div>
    )
}