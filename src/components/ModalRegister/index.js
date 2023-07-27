import React, {useState, useEffect, useRef, useContext} from 'react';
import { MainContext } from '../../contexts/main';
import { useParams, useNavigate } from 'react-router';
import './modalRegister.css';
import * as Dialog from '@radix-ui/react-dialog';
import { LoadingTransaction } from '../LoadingTransaction';
import Loading from '../Loading';
import { WebcamComponent } from '../Webcam';
import InputMask from 'react-input-mask';
import axios from 'axios';
import {addContributor, addActivist, addProducer, addInvestor, addDeveloper, addAdvisor, addResearcher} from "../../services/registerService";
import { save, get } from '../../config/infura';
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from 'react-i18next';
import Map from '../Map';
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import {api} from '../../services/api';
import {FiCamera} from 'react-icons/fi';
import {FaBook} from 'react-icons/fa';
import { Help } from '../help';
import { ModalRequestSepolia } from '../ModalRequestSepolia';
import {IoMdCloseCircleOutline} from 'react-icons/io';

export default function ModalRegister(){
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {walletConnected, chooseModalRegister, getUserDataApi} = useContext(MainContext);
    const {walletAddress, walletSelected} = useParams();
    const [loading, setLoading] = useState(false);
    const [loadingCalculateArea, setLoadingCalculateArea] = useState(false);
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});
    const [areaProperty, setAreaProperty] = useState(0);
    const [modalSepolia, setModalSepolia] = useState(false);
    const [locationManual, setLocationManual] = useState(false);

    const [checkWebcam, setCheckWebcam] = useState(false);
    const [step, setStep] = useState(1);
    const [type, setType] = useState("");
    const [modalWebcam, setModalWebcam] = useState(false);
    const [name, setName] = useState("");
    const [documetType, setDocumentType] = useState("");
    const [documetNumber, setDocumentNumber] = useState("");
    const [cep, setCep] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [street, setStreet] = useState("");
    const [complement, setComplement] = useState("");
    const [proofPhoto, setProofPhoto] = useState("");
    const [proofPhotoBase64, setProofPhotoBase64] = useState("");
    const [country, setCountry] = useState("");
    const [geoLocation, setGeolocation] = useState('');
    const [propertyGeolocation, setPropertyGeolocation] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    let formatDocument = useRef('')

    useEffect(() => {
        switch (documetType) {
        case 'cpf':
            formatDocument.current = '999.999.999-99'
            break;
        case 'cnpj':
            formatDocument.current = '99.999.999/9999-99'
            break;
        case 'rg':
            formatDocument.current = '99.999.999-9'
            break;
        
        default:
            break;
        }
    }, [documetType]);

    useEffect(() => {
        if(cep.replace('_','').replace('-','').length === 8){
            handleSearchAddress()
        }
    }, [cep]);

    useEffect(() => {
        if(step === 3 && type === 'activist'){
            getLocale()
        }
        if(step === 3 && type === 'producer'){
            getLocale()
        }
    },[step])

    async function handleSearchAddress(){
        setLoading(true);
        try{
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json`);
            if(response.data.erro === true){
                toast.error(`${t('No address found with that zip code')}!`);
                setState('');
                setCity('');
                setStreet('');
                setCountry('');
            }else{
                setState(response.data.uf);
                setCity(response.data.localidade);
                setStreet(response.data.logradouro);
                setCountry('Brasil');
            }
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false);
        }
        
    }

    function handleNextStep(){
        if(step === 1 && type === ''){
            toast.error('Select a user type!')
            return;
        }
        if(step === 2 && type !== 'investor' && proofPhotoBase64 === ''){
            toast.error('It is necessary to send a photo!')
            return;
        }
        if(step === 1 && type === 'investor'){
            setStep(3)
            return;
        }
        if(type === 'producer' && step === 3){
            setStep(4)
        }
        if(step < 3){
            setStep(step + 1)
        }
    }

    function handlePreviousStep(){
        if(step === 3 && type === 'investor'){
            setStep(1)
            return;
        }
        if(step > 1){
            setStep(step - 1)
        }
    }

    async function handleProofPhoto(data){
        setLoading(true);
        let res = await fetch(data);
        let myBlob = await res.blob();
    
        const hashPhoto = await save(myBlob);
        setProofPhoto(hashPhoto);

        const base64Hash = await get(hashPhoto);
        setProofPhotoBase64(base64Hash);
        setLoading(false);
    } 

    function validateData(){
        if(loading){
            return;
        }

        if(!name.trim()) {
            toast.error(`${t('Fill in the name field')}!`);
            return;
        }

        if(step === 2){
            if(!proofPhoto.trim() && type !== 'investor'){
                toast.error(`${t('Take proof photo')}!`);
                return;
            }
        }


        if(type === 'producer'){
            if(documetType === ''){
                toast.error(`${t('Select document type')}!`);
                return;
            }

            if(!documetNumber.trim()){
                toast.error(`${t('Fill in the document field')}!`);
                return;
            }

            if(state === '' || !cep.trim()){
                toast.error(`${t('Enter a valid zip code')}!`);
                return;
            }

            if(!street.trim()){
                toast.error(`${t('Fill in the street field')}!`);
                return;
            }

            if(locationManual){
                if(areaProperty === 0){
                    return;
                }
                if(!lat.trim()){
                    return;
                }
                if(!lng.trim()){
                    return;
                }
            }

            if(!locationManual){
                if(geoLocation === ''){
                    toast.error(`${t('Authorize location access permission')}!`);
                    return;
                }
            }

            if(!locationManual){
                if(propertyGeolocation === ''){
                    toast.error(`${t('It is necessary to demarcate the area of ​​​​your property')}!`);
                    return;
                }
            }
            if(areaProperty === 0){
                toast.error(`${t('Invalid Area! Refresh page.')}!`);
                return;
            }

            if(!complement.trim()){
                toast.error(`${t('Fill in the complement field')}!`);
                return;
            }

            // if(areaProperty < 5000){
            //     toast.error(t('Your property must be at least 5,000m²'))
            //     return
            // }

            // if(geoLocation === ''){
            //     toast.error(t('Mark the center of your property'))
            //     return;
            // }
        }

        if(type === 'activist'){
            if(!password.trim()){
                toast.error(`${t('Fill in the password field')}!`);
                return;
            }

            if(!confirmPassword.trim()){
                toast.error(`${t('Fill in the confirm password field')}!`);
                return;
            }

            if(password !== confirmPassword){
                toast.error(`${t("Passwords don't match")}!`);
                return;
            }
        }

        register();
    }

    async function register() {
        let address = {
            zipCode: cep,
            state,
            city,
            complement,
            street,
            country
        }

        let local = '';
        if(locationManual){
            let data = {
                lat: Number(lat),
                lng: Number(lng),
            }
            local = JSON.stringify(data);
        }else{
            local = geoLocation
        }
        if(type === 'producer'){
            setModalTransaction(true);
            setLoadingTransaction(true);
            addProducer(walletConnected, name, proofPhoto, local, areaProperty)
            .then(res => {
                setLogTransaction({
                    type: res.type,
                    message: res.message,
                    hash: res.hashTransaction
                })
                try{
                    setLoading(true);
                    api.post('/users', {
                        name,
                        wallet: String(walletConnected).toUpperCase(),
                        userType: 1,
                        geoLocation,
                        propertyGeolocation,
                        imgProfileUrl: proofPhoto,
                        address: JSON.stringify(address),
                        level: 1
                    })
                }catch(err){
                    console.log(err);
                }finally{
                    setLoading(false)
                    setLoadingTransaction(false);
                }
            })
            .catch(err => {
                setLoadingTransaction(false);
                const message = String(err.message);
                if(message.includes("Not allowed user")){
                    setLogTransaction({
                        type: 'error',
                        message: 'Not allowed user',
                        hash: ''
                    })
                    return;
                }
                if(message.includes("This producer already exist")){
                    setLogTransaction({
                        type: 'error',
                        message: 'This producer already exist',
                        hash: ''
                    })
                    return;
                }
                if(message.includes("User already exists")){
                    setLogTransaction({
                        type: 'error',
                        message: 'User already exists',
                        hash: ''
                    })
                    return;
                }
                setLogTransaction({
                    type: 'error',
                    message: 'Something went wrong with the transaction, please try again!',
                    hash: ''
                })
            });
        }

        if(type === 'activist'){
            setModalTransaction(true);
            setLoadingTransaction(true);
            addActivist(walletConnected, name, proofPhoto, geoLocation)
            .then(res => {
                setLogTransaction({
                    type: res.type,
                    message: res.message,
                    hash: res.hashTransaction
                })
                try{
                    setLoading(true);
                    api.post('/users', {
                        name,
                        wallet: String(walletConnected).toUpperCase(),
                        userType: 2,
                        password,
                        geoLocation: geoLocation,
                        imgProfileUrl: proofPhoto,
                        level: 1
                    })
                }catch(err){
                    console.log(err);
                }finally{
                    setLoading(false)
                    setLoadingTransaction(false);
                }
            })
            .catch(err => {
                setLoadingTransaction(false);
                const message = String(err.message);
                console.log(message);
                if(message.includes("Not allowed user")){
                    setLogTransaction({
                        type: 'error',
                        message: 'Not allowed user',
                        hash: ''
                    })
                    return;
                }
                if(message.includes("This activist already exist")){
                    setLogTransaction({
                        type: 'error',
                        message: 'This activist already exist',
                        hash: ''
                    })
                    return;
                }
                if(message.includes("User already exists")){
                    setLogTransaction({
                        type: 'error',
                        message: 'User already exists',
                        hash: ''
                    })
                    return;
                }
                setLogTransaction({
                    type: 'error',
                    message: 'Something went wrong with the transaction, please try again!',
                    hash: ''
                })
            });
        }

        if(type === 'contributor'){
            setModalTransaction(true);
            setLoadingTransaction(true);
            addContributor(walletConnected, name, proofPhoto)
            .then(res => {
                setLogTransaction({
                    type: res.type,
                    message: res.message,
                    hash: res.hashTransaction
                })
                try{
                    setLoading(true);
                    api.post('/users', {
                        name,
                        wallet: String(walletConnected).toUpperCase(),
                        userType: 6,
                        level: 1
                    })
                }catch(err){
                    console.log(err);
                }finally{
                    setLoadingTransaction(false);
                    setLoading(false)
                }
            })
            .catch(err => {
                setLoadingTransaction(false);
                const message = String(err.message);
                if(message.includes("Not allowed user")){
                    setLogTransaction({
                        type: 'error',
                        message: 'Not allowed user',
                        hash: ''
                    })
                    return;
                }
                if(message.includes("This contributor already exist")){
                    setLogTransaction({
                        type: 'error',
                        message: 'This contributor already exist',
                        hash: ''
                    })
                    return;
                }
                if(message.includes("User already exists")){
                    setLogTransaction({
                        type: 'error',
                        message: 'User already exists',
                        hash: ''
                    })
                    return;
                }
                setLogTransaction({
                    type: 'error',
                    message: 'Something went wrong with the transaction, please try again!',
                    hash: ''
                })
            })
        }

        if(type === 'investor'){
            setModalTransaction(true);
            setLoadingTransaction(true);
            addInvestor(walletConnected, name)
            .then(res => {
                setLogTransaction({
                    type: res.type,
                    message: res.message,
                    hash: res.hashTransaction
                })
                try{
                    setLoading(true);
                    api.post('/users', {
                        name,
                        wallet: String(walletConnected).toUpperCase(),
                        userType: 7,
                        level: 1
                    })
                }catch(err){
                    console.log(err);
                }finally{
                    setLoadingTransaction(false);
                    setLoading(false)
                }
            })
            .catch(err => {
                setLoadingTransaction(false);
                const message = String(err.message);
                if(message.includes("Not allowed user")){
                    setLogTransaction({
                        type: 'error',
                        message: 'Not allowed user',
                        hash: ''
                    })
                    return;
                }
                if(message.includes("This investor already exist")){
                    setLogTransaction({
                        type: 'error',
                        message: 'This investor already exist',
                        hash: ''
                    })
                    return;
                }
                if(message.includes("User already exists")){
                    setLogTransaction({
                        type: 'error',
                        message: 'User already exists',
                        hash: ''
                    })
                    return;
                }
                setLogTransaction({
                    type: 'error',
                    message: 'Something went wrong with the transaction, please try again!',
                    hash: ''
                })
            });
        }

        if(type === 'developer'){
            setModalTransaction(true);
            setLoadingTransaction(true);
            addDeveloper(walletConnected, name, proofPhoto)
            .then(res => {
                setLogTransaction({
                    type: res.type,
                    message: res.message,
                    hash: res.hashTransaction
                })
                try{
                    setLoading(true);
                    api.post('/users', {
                        name,
                        wallet: String(walletConnected).toUpperCase(),
                        userType: 4,
                        level: 1
                    })
                }catch(err){
                    console.log(err);
                }finally{
                    setLoading(false)
                    setLoadingTransaction(false);
                }
            })
            .catch(err => {
                setLoadingTransaction(false);
                const message = String(err.message);
                if(message.includes("Not allowed user")){
                    setLogTransaction({
                        type: 'error',
                        message: 'Not allowed user',
                        hash: ''
                    })
                    return;
                }
                if(message.includes("This developer already exist")){
                    setLogTransaction({
                        type: 'error',
                        message: 'This developer already exist',
                        hash: ''
                    })
                    return;
                }
                if(message.includes("User already exists")){
                    setLogTransaction({
                        type: 'error',
                        message: 'User already exists',
                        hash: ''
                    })
                    return;
                }
                setLogTransaction({
                    type: 'error',
                    message: 'Something went wrong with the transaction, please try again!',
                    hash: ''
                })
            });
        }
        
        if(type === 'researcher'){
            setModalTransaction(true);
            setLoadingTransaction(true);
            addResearcher(walletConnected, name, proofPhoto)
            .then(res => {
                setLogTransaction({
                    type: res.type,
                    message: res.message,
                    hash: res.hashTransaction
                })
                try{
                    setLoading(true);
                    api.post('/users', {
                        name,
                        wallet: String(walletConnected).toUpperCase(),
                        userType: 3,
                        level: 1
                    })
                }catch(err){
                    console.log(err);
                }finally{
                    setLoading(false)
                    setLoadingTransaction(false);
                }
            })
            .catch(err => {
                setLoadingTransaction(false);
                const message = String(err.message);
                if(message.includes("Not allowed user")){
                    setLogTransaction({
                        type: 'error',
                        message: 'Not allowed user',
                        hash: ''
                    })
                    return;
                }
                if(message.includes("This researcher already exist")){
                    setLogTransaction({
                        type: 'error',
                        message: 'This researcher already exist',
                        hash: ''
                    })
                    return;
                }
                if(message.includes("User already exists")){
                    setLogTransaction({
                        type: 'error',
                        message: 'User already exists',
                        hash: ''
                    })
                    return;
                }
                setLogTransaction({
                    type: 'error',
                    message: 'Something went wrong with the transaction, please try again!',
                    hash: ''
                })
            });
        }

        if(type === 'advisor'){
            setModalTransaction(true);
            setLoadingTransaction(true);
            addAdvisor(walletConnected, name, proofPhoto)
            .then(res => {
                setLogTransaction({
                    type: res.type,
                    message: res.message,
                    hash: res.hashTransaction
                })
                try{
                    setLoading(true);
                    api.post('/users', {
                        name,
                        wallet: String(walletConnected).toUpperCase(),
                        userType: 5,
                        level: 1
                    })
                }catch(err){
                    console.log(err);
                }finally{
                    setLoadingTransaction(false);
                    setLoading(false)
                }
            })
            .catch(err => {
                setLoadingTransaction(false);
                const message = String(err.message);
                if(message.includes("Not allowed user")){
                    setLogTransaction({
                        type: 'error',
                        message: 'Not allowed user',
                        hash: ''
                    })
                    return;
                }
                if(message.includes("This advisor already exist")){
                    setLogTransaction({
                        type: 'error',
                        message: 'This advisor already exist',
                        hash: ''
                    })
                    return;
                }
                if(message.includes("User already exists")){
                    setLogTransaction({
                        type: 'error',
                        message: 'User already exists',
                        hash: ''
                    })
                    return;
                }
                setLogTransaction({
                    type: 'error',
                    message: 'Something went wrong with the transaction, please try again!',
                    hash: ''
                })
            });
        }
    }

    async function calculateArea(coords){
        console.log(coords);
        setLoading(true);
        let coordsUTM = [];
        for(var i = 0; i < coords.length; i++){
            let object = {}
            const response = await axios.get(`https://epsg.io/srs/transform/${coords[i].lng},${coords[i].lat}.json?key=default&s_srs=4326&t_srs=3857`)
            object = response.data.results[0]
            coordsUTM.push(object);
        }

        let areaX = 0;
        let areaY = 0;
        for(var i = 1; i < coordsUTM.length; i++){
            let product1 = coordsUTM[i-1].y * coordsUTM[i].x;
            areaX += product1
        }
        for(var i = 1; i < coordsUTM.length; i++){
            let product2 = coordsUTM[i-1].x * coordsUTM[i].y;
            areaY += product2
        }

        let repeatX = coordsUTM[coordsUTM.length - 1].y * coordsUTM[0].x; 
        let repeatY = coordsUTM[coordsUTM.length - 1].x * coordsUTM[0].y; 

        areaX += repeatX;
        areaY += repeatY;

        let D = areaX - areaY;
        let areaM2 = 0.5 * D;
        setAreaProperty(Math.abs(areaM2));
        setLoading(false);
        console.log(Math.abs(areaM2))
        if(Math.abs(areaM2) < 5000){
            toast.error(t('Your property must be at least 5,000m²'))
        }
    }

    function getLocale(){
        navigator.geolocation.getCurrentPosition(res => {
            const data = {
                lat: res.coords.latitude,
                lng: res.coords.longitude
            }
            setGeolocation(JSON.stringify(data))
        })
    }

    function resetData(){
        // setName('');
        // setDocumentType('');
        // setDocumentNumber('');
        // setCep('');
        // setState('');
        // setCity('');
        // setStreet('');
        // setProofPhoto('');
        // setComplement('');
        // setGeolocation('');
        // setPropertyGeolocation('');
        // setPassword('');
        // setConfirmPassword('');
    }

    return(
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] fixed inset-0'/>
            <Dialog.Content className='fixed flex flex-col items-center justify-between pb-3 lg:w-[500px] lg:h-[550px] bg-green-950 rounded-md m-2 lg:m-auto inset-0 border-2'>
                <div className='w-full h-16 flex justify-between items-center rounded-t-md bg-[#0a4303] border-b-2'>
                    <div className='px-3'/>
                    <img
                        src={require('../../assets/logo-branco.png')}
                        className='w-[120px] object-contain'
                    />
                    <Dialog.Close
                        className='h-10 text-white text-sm lg:text-base px-3'
                    >
                        <IoMdCloseCircleOutline size={25} color='white'/>
                    </Dialog.Close>
                </div>

                {step === 1 && (
                    <div className='w-full flex flex-col items-center overflow-auto'>
                        <h1 className='font-bold text-lg lg:text-2xl text-white'>{t('Register')}</h1>
                        <p className='font-bold text-sm lg:text-md text-white'>{t('Do you want to register as one')}?</p>
                        
                        <select
                            defaultValue={type}
                            onChange={(e) => {
                                setType(e.target.value)
                                resetData();
                            }}
                            className='mt-10 lg:w-[50%] h-8 lg:h-10 bg-[#C66828] text-white font-bold'
                        >
                            <option selected value="">{t('Select user')}</option>
                            <option value="producer">{t('Producer')}</option>
                            <option value="activist">{t('Activist')}</option>
                            <option value="contributor">{t('Validator')}</option>
                            <option value="investor">{t('Investor')}</option>
                            <option value="developer">{t('Developer')}</option>
                            <option value="researcher">{t('Researcher')}</option>
                        </select>

                        <Help
                            description='Choose above the type of user you want to register'
                        />
                    </div>
                )}

                {step === 2 && (
                    <div className='w-full flex flex-col items-center overflow-auto py-2'>
                        {proofPhoto === '' && (
                            <h1 className='text-sm lg:text-lg text-center text-white mb-10'>{t('Now we need to take a picture. This photo will be used to prove your identity and necessary to the inspection proof photo')}.</h1>
                        )}

                        {proofPhoto != '' && (
                            <img
                                src={`data:image/png;base64,${proofPhotoBase64}`}
                                className="w-[250px] h-[210px] object-cover mb-3 border-4 border-[#A75722]"
                            />
                        )}
                        
                        <button
                            onClick={() => {
                                setCheckWebcam(true);
                                setTimeout(() => {
                                    setModalWebcam(true);
                                }, 1000)
                            }}

                            className='flex items-center justify-center gap-2 px-5 h-8 lg:h-10 bg-[#2066CF] font-bold text-white rounded-md'
                        >
                            <FiCamera size={25} color='white'/>
                            {t('Take Photo')}
                        </button>

                        <Help
                            description='Click the button above and then click allow on the permission popup that will open in your browser'
                        />
                    </div>
                )}

                {step === 3 && (
                    <div className='w-full flex flex-col items-center p-2 overflow-auto'>
                        {/* <h1 className='text-center lg:text-lg text-md text-white'>
                            {t('Now provide your details')}.
                            {type === 'producer' && ` ${t('Make sure that in address is correct, it can not be changed in the future')}.`}
                        </h1> */}

                        <div className='lg:w-[450px] w-full mt-2 lg:mt-5'>
                            <div className='flex flex-col'>
                                <label className='font-bold text-white' >{t('Name')}</label>
                                <input
                                    placeholder='Type here'
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className='w-full h-8 lg:h-10 border-2 border-[#A75722] rounded p-1'
                                />
                            </div>
                        {type === 'producer'&& (
                            <>

                                <div className='flex gap-3 mt-3 items-center'>
                                    <div className='flex flex-col'>
                                        <label htmlFor="cep" className='font-bold text-white'>{t('ZIP Code')}</label>
                                        <InputMask
                                            placeholder='Type here'
                                            type="text"
                                            name="cep"
                                            value={cep}
                                            onChange={(e) => setCep(e.target.value)}
                                            mask='99999-999'
                                            required
                                            className='w-32 h-8 lg:h-10 border-2 border-[#A75722] rounded p-1'
                                        />
                                    </div>
                                
                                    
                                    <p className='text-sm lg:text-base font-bold text-white mt-4 lg:mt-0'>
                                        {state === '' ? '' : `${city}-${state}, ${country}.`}
                                    </p>
                                    
                                </div>

                                
                                <div className='flex items-center gap-5 mt-3'>
                                    <div className='flex flex-col'>
                                        <label htmlFor="street" className='font-bold text-white'>{t('Street')}</label>
                                        <input
                                            placeholder='Type here'
                                            name="street"
                                            value={street}
                                            onChange={(e) => setStreet(e.target.value)}
                                            required
                                            className='w-full h-8 lg:h-10 border-2 border-[#A75722] rounded p-1'
                                        />
                                    </div>

                                    <div className='flex flex-col'>
                                        <label htmlFor="complement" className='font-bold text-white'>{t('Complement')}</label>
                                        <input
                                            placeholder='Type here'
                                            name="complement"
                                            value={complement}
                                            onChange={(e) => setComplement(e.target.value)}
                                            required
                                            className='w-full h-8 lg:h-10 border-2 border-[#A75722] rounded p-1'
                                        />
                                    </div>
                                </div>

                                <div className='flex gap-5 mt-3' >
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <select 
                                            value={documetType}
                                            onChange={(e) => setDocumentType(e.target.value)}
                                            className='w-full h-8 lg:h-10 border-2 border-[#A75722] rounded p-1'
                                        >
                                            <option selected value="">Select Document Type</option>
                                            <option value="rg">RG</option>
                                            <option value="cpf">CPF</option>
                                            <option value="cnpj">CNPJ</option>
                                        </select>
                                    </div>
                                
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <InputMask
                                            type="text"
                                            placeholder={t('Document Number')}
                                            mask={formatDocument.current}
                                            value={documetNumber}
                                            name="documetNumber"
                                            onChange={(e) => setDocumentNumber(e.target.value)}
                                            required
                                            className='w-full h-8 lg:h-10 border-2 border-[#A75722] rounded p-1'
                                        />
                                    </div>
                                </div>

                                <Help
                                    description='Give location permission in the popup that opened in your browser. Then fill in all the data correctly, as it is not possible to change it in the future'
                                />
                            </>
                        )}

                        {type === 'activist' && (
                            <>
                                <div className='flex flex-col lg:flex-row gap-3 mt-5 '>
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <label htmlFor="password" style={{fontWeight: 'bold', color: 'white'}}>{t('Password')}</label>
                                        <input
                                            placeholder='Type here'
                                            name="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className='w-[180px] h-9 rounded-sm border-2 border-[#A75722] px-1'
                                            required
                                            type='password'
                                        />
                                    </div>

                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <label htmlFor="confirmPassword" style={{fontWeight: 'bold', color: 'white'}}>{t('Confirm Password')}</label>
                                        <input
                                            placeholder='Type here'
                                            name="confirmPassword"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className='w-[180px] h-9 rounded-sm border-2 border-[#A75722] px-1'
                                            required
                                            type='password'
                                        />
                                    </div>
                                </div>

                                <Help
                                    description="Fill in your name. This password will be used to enter the activist's Mobile App"
                                />
                            </>
                        )}
                        </div>
                    </div>
                    
                )}

                {step === 4 && (
                    <div className='modal-register__container-content mb-1 overflow-auto'>
                        {/* <h1 className='font-bold lg:text-lg text-center text-white'>{t('Circle the entire area of ​​your property, clicking on the edges until you complete the entire circle')}.</h1> */}
                        
                        {locationManual ? (
                            <>
                                <div className='flex flex-col'>
                                    <label  className='font-bold text-[#ff9900]'>{t('Latitude')}</label>
                                    <input
                                        placeholder='Latitude'
                                        
                                        value={lat}
                                        onChange={(e) => setLat(e.target.value)}
                                        required
                                        className='w-full h-8 lg:h-10 border-2 border-[#A75722] rounded p-1'
                                    />

                                    <label className='font-bold text-[#ff9900] mt-2'>{t('Longitude')}</label>
                                    <input
                                        placeholder='Longitude'
                                        
                                        value={lng}
                                        onChange={(e) => setLng(e.target.value)}
                                        required
                                        className='w-full h-8 lg:h-10 border-2 border-[#A75722] rounded p-1'
                                    
                                    />

                                    <label htmlFor="street" className='font-bold text-[#ff9900] mt-2'>{t('Área Propriedade (Em m²):')}</label>
                                    <input
                                        placeholder='Área em m²'
                                        name="street"
                                        value={areaProperty}
                                        onChange={(e) => setAreaProperty(Number(e.target.value))}
                                        required
                                        className='w-full h-8 lg:h-10 border-2 border-[#A75722] rounded p-1'
                                        type='numeric'
                                    />

                                    <button 
                                        onClick={() => setLocationManual(false)} 
                                        className='px-2 py-1 bg-[#ff9900] text-white font-bold my-2 rounded-md'
                                    >
                                        {t('Usar Google Maps')}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                            <button onClick={() => setLocationManual(true)} className='px-2 py-1 bg-[#ff9900] text-white font-bold my-2 rounded-md'>{t('Inserir localização manualmente')}</button>
                            <div className='flex w-full'>
                                <Map
                                    setCenter={(position) => {setGeolocation(JSON.stringify(position))}}
                                    editable={true}
                                    setPolyline={(path) => {
                                        setPropertyGeolocation(path)
                                        calculateArea(JSON.parse(path))
                                        console.log(path)
                                    }}
                                />
                            </div>

                            </>
                        )}

                        <Help
                            description="Circle the entire area of ​​your property, clicking on the edges until you complete the entire circle"
                        />
                    </div>
                )}

                <div className='flex w-full justify-between items-center gap-2 border-t-2 px-3 pt-3'>
                    <div className='lg:w-[120px]'>
                    {step > 1 && (
                        <button 
                            className='lg:w-[120px] h-8 lg:h-10 bg-[#C66828] rounded-md text-white text-sm lg:text-base px-1'
                            onClick={handlePreviousStep}
                        >
                            {t('Previous')}
                        </button>
                    )}
                    </div>

                    <button
                        className='border-2 rounded-md border-[#ff9900] px-2 h-8 lg:h-10 text-bold text-[#ff9900]'
                        onClick={() => setModalSepolia(true)}
                    >
                        Solicitar SepoliaETH
                    </button>

                    <button 
                        className='lg:w-[120px] h-8 lg:h-10 bg-[#C66828] rounded-md text-white text-sm lg:text-base px-1'
                        onClick={() => {
                            if(step === 4){
                                validateData();
                            }else if(step === 3 && type !== 'producer'){
                                validateData();
                            }else{
                                handleNextStep();
                            }
                        }}
                    >
                        {step === 4 && `${t('Register')}`}
                        {step === 3 && (
                            <>
                                {type === 'producer' && `${t('Next Step')}`}
                                {type !== 'producer' && `${t('Register')}`}
                            </>
                        )}
                        {step === 1 && `${t('Next Step')}`}
                        {step === 2 && `${t('Next Step')}`}
                    </button>
                </div>

                <Dialog.Root
                    open={modalWebcam}
                    onOpenChange={(open) => {
                        setCheckWebcam(false);
                        setModalWebcam(open)
                    }}
                >
                    <WebcamComponent
                        check={checkWebcam}
                        onTake={(data) => {
                            handleProofPhoto(data);
                            setModalWebcam(false);
                            setCheckWebcam(false);
                        }}  
                    />
                </Dialog.Root>
            </Dialog.Content>

            <Dialog.Root open={modalTransaction} onOpenChange={(open) => {
                if(!loadingTransaction){
                    setModalTransaction(open)
                    if(logTransaction.type === 'success'){
                        getUserDataApi();
                        if(type === 'producer'){
                            navigate(`/dashboard/${walletAddress}/my-account/1/${walletAddress}`)
                        }
                        if(type === 'activist'){
                            navigate(`/dashboard/${walletAddress}/my-account/2/${walletAddress}`)
                        }
                        if(type === 'contributor'){
                            navigate(`/dashboard/${walletAddress}/my-account/6/${walletAddress}`)
                        }
                        if(type === 'investor'){
                            navigate(`/dashboard/${walletAddress}/my-account/7/${walletAddress}`)
                        }
                        if(type === 'developer'){
                            navigate(`/dashboard/${walletAddress}/my-account/4/${walletAddress}`)
                        }
                        if(type === 'researcher'){
                            navigate(`/dashboard/${walletAddress}/my-account/3/${walletAddress}`)
                        }
                        chooseModalRegister();
                    }
                }
            }}>
                <LoadingTransaction
                    loading={loadingTransaction}
                    logTransaction={logTransaction}
                    action='register'
                />
            </Dialog.Root>

            <Dialog.Root
                open={modalSepolia}
                onOpenChange={(open) => setModalSepolia(open)}
            >
                <ModalRequestSepolia close={() => {
                    setModalSepolia(false)
                    toast.success('SepoliaETH requisitado com sucesso! O quanto antes a nossa equipe enviará seus SepoliaETH.')
                }}/>
            </Dialog.Root>

            {loading && <Loading/>}
            <ToastContainer
                position='top-center'
            />
        </Dialog.Portal>
    )
}