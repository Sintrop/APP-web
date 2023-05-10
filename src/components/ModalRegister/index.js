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

export default function ModalRegister(){
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {walletConnected, chooseModalRegister} = useContext(MainContext);
    const {walletAddress, walletSelected} = useParams();
    const [loading, setLoading] = useState(false);
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});
    const [areaProperty, setAreaProperty] = useState(0);

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
        // if(step === 2 && type !== 'investor' && proofPhotoBase64 === ''){
        //     toast.error('It is necessary to send a photo!')
        //     return;
        // }
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
        if(!name.trim()) {
            toast.error(`${t('Fill in the name field')}!`);
            return;
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

            // if(!complement.trim()){
            //     toast.error(`${t('Fill in the complement field')}!`);
            //     return;
            // }

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
        if(type === 'producer'){
            setModalTransaction(true);
            setLoadingTransaction(true);
            addProducer(walletConnected, name, proofPhoto, geoLocation, areaProperty)
            .then(res => {
                setLogTransaction({
                    type: res.type,
                    message: res.message,
                    hash: res.hashTransaction
                })
                setLoadingTransaction(false);
                try{
                    setLoading(true);
                    api.post('/users', {
                        name,
                        wallet: String(walletConnected).toUpperCase(),
                        userType: 1,
                        geoLocation,
                        propertyGeolocation,
                        imgProfileUrl: proofPhoto,
                        address: JSON.stringify(address)
                    })
                }catch(err){
                    console.log(err);
                }finally{
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
                setLoadingTransaction(false);
                try{
                    setLoading(true);
                    api.post('/users', {
                        name,
                        wallet: String(walletConnected).toUpperCase(),
                        userType: 2,
                        password,
                        geoLocation: geoLocation,
                        imgProfileUrl: proofPhoto
                    })
                }catch(err){
                    console.log(err);
                }finally{
                    setLoading(false)
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
                setLoadingTransaction(false);
                try{
                    setLoading(true);
                    api.post('/users', {
                        name,
                        wallet: String(walletConnected).toUpperCase(),
                        userType: 6
                    })
                }catch(err){
                    console.log(err);
                }finally{
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
                setLoadingTransaction(false);
                try{
                    setLoading(true);
                    api.post('/users', {
                        name,
                        wallet: String(walletConnected).toUpperCase(),
                        userType: 7
                    })
                }catch(err){
                    console.log(err);
                }finally{
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
                setLoadingTransaction(false);
                try{
                    setLoading(true);
                    api.post('/users', {
                        name,
                        wallet: String(walletConnected).toUpperCase(),
                        userType: 4
                    })
                }catch(err){
                    console.log(err);
                }finally{
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
                setLoadingTransaction(false);
                try{
                    setLoading(true);
                    api.post('/users', {
                        name,
                        wallet: String(walletConnected).toUpperCase(),
                        userType: 3
                    })
                }catch(err){
                    console.log(err);
                }finally{
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
                setLoadingTransaction(false);
                try{
                    setLoading(true);
                    api.post('/users', {
                        name,
                        wallet: String(walletConnected).toUpperCase(),
                        userType: 5
                    })
                }catch(err){
                    console.log(err);
                }finally{
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

    return(
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] fixed inset-0'/>
            <Dialog.Content className='fixed flex flex-col items-center justify-between lg:w-[500px] h-[530px] p-3 bg-white rounded-md m-2 lg:m-auto inset-0'>
                <img
                    src={require('../../assets/logo-cinza.png')}
                    className='w-[120px] object-contain'
                />

                {step === 1 && (
                    <div className='w-full flex flex-col items-center'>
                        <h1 className='font-bold text-2xl text-[#0A4303]'>{t('Register')}</h1>
                        <p className='font-bold lg:text-md text-[#0A4303]'>{t('Do you want to register as one')}?</p>
                        
                        <select
                            defaultValue={type}
                            onChange={(e) => setType(e.target.value)}
                            className='mt-10 lg:w-[50%] h-10 bg-[#C66828] text-white font-bold'
                        >
                            <option selected value="">{t('Select user')}</option>
                            <option value="producer">{t('Producer')}</option>
                            <option value="activist">{t('Activist')}</option>
                            <option value="contributor">{t('Contributor')}</option>
                            <option value="investor">{t('Investor')}</option>
                            <option value="developer">{t('Developer')}</option>
                            <option value="researcher">{t('Researcher')}</option>
                            <option value="advisor">{t('Advisor')}</option>
                        </select>
                    </div>
                )}

                {step === 2 && (
                    <div className='w-full flex flex-col items-center'>
                        <h1 className='lg:text-lg text-center text-[#0A4303] mb-10'>{t('Now we need to take a picture. This photo will be used to prove your identity and necessary to the inspection proof photo')}.</h1>

                        {proofPhoto != '' && (
                            <img
                                src={`data:image/png;base64,${proofPhotoBase64}`}
                                className="w-[250px] h-[210px] object-cover mb-3"
                            />
                        )}
                        
                        <button
                            onClick={() => {
                                setCheckWebcam(true);
                                setTimeout(() => {
                                    setModalWebcam(true);
                                }, 1000)
                            }}

                            className='flex items-center justify-center gap-2 px-5 h-10 bg-[#2066CF] font-bold text-white rounded-md'
                        >
                            <FiCamera size={25} color='white'/>
                            {t('Take Photo')}
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className='w-full flex flex-col items-center'>
                        <h1 className='text-center lg:text-lg text-md text-[#0A4303]'>
                            {t('Now provide your details')}.
                            {type === 'producer' && ` ${t('Make sure that in address is correct, it can not be changed in the future')}.`}
                        </h1>

                        <div className='lg:w-[450px] mt-3 lg:mt-10'>
                            <div className='flex flex-col'>
                                <label className='font-bold text-[#0A4303]' >{t('Name')}</label>
                                <input
                                    placeholder='Type here'
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className='w-full h-10 border-2 border-[#A75722] rounded p-1'
                                />
                            </div>
                        {type === 'producer'&& (
                            <>

                                <div className='flex gap-3 mt-3'>
                                    <div className='flex flex-col'>
                                        <label htmlFor="cep" className='font-bold text-[#0A4303]'>{t('ZIP Code')}</label>
                                        <InputMask
                                            placeholder='Type here'
                                            type="text"
                                            name="cep"
                                            value={cep}
                                            onChange={(e) => setCep(e.target.value)}
                                            mask='99999-999'
                                            required
                                            className='w-32 h-10 border-2 border-[#A75722] rounded p-1'
                                        />
                                    </div>
                                
                                    <div className='flex flex-col justify-center'>
                                        <p className='text-sm lg:text-base font-bold text-[#0A4303]'>
                                            {state === '' ? '' : `${city}-${state}, ${country}.`}
                                        </p>
                                    </div>
                                </div>

                                
                                <div className='flex items-center gap-5 mt-3'>
                                    <div className='flex flex-col'>
                                        <label htmlFor="street" className='font-bold text-[#0A4303]'>{t('Street')}</label>
                                        <input
                                            placeholder='Type here'
                                            name="street"
                                            value={street}
                                            onChange={(e) => setStreet(e.target.value)}
                                            required
                                            className='w-full h-10 border-2 border-[#A75722] rounded p-1'
                                        />
                                    </div>

                                    <div className='flex flex-col'>
                                        <label htmlFor="complement" className='font-bold text-[#0A4303]'>{t('Complement')}</label>
                                        <input
                                            placeholder='Type here'
                                            name="complement"
                                            value={complement}
                                            onChange={(e) => setComplement(e.target.value)}
                                            required
                                            className='w-full h-10 border-2 border-[#A75722] rounded p-1'
                                        />
                                    </div>
                                </div>

                                <div className='flex gap-5 mt-3' >
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <select 
                                            value={documetType}
                                            onChange={(e) => setDocumentType(e.target.value)}
                                            className='w-full h-10 border-2 border-[#A75722] rounded p-1'
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
                                            className='w-full h-10 border-2 border-[#A75722] rounded p-1'
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {type === 'activist' && (
                            <>
                                <div style={{display: 'flex', flexDirection: 'row', gap: 10, marginTop: 15}}>
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <label htmlFor="password" style={{fontWeight: 'bold', color: 'green'}}>{t('Password')}</label>
                                        <input
                                            placeholder='Type here'
                                            name="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            style={{width: '180px', height: 22}}
                                            required
                                            type='password'
                                        />
                                    </div>

                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <label htmlFor="confirmPassword" style={{fontWeight: 'bold', color: 'green'}}>{t('Confirm Password')}</label>
                                        <input
                                            placeholder='Type here'
                                            name="confirmPassword"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            style={{width: '180px', height: 22}}
                                            required
                                            type='password'
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        </div>
                    </div>
                    
                )}

                {step === 4 && (
                    <div className='modal-register__container-content mb-1'>
                        <h1 className='font-bold lg:text-lg text-center'>{t('Mark the center of your property, then circle the entire area')}.</h1>
                        
                        <div className='flex w-full'>
                            <Map
                                setCenter={(position) => {setGeolocation(JSON.stringify(position))}}
                                editable={true}
                                setPolyline={(path) => {
                                    setPropertyGeolocation(path)
                                    calculateArea(JSON.parse(path))
                                }}
                            />
                        </div>
                    </div>
                )}

                <div className='flex w-full justify-center gap-2'>
                    <Dialog.Close
                        className='lg:w-[200px] h-10 border-[#C66828] border-2 rounded-md text-[#C66828] text-sm lg:text-base px-1'
                    >
                        {t('Continue Without Register')}
                    </Dialog.Close>
                    {step > 1 && (
                        <button 
                            className='lg:w-[120px] h-10 bg-[#C66828] rounded-md text-white text-sm lg:text-base px-1'
                            onClick={handlePreviousStep}
                        >
                            {t('Previous')}
                        </button>
                    )}
                    <button 
                        className='lg:w-[120px] h-10 bg-[#C66828] rounded-md text-white text-sm lg:text-base px-1'
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
                        chooseModalRegister();
                        navigate(0)
                    }
                }
            }}>
                <LoadingTransaction
                    loading={loadingTransaction}
                    logTransaction={logTransaction}
                />
            </Dialog.Root>
            {loading && <Loading/>}
            <ToastContainer
                position='top-center'
            />
        </Dialog.Portal>
    )
}