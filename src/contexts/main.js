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

export const MainContext = createContext({});

const blockDeployContract = 3590930;
const startEra2 = 3624160;
const startEra3 = 3657390;
const startEra4 = 3690620;
const startEra5 = 3723850;
const startEra6 = 3757080;
const startEra7 = 3790310;
const startEra8 = 3823540;
const startEra9 = 3856770;
const startEra10 = 3890000;
const startEra11 = 3923230;
const startEra12 = 3956460;

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
    const [modalFeedback, setModalFeedback] = useState(false);
    const [balanceUser, setBalanceUser] = useState(0);
    const [userData, setUserData] = useState(0);
    const [era, setEra] = useState(1);
    const [nextEraIn, setNextEraIn] = useState(0);
    const [impactPerToken, setImpactPerToken] = useState({});
    const [getAtualBlock, setGetAtualBlock] = useState(false);

    useEffect(() => {
        getStorageLanguage();
        getImpact();
    }, []);

    useEffect(() => {
        if(user === '2'){
        }
    },[user]);

    useEffect(() => {
        getAtualBlockNumber();
        setTimeout(() => {
            setGetAtualBlock(!getAtualBlock)
        }, 10000)
    }, [getAtualBlock])

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

    function chooseModalFeedBack(){
        setModalFeedback(!modalFeedback);
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
            checkAtualEra(res);
        })
    }

    async function checkAtualEra(blockNumber){
        if(Number(blockNumber) >= startEra2 && Number(blockNumber) < startEra3){
            setEra(2);
            setNextEraIn(startEra3 - Number(blockNumber));
        }
        if(Number(blockNumber) >= startEra3 && Number(blockNumber) < startEra4){
            setEra(3);
            setNextEraIn(startEra4 - Number(blockNumber));
        }
        if(Number(blockNumber) >= startEra4 && Number(blockNumber) < startEra5){
            setEra(4);
            setNextEraIn(startEra5 - Number(blockNumber));
        }
        if(Number(blockNumber) >= startEra5 && Number(blockNumber) < startEra6){
            setEra(5);
            setNextEraIn(startEra6 - Number(blockNumber));
        }
        if(Number(blockNumber) >= startEra6 && Number(blockNumber) < startEra7){
            setEra(6);
            setNextEraIn(startEra7 - Number(blockNumber));
        }
        if(Number(blockNumber) >= startEra7 && Number(blockNumber) < startEra8){
            setEra(7);
            setNextEraIn(startEra8 - Number(blockNumber));
        }
        if(Number(blockNumber) >= startEra8 && Number(blockNumber) < startEra9){
            setEra(8);
            setNextEraIn(startEra9 - Number(blockNumber));
        }
        if(Number(blockNumber) >= startEra9 && Number(blockNumber) < startEra10){
            setEra(9);
            setNextEraIn(startEra10 - Number(blockNumber));
        }
        if(Number(blockNumber) >= startEra10 && Number(blockNumber) < startEra11){
            setEra(10);
            setNextEraIn(startEra11 - Number(blockNumber));
        }
        if(Number(blockNumber) >= startEra11 && Number(blockNumber) < startEra12){
            setEra(11);
            setNextEraIn(startEra12 - Number(blockNumber));
        }
        if(Number(blockNumber) >= startEra12){
            setEra(12);
        }
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
        setModalChooseLang(false);
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
                impactPerToken,
                modalFeedback,
                chooseModalFeedBack,
                era,
                nextEraIn
            }}
        >
            {children}
        </MainContext.Provider>
    )
}