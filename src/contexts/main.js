import { useEffect, useState, createContext } from "react";
import Web3 from 'web3';
import {CheckUser} from '../services/checkUserRegister';
import ConnectWallet from "../services/connectWallet";
import { useTranslation } from "react-i18next";

export const MainContext = createContext({})

export default function MainProvider({children}){
    const {i18n} = useTranslation();
    const [user, setUser] = useState('0');
    const [walletConnected, setWalletConnected] = useState(''); 
    const [modalRegister, setModalRegister] = useState(false);
    const [blockNumber, setBlockNumber] = useState(0);
    const [mayAcceptInspection, setMayAcceptInspection] = useState(false);
    const [menuOpen, setMenuOpen] = useState(true);
    const [language, setLanguage] = useState('en-us');
    const [modalChooseLang, setModalChooseLang] = useState(false);

    useEffect(() => {
        getAtualBlockNumber();
        getStorageLanguage();
    }, []);

    useEffect(() => {
        if(user === '2'){
        }
    },[user]);

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

    async function getAtualBlockNumber(){
        const web3js = new Web3(window.ethereum);
        await web3js.eth.getBlockNumber()
        .then(res => {
            setBlockNumber(res)
        })
    }

    function toggleMenu(){
        setMenuOpen(!menuOpen);
    }

    function toggleModalChooseLang(){
        setModalChooseLang(!modalChooseLang);
    }

    function chooseLanguage(lang){
        setLanguage(lang);
        setStorageLanguage(lang);
        i18n.changeLanguage(lang);
    }

    function setStorageLanguage(lang){
        localStorage.setItem('language', lang);
    }

    async function getStorageLanguage(){
        const lang = await localStorage.getItem('language');
        if(lang){
            setLanguage(lang);
            i18n.changeLanguage(lang);
        }else{
            setModalChooseLang(true)
        }
    }
    
    return(
        <MainContext.Provider
            value={{
                user, 
                Sync, 
                checkUser, 
                walletConnected, 
                chooseModalRegister, 
                modalRegister, 
                blockNumber, 
                getAtualBlockNumber,
                menuOpen,
                toggleMenu,
                language,
                chooseLanguage,
                modalChooseLang,
                toggleModalChooseLang,
                setWalletConnected
            }}
        >
            {children}
        </MainContext.Provider>
    )
}