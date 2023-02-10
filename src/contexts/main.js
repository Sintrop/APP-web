import { useEffect, useState, createContext } from "react";
import {useParams} from 'react-router-dom';
import {CheckUser} from '../services/checkUserRegister';
import ConnectWallet from "../services/connectWallet";

export const MainContext = createContext({})

export default function MainProvider({children}){
    const [user, setUser] = useState('0');
    const [walletConnected, setWalletConnected] = useState(''); 
    const [modalRegister, setModalRegister] = useState(false);

    async function Sync(){
        const wallet = await ConnectWallet();

        if(wallet.connectedStatus){
            return {
                status: 'connected',
                wallet: wallet.address
            }
        }
    }

    function chooseModalRegister(){
        setModalRegister(!modalRegister);
    }

    async function checkUser(wallet){
        const response = await CheckUser(String(wallet));
        setUser(response);
        setWalletConnected(wallet);
        return response;
    }
    
    return(
        <MainContext.Provider
            value={{user, Sync, checkUser, walletConnected, chooseModalRegister, modalRegister}}
        >
            {children}
        </MainContext.Provider>
    )
}