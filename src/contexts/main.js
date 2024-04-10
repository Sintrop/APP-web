import { useEffect, useState, createContext } from "react";
import Web3 from 'web3';
import {CheckUser} from '../services/checkUserRegister';
import ConnectWallet from "../services/connectWallet";
import { useTranslation } from "react-i18next";
import {GetBalanceDeveloper} from '../services/developersPoolService';
import {GetBalanceProducer} from '../services/producerPoolService';
import CryptoJS from "crypto-js";
import {api} from '../services/api';
import { ToastContainer, toast } from "react-toastify";
import { getImage } from "../services/getImage";

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
const startEra13 = 3989690;
const startEra14 = 4022920;
const startEra15 = 4056150;
const startEra16 = 4089380;
const startEra17 = 4122610;

export default function MainProvider({children}){
    const {i18n} = useTranslation();
    const [user, setUser] = useState('0');
    const [walletConnected, setWalletConnected] = useState(''); 
    const [walletSelected, setWalletSelected] = useState(''); 
    const [connectionType, setConnectionType] = useState('');
    const [modalRegister, setModalRegister] = useState(false);
    const [blockNumber, setBlockNumber] = useState(0);
    const [imageProfile, setImageProfile] = useState('');
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
    const [attNotifications, setAttNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [viewMode, setViewMode] = useState(true);
    const [transactionOpen, setTransactionOpen] = useState(false);
    const [transactionOpened, setTranscationsOpened] = useState([]);
    const [accountStatus, setAccountStatus] = useState('pending');
    const [blockchainData, setBlockchainData] = useState({});
    const [itemsCalculator, setItemsCalculator] = useState([]);
    const [tokensToContribute, setTokensToContribute] = useState(0);

    useEffect(() => {
        getStorageLanguage();
        getImpact();
        //checkMode();
    }, []);

    useEffect(() => {
        getAtualBlockNumber();
        setTimeout(() => {
            setGetAtualBlock(!getAtualBlock)
        }, 10000)
    }, [getAtualBlock])

    // useEffect(() => {
    //     getNotifications();
    //     setTimeout(() => {
    //         setAttNotifications(!attNotifications);
    //     }, 10000)
    // }, [attNotifications]);

    // useEffect(() => {
    //     if(walletConnected !== '')checkTransactionQueue();
    // }, [walletConnected]);

    async function checkTransactionQueue(){
        const response = await api.get(`/transactions-open/${walletConnected}`);
        const transactions = response.data.transactions;
        
        if(transactions.length > 0){
            setTransactionOpen(true);
            setTranscationsOpened(transactions);
        }else{
            setTransactionOpen(false);
        }
    }

    async function checkMode(){
        if(window.ethereum){
            setViewMode(false);
            await window.ethereum.request({
                method: 'eth_accounts'
            })
            .then((accounts) => {
                if(accounts.length == 0){
                    
                }else{
                    
                }
            })
            .catch(() => {
                console.log('error')
            })
        }else{
            setViewMode(true)
        }
    }

    async function Sync(){
        const wallet = await ConnectWallet();
        if(wallet.connectedStatus){
            const encrypt = CryptoJS.AES.encrypt(process.env.REACT_APP_LOGIN_SECRET_PASS, process.env.REACT_APP_LOGIN_SECURITY_KEY);

            try{
                const response = await api.post('/login/with-secure-key', {
                    wallet: wallet.address[0],
                    secureKey: encrypt.toString(),
                })
                
                if(response.data){
                    api.defaults.headers.common['Authorization'] = `Bearer ${response.data}`;
                    getUserDataApi(wallet.address[0]);
                    setWalletConnected(String(wallet.address[0]).toLowerCase());
                    setConnectionType('provider');
                }
                return {
                    status: 'connected',
                    wallet: wallet.address[0]
                }
            }catch(err){
                console.log(err?.message)
            }
        }
    }

    async function loginWithWalletAndPassword(wallet, password){
        try{
            const response = await api.post('/login', {
                wallet,
                password,
            });

            if(response.data){
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data}`;
                getUserDataApi(wallet);
                setWalletConnected(String(wallet).toLowerCase());
            }
            setConnectionType('notprovider')
            return true;
        }catch(err){
            if(err.response?.data?.message === 'User not found'){
                toast.error('Usuário não encontrado!')
                return false;
            }

            if(err.response?.data?.message === 'User deleted'){
                toast.error('Essa conta foi excluida!')
                return false;
            }

            if(err.response?.data?.message === 'Password incorrect'){
                toast.error('Senha incorreta!')
                return false;
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
        const response = await api.get(`/user/${wallet}`);
        const resUser = response.data.user
        setUserData(resUser);
        setAccountStatus(resUser?.accountStatus);
        
        if(resUser?.accountStatus === 'blockchain'){
            getUserBlockchainData(wallet, resUser?.userType);
        }

        const image = await getImage(resUser.imgProfileUrl);
        setImageProfile(image);
    }

    async function getUserBlockchainData(wallet, userType){
        if (userType === 1) {
            const response = await api.get(`/web3/producer-data/${String(wallet).toLowerCase()}`);
            setBlockchainData(response.data);
        }

        if (userType === 2) {
            const response = await api.get(`/web3/inspector-data/${String(wallet).toLowerCase()}`);
            setBlockchainData(response.data);
        }

        if (userType === 4) {
            const response = await api.get(`/web3/developer-data/${String(wallet).toLowerCase()}`);
            setBlockchainData(response.data);
        }

        if (userType === 3) {
            const response = await api.get(`/web3/researcher-data/${String(wallet).toLowerCase()}`);
            setBlockchainData(response.data);
        }

        if (userType === 6) {
            const response = await api.get(`/web3/activist-data/${String(wallet).toLowerCase()}`);
            setBlockchainData(response.data);
        }

        if (userType === 8) {
            const response = await api.get(`/web3/validator-data/${String(wallet).toLowerCase()}`);
            setBlockchainData(response.data);
        }
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
        if(Number(blockNumber) >= startEra12 && Number(blockNumber) < startEra13){
            setEra(12);
            setNextEraIn(startEra13 - Number(blockNumber));
        }
        if(Number(blockNumber) >= startEra13 && Number(blockNumber) < startEra14){
            setEra(13);
            setNextEraIn(startEra14 - Number(blockNumber));
        }
        if(Number(blockNumber) >= startEra14 && Number(blockNumber) < startEra15){
            setEra(14);
            setNextEraIn(startEra15 - Number(blockNumber));
        }
        if(Number(blockNumber) >= startEra15 && Number(blockNumber) < startEra16){
            setEra(15);
            setNextEraIn(startEra16 - Number(blockNumber));
        }
        if(Number(blockNumber) >= startEra17){
            setEra(17);
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
        const response = await api.get('/impact-per-token')
        setImpactPerToken(response.data.impact);
    }

    async function getNotifications(){
        //const responseWallet = await Sync();
        const responseNotifications = await api.get(`/notifications/${walletConnected}`);
        setNotifications(responseNotifications.data.notifications.Notifications)
    }

    function logout(){
        setWalletConnected('');
        setUserData({});
        setBlockchainData({});
    }
    
    return(
        <MainContext.Provider
            value={{
                user, 
                Sync, 
                checkUser, 
                walletConnected,
                setWalletConnected, 
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
                nextEraIn,
                notifications,
                getNotifications,
                viewMode,
                transactionOpen,
                setTransactionOpen,
                transactionOpened,
                userData,
                loginWithWalletAndPassword,
                imageProfile,
                connectionType,
                accountStatus,
                blockchainData,
                tokensToContribute,
                setTokensToContribute,
                itemsCalculator,
                setItemsCalculator,
                logout
            }}
        >
            {children}

            <ToastContainer/>
        </MainContext.Provider>
    )
}