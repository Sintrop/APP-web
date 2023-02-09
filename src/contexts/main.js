import { useEffect, useState, createContext } from "react";
import {useParams} from 'react-router-dom';
import {CheckUser} from '../services/checkUserRegister';
import ConnectWallet from "../services/connectWallet";

export const MainContext = createContext({})

export default function MainProvider({children}){
    const [user, setUser] = useState('');

    async function Sync(){
        const wallet = await ConnectWallet();

        if(wallet.connectedStatus){
            checkUser(wallet.address)
            return {
                status: 'connected',
                wallet: wallet.address
            }
        }
    }

    async function checkUser(wallet){
        const response = await CheckUser(wallet);
        alert(response);
    }
    
    return(
        <MainContext.Provider
            value={{user, Sync}}
        >
            {children}
        </MainContext.Provider>
    )
}