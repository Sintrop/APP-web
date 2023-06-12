import { useEffect, useState, createContext } from "react";
import Web3 from 'web3';
import {CheckUser} from '../services/checkUserRegister';
import ConnectWallet from "../services/connectWallet";
import { useTranslation } from "react-i18next";
import {GetBalanceDeveloper} from '../services/developersPoolService';
import {GetBalanceProducer} from '../services/producerPoolService';
import {GetBalanceContract} from '../services/producerPoolService';
import {GetBalancePool} from '../services/developersPoolService';
import {api} from '../services/api';

export const MainContext = createContext({})

export default function MainProvider({children}){
    const {i18n} = useTranslation();
    const [user, setUser] = useState('0');
    const [walletConnected, setWalletConnected] = useState(''); 
    const [walletSelected, setWalletSelected] = useState(''); 
    const [modalRegister, setModalRegister] = useState(false);
    const [blockNumber, setBlockNumber] = useState(0);
    const [mayAcceptInspection, setMayAcceptInspection] = useState(false);
    const [menuOpen, setMenuOpen] = useState(true);
    const [language, setLanguage] = useState('en-us');
    const [modalChooseLang, setModalChooseLang] = useState(false);
    const [modalTutorial, setModalTutorial] = useState(false);
    const [balanceUser, setBalanceUser] = useState(0);
    const [userData, setUserData] = useState(0);
    const [impactPerToken, setImpactPerToken] = useState({});

    useEffect(() => {
        getAtualBlockNumber();
        getStorageLanguage();
        getImpact();
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

    async function getBalanceUser(typeUser, wallet){
        if(typeUser === '1'){
            const balanceUser = await GetBalanceProducer(wallet)
            console.log(balanceUser)
            setBalanceUser(Number(balanceUser))
        }

        if(typeUser === '4'){
            const balanceUser = await GetBalanceDeveloper(wallet)
            setBalanceUser(Number(balanceUser))
        }
    }

    function chooseModalRegister(){
        setModalRegister(!modalRegister);
    }

    function chooseModalTutorial(){
        setModalTutorial(!modalTutorial);
    }

    async function checkUser(wallet){
        const response = await CheckUser(String(wallet));
        setUser(response);
        setWalletConnected(wallet);
        getBalanceUser(response, wallet);
        if(response !== '0'){
            getUserDataApi(wallet)
        }
        return response;
    }

    async function getUserDataApi(wallet){
        const resUser = await api.get(`/user/${wallet}`)
        setUserData(resUser.data.user)
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

    async function getImpact(){
        const response = await api.get('network-impact')
        const impacts = response.data?.impact;
        
        const balanceProducers = await GetBalanceContract();
        const balanceDevelopers = await GetBalancePool();

        for(var i = 0; i < impacts.length; i++){
            if(impacts[i].id === '1'){
                calculateImpactPerToken(balanceProducers, balanceDevelopers, impacts[i]);
            }
        }
    }
    
    async function calculateImpactPerToken(balanceProducers, balanceDevelopers, impact){
        const totalBalanceProducers = 750000000000000000000000000;
        const totalBalanceDevelopers = 15000000000000000000000000;

        const sacProducers = totalBalanceProducers - balanceProducers;
        const sacDevelopers = totalBalanceDevelopers - balanceDevelopers;

        const totalSac = sacProducers + sacDevelopers;

        const carbon = Number(impact.carbon) / (totalSac / 10 ** 18);
        const bio = Number(impact.bio) / (totalSac / 10 ** 18);
        const water = Number(impact.agua) / (totalSac / 10 ** 18);
        const soil = Number(impact.solo) / (totalSac / 10 ** 18);

        let impactToken = {
            carbon,
            bio,
            water,
            soil
        }
        setImpactPerToken(impactToken);
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
                setWalletConnected,
                walletSelected,
                setWalletSelected,
                modalTutorial,
                chooseModalTutorial,
                balanceUser,
                userData,
                getUserDataApi,
                impactPerToken
            }}
        >
            {children}
        </MainContext.Provider>
    )
}