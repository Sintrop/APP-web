import { useEffect, useState, createContext } from "react";
import Web3 from 'web3';
import { CheckUser } from '../services/checkUserRegister';
import ConnectWallet from "../services/connectWallet";
import { useTranslation } from "react-i18next";
import CryptoJS from "crypto-js";
import { api } from '../services/api';
import { ToastContainer, toast } from "react-toastify";
import { getImage } from "../services/getImage";
import { addDays, compareAsc } from "date-fns";
import { getEraInfo } from "../services/eraInfo";
import { getInvitations, getUser } from "../services/web3/userService";
import { getUserApi } from "../services/userApi";
import { GetProducer } from "../services/web3/producerService";
import { GetDeveloper } from "../services/web3/developersService";
import { GetInspector } from "../services/web3/inspectorService";
import { GetResearcher } from "../services/web3/researchersService";
import { GetActivist } from "../services/web3/activistService";
import { GetSupporter } from "../services/web3/supporterService";
import { GetValidator } from "../services/web3/validatorService";

export const MainContext = createContext({});

export default function MainProvider({ children }) {
    const { i18n } = useTranslation();
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
    const [userData, setUserData] = useState(null);
    const [era, setEra] = useState(1);
    const [notifications, setNotifications] = useState([]);
    const [viewMode, setViewMode] = useState(true);
    const [transactionOpen, setTransactionOpen] = useState(false);
    const [transactionOpened, setTranscationsOpened] = useState([]);
    const [accountStatus, setAccountStatus] = useState('pending');
    const [inviteData, setInviteData] = useState({});
    const [blockchainData, setBlockchainData] = useState({});
    const [itemsCalculator, setItemsCalculator] = useState([]);
    const [tokensToContribute, setTokensToContribute] = useState(0);
    const [nextEra, setNextEra] = useState(0);
    const [epoch, setEpoch] = useState(1)
    const [impactToken, setImpactToken] = useState({});
    const [accountsConnected, setAccountsConnected] = useState([]);
    const [userBlockchain, setUserBlockchain] = useState({});
    const [userTypeConnected, setUserTypeConnected] = useState(0);

    useEffect(() => {
        handleGetEraInfo();
        getImpact();
        checkUserConnected();
        checkAccountsConnected();
        getStorageLanguage();
    }, []);

    useEffect(() => {
        setTimeout(() => {
            const next = nextEra - 1;
            setNextEra(next);
        }, 13500);
    }, [nextEra]);

    async function checkUserConnected() {
        const response = localStorage.getItem('user_connected');

        if (response) {
            const data = JSON.parse(response);
            const expireToken = addDays(new Date(data?.createdAt), 1);
            if (compareAsc(new Date(), expireToken) === 1) {
                localStorage.removeItem('user_connected');
                return;
            }

            api.defaults.headers.common['Authorization'] = `Bearer ${data?.token}`;
            newFlowConnectUser(data?.wallet, false);
        }
    }

    async function checkAccountsConnected() {
        const response = await localStorage.getItem('accounts_connected');
        if (response) {
            setAccountsConnected(JSON.parse(response));
        }
    }

    async function newFlowConnectUser(wallet, newConnection) {
        setWalletConnected(wallet);
        const userType = await getUser(wallet);
        setUserTypeConnected(userType);

        if (userType === 0) {
            getInviteData(wallet);
            const responseUserApi = await getUserApi(wallet);
            if (responseUserApi.success) {
                setUserData(responseUserApi.user);
            } else {
                setUserData({
                    id: 'anonimous',
                    name: 'anonimous',
                    wallet: wallet,
                    userType: 0,
                    imgProfileUrl: null,
                    accountStatus: 'pending'
                })
            }
            return
        }

        if (userType === 9) {
            setUserData({
                id: 'anonimous',
                name: 'Usuário invalidado',
                wallet: wallet,
                userType: 0,
                imgProfileUrl: null,
                accountStatus: 'pending'
            });
            return;
        }

        getUserData(wallet, userType, newConnection);
    }

    async function getUserData(wallet, userType, newConnection) {
        let userWeb3Data = {};
        if (userType === 1) {
            const producer = await GetProducer(wallet);
            setUserBlockchain(producer);
            userWeb3Data = producer;
        }
        if (userType === 2) {
            const inspector = await GetInspector(wallet);
            setUserBlockchain(inspector);
            userWeb3Data = inspector;
        }
        if (userType === 3) {
            const researcher = await GetResearcher(wallet);
            setUserBlockchain(researcher);
            userWeb3Data = researcher;
        }
        if (userType === 4) {
            const developer = await GetDeveloper(wallet);
            setUserBlockchain(developer);
            userWeb3Data = developer;
        }
        if (userType === 6) {
            const activist = await GetActivist(wallet);
            setUserBlockchain(activist);
            userWeb3Data = activist;
        }
        if (userType === 7) {
            const supporter = await GetSupporter(wallet);
            setUserBlockchain(supporter);
            userWeb3Data = supporter;
        }
        if (userType === 8) {
            const validator = await GetValidator(wallet);
            setUserBlockchain(validator);
            userWeb3Data = validator;
        }

        if (userWeb3Data.proofPhoto) {
            getImageProfile(userWeb3Data.proofPhoto);
        }

        const userApi = await getUserApi(wallet);
        if (userApi.success) {
            setUserData(userApi.user);

            if(newConnection){
                storageUser(wallet);
                saveOnAccountsConnected(userApi.user);
            }

            if (userApi.user.accountStatus !== "blockchain") {
                updateAccountStatus(wallet, "blockchain")
            }
        } else {
            createUserOnApi(userWeb3Data, userType, wallet, newConnection);
        }
    }

    async function createUserOnApi(web3Data, userType, wallet, newConnection) {
        try {
            const response = await api.post("/users", {
                name: web3Data?.name ? web3Data.name : "",
                wallet,
                userType: Number(userType),
                imgProfileUrl: web3Data?.proofPhoto ? web3Data.proofPhoto : "",
                totalArea: web3Data?.areaInformation?.totalArea ? Number(web3Data?.areaInformation?.totalArea) : 0,
                accountStatus: "blockchain"
            });
            setUserData(response.data.user);

            if(newConnection){
                storageUser(wallet);
                saveOnAccountsConnected(response.data.user);
            }
        } catch (e) {
            console.log(e);
        }
    }

    async function getImageProfile(hash) {
        if (!hash) setImageProfile("");

        const response = await getImage(hash);
        setImageProfile(response);
    }

    async function handleGetEraInfo() {
        const response = await getEraInfo();
        setNextEra(response.nextEraIn);
        setEra(response.eraAtual);
        setEpoch(response.epoch);
    }

    async function getImpact() {
        const response = await api.get('/impact-per-token');
        setImpactToken(response.data.impact);
    }

    async function Sync() {
        const wallet = await ConnectWallet();
        if (wallet.connectedStatus) {
            newFlowConnectUser(wallet.address[0], true);
        }
    }

    async function loginWithWalletAndPassword(wallet, password) {
        try {
            const response = await api.post('/login', {
                wallet,
                password,
            });

            if (response.data) {
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data}`;
                newFlowConnectUser(wallet, true);
                //setWalletConnected(String(wallet).toLowerCase());
                //storageUser(response.data, String(wallet).toLowerCase(), 'notprovider');
            }
            return true;
        } catch (err) {
            if (err.response?.data?.message === 'User not found') {
                toast.error('Usuário não encontrado!')
                return false;
            }

            if (err.response?.data?.message === 'User deleted') {
                toast.error('Essa conta foi excluida!')
                return false;
            }

            if (err.response?.data?.message === 'Password incorrect') {
                toast.error('Senha incorreta!')
                return false;
            }
        }
    }

    async function storageUser(wallet) {
        const encrypt = CryptoJS.AES.encrypt(process.env.REACT_APP_LOGIN_SECRET_PASS, process.env.REACT_APP_LOGIN_SECURITY_KEY);

        try {
            const response = await api.post('/login/with-secure-key', {
                wallet: wallet,
                secureKey: encrypt.toString(),
            })

            if (response.data) {
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data}`;
                const data = {
                    token: response.data,
                    wallet,
                    createdAt: new Date()
                }
        
                localStorage.setItem('user_connected', JSON.stringify(data));
            }
        } catch (err) {
            console.log('Error on storage user: ' + err)   
        }
    }

    function chooseModalRegister() {
        setModalRegister(!modalRegister);
    }

    function chooseModalTutorial() {
        setModalTutorial(!modalTutorial);
    }

    function chooseModalFeedBack() {
        setModalFeedback(!modalFeedback);
    }

    async function checkUser(wallet) {
        const response = await CheckUser(String(wallet));
        setUser(response);
        setWalletConnected(wallet);
        if (response !== '0') {
            getUserDataApi(wallet)
        }
        return response;
    }

    async function getUserDataApi(wallet) {
        const response = await api.get(`/user/${wallet}`);
        const resUser = response.data.user
        setUserData(resUser);
        setAccountStatus(resUser?.accountStatus);
        saveOnAccountsConnected(resUser);

        if (resUser?.accountStatus === 'blockchain') {
            getUserBlockchainData(wallet, resUser?.userType);
        }

        if (resUser?.accountStatus !== 'blockchain') {
            getInviteData(resUser?.wallet);
        }

        const image = await getImage(resUser.imgProfileUrl);
        setImageProfile(image);
    }

    async function getInviteData(wallet) {
        const response = await getInvitations(wallet);

        setInviteData(response)
        if (response?.invited === '0x0000000000000000000000000000000000000000') {
            setAccountStatus('pending');
            updateAccountStatus(wallet, "pending");
        }
        if (String(response?.invited).toLowerCase() === String(wallet).toLowerCase()) {
            setAccountStatus('guest');
            updateAccountStatus(wallet, "guest")
        }
    }

    async function updateAccountStatus(wallet, status) {
        api.put('/user/account-status', {
            userWallet: wallet,
            status,
        })
    }

    async function saveOnAccountsConnected(user) {
        const filter = accountsConnected.filter(item => String(item?.wallet).toUpperCase() === String(user?.wallet).toUpperCase());
        if (filter.length === 0) {
            let accounts = [];
            accounts = accountsConnected;

            accounts.push({
                id: user?.id,
                name: user?.name,
                wallet: user?.wallet,
                userType: user?.userType,
                imgProfile: user?.imgProfileUrl,
            });

            await localStorage.setItem('accounts_connected', JSON.stringify(accounts));
        }
    }

    async function getUserBlockchainData(wallet, userType) {
        if (userType === 1) {
            const response = await api.get(`/web3/producer-data/${String(wallet).toLowerCase()}`);
            setBlockchainData(response.data);
            setUserBlockchain(response.data.producer);
        }

        if (userType === 2) {
            const response = await api.get(`/web3/inspector-data/${String(wallet).toLowerCase()}`);
            setBlockchainData(response.data);
            setUserBlockchain(response.data.inspector);
        }

        if (userType === 4) {
            const response = await api.get(`/web3/developer-data/${String(wallet).toLowerCase()}`);
            setBlockchainData(response.data);
            setUserBlockchain(response.data.developer);
        }

        if (userType === 3) {
            const response = await api.get(`/web3/researcher-data/${String(wallet).toLowerCase()}`);
            setBlockchainData(response.data);
            setUserBlockchain(response.data.researcher);
        }

        if (userType === 6) {
            const response = await api.get(`/web3/activist-data/${String(wallet).toLowerCase()}`);
            setBlockchainData(response.data);
            setUserBlockchain(response.data.activist);
        }

        if (userType === 7) {
            const response = await api.get(`/web3/supporter-data/${String(wallet).toLowerCase()}`);
            setBlockchainData(response.data);
            setUserBlockchain(response.data.supporter);
        }

        if (userType === 8) {
            const response = await api.get(`/web3/validator-data/${String(wallet).toLowerCase()}`);
            setBlockchainData(response.data);
            setUserBlockchain(response.data.validator);
        }
    }

    async function getAtualBlockNumber() {
        const web3js = new Web3(window.ethereum);
        await web3js.eth.getBlockNumber()
            .then(res => {
                setBlockNumber(res)
            })
    }

    function toggleMenu() {
        setMenuOpen(!menuOpen);
    }

    function toggleModalChooseLang() {
        setModalChooseLang(!modalChooseLang);
    }

    function chooseLanguage(lang) {
        setLanguage(lang);
        setStorageLanguage(lang);
        i18n.changeLanguage(lang);
        setModalChooseLang(false);
    }

    function setStorageLanguage(lang) {
        localStorage.setItem('language', lang);
    }

    async function getStorageLanguage() {
        const lang = await localStorage.getItem('language');
        if (lang) {
            setLanguage(lang);
            i18n.changeLanguage(lang);
        } else {
            setModalChooseLang(true)
        }
    }

    async function getNotifications() {
        //const responseWallet = await Sync();
        const responseNotifications = await api.get(`/notifications/${walletConnected}`);
        setNotifications(responseNotifications.data.notifications.Notifications)
    }

    function logout() {
        setWalletConnected('');
        setUserData(null);
        setBlockchainData({});
        localStorage.removeItem('user_connected');
    }

    return (
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
                walletSelected,
                setWalletSelected,
                modalTutorial,
                chooseModalTutorial,
                userData,
                getUserDataApi,
                modalFeedback,
                chooseModalFeedBack,
                era,
                notifications,
                getNotifications,
                viewMode,
                transactionOpen,
                setTransactionOpen,
                transactionOpened,
                loginWithWalletAndPassword,
                imageProfile,
                connectionType,
                accountStatus,
                blockchainData,
                tokensToContribute,
                setTokensToContribute,
                itemsCalculator,
                setItemsCalculator,
                logout,
                nextEra,
                impactToken,
                epoch,
                accountsConnected,
                getUserBlockchainData,
                userBlockchain,
                userTypeConnected,
                newFlowConnectUser
            }}
        >
            {children}

            <ToastContainer />
        </MainContext.Provider>
    )
}