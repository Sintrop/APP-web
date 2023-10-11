import React, {useEffect, useState, useRef} from 'react';
import { useTranslation } from 'react-i18next';
import Webcam from 'react-webcam';
import { FiCamera } from 'react-icons/fi';
import {save, get} from '../../config/infura';
import InputMask from 'react-input-mask';
import { Help } from '../../components/help';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Loading from '../../components/Loading';
import Map from '../../components/Map';
import { WebcamComponent } from '../../components/Webcam';
import { api } from '../../services/api';
import { useParams } from 'react-router';
import { ModalSuccess } from './ModalSuccess';
import { ModalPermissions } from './ModalPermissions';

const videoConstraints = {
    width: 800,
    height: 600,
    facingMode: "user"
};

export function Register(){
    const {walletAddress} = useParams();
    const {t} = useTranslation();
    const [type, setType] = useState('producer');
    const [modalWebcam, setModalWebcam] = useState(false);
    const [imageSrc, setImageSrc] = useState('');
    const [loading, setLoading] = useState(false);
    const [proofPhoto, setProofPhoto] = useState('');
    const [proofPhotoBase64, setProofPhotoBase64] = useState('');

    const [name, setName] = useState("");
    const [documetType, setDocumentType] = useState("");
    const [documetNumber, setDocumentNumber] = useState("");
    const [cep, setCep] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [street, setStreet] = useState("");
    const [complement, setComplement] = useState("");
    const [country, setCountry] = useState("");
    const [geoLocation, setGeolocation] = useState('');
    const [propertyGeolocation, setPropertyGeolocation] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [areaProperty, setAreaProperty] = useState(0);
    const [userExists, setUserExists] = useState(false);
    const [modalSuccess, setModalSuccess] = useState(false);
    const [modalPermissions, setModalPermissions] = useState(true);
    let formatDocument = useRef('');

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
        //getLocale();
        getUser();
    },[])

    async function handleProofPhoto(data){
        setModalWebcam(false);
        setLoading(true);
        let res = await fetch(data);
        let myBlob = await res.blob();
    
        const hashPhoto = await save(myBlob);
        setProofPhoto(hashPhoto);

        const base64Hash = await get(hashPhoto);
        setProofPhotoBase64(base64Hash);
        setLoading(false);
    } 

    async function handleSearchAddress(){
        try{
            setLoading(true);
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

    async function calculateArea(coords){
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
        if(Math.abs(areaM2) < 5000){
            toast.error(t('Your property must be at least 5.000m²'))
        }
    }

    function getLocale(){
        navigator.geolocation.getCurrentPosition(res => {
            const data = {
                lat: Number(res.coords.latitude),
                lng: Number(res.coords.longitude)
            }
            setGeolocation(data)
            
        })
    }

    function validateData(){
        if(type === ''){
            return;
        }
        if(type !== 'investor' && proofPhoto === ''){
            toast.error(`${t('É necessário tirar a foto de prova')}`)
            return;
        }
        if(!name.trim()){
            toast.error(`${t('Digite seu nome completo')}`)
            return;
        }
        if(type === 'producer'){
            if(city === ''){
                toast.error(`${t('Informe o CEP da sua localidade')}`)
                return;
            }
            if(!street.trim()){
                toast.error(`${t('Informe o nome da rua da sua propriedade')}`)
                return;
            }
            if(!complement.trim()){
                toast.error(`${t('Informe um complemento')}`)
                return;
            }
            if(documetType === ''){
                toast.error(`${t('Selecione o tipo de documento')}`)
                return;
            }
            if(documetNumber === ''){
                toast.error(`${t('Digite o número de seu documento')}`)
                return;
            }
            if(areaProperty < 5000){
                toast.error(`${t('A área da sua propriedade é menor que 5.000 m²')}`)
                return;
            }
            if(geoLocation === ''){
                toast.error(`${t('Não conseguimos obter sua localização. Permita a localização em seu navegador')}`)
                return;
            }
            if(propertyGeolocation === ''){
                toast.error(`${t('Você não delimitou a área de sua propriedade')}`)
                return;
            }
        }
        if(type === 'inspector'){
            if(!password.trim()){
                return;
            }
            if(!confirmPassword.trim()){
                return;
            }
            if(password !== confirmPassword){
                return;
            }
        }
        registerApi()
    }

    async function getUser(){
        try{
            setLoading(true);
            const response = await api.get(`/user/${walletAddress}`);
            if(response.data.user){
                setUserExists(true);
            }
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    async function registerApi(){
        let address = {
            zipCode: cep,
            state,
            city,
            complement,
            street,
            country,
            areaProperty
        }

        try{
            setLoading(true);
            await api.post('/users', {
                name,
                wallet: String(walletAddress).toUpperCase(),
                userType: 1,
                geoLocation,
                propertyGeolocation,
                imgProfileUrl: proofPhoto,
                address: JSON.stringify(address),
                level: 1
            });
            setModalSuccess(true);
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    return(
        <div className='flex flex-col h-screen bg-green-950'>
            <header className='flex items-center justify-center w-full p-3 bg-[#0a4303]'>
                <img
                    src={require('../../assets/logo-branco.png')}
                    className='w-[120px] object-contain'
                />
            </header>

            <div className='flex flex-col items-center overflow-auto'>
            {userExists ? (
                <>
                <p className='font-bold text-sm lg:text-md text-white'>{t('Wallet')}: {walletAddress}</p>        
                <p className='font-bold text-white text-center'>{t('Essa carteira já está cadastrada em nosso sistema')}</p>
                </>
            ) : (
                <div className='flex flex-col p-4 lg:w-[500px]'>
                    <p className='font-bold text-sm lg:text-md text-white'>{t('Wallet')}: {walletAddress}</p>         
                    {/* <select
                        defaultValue={type}
                        onChange={(e) => {
                            setType(e.target.value)
                        }}
                        className='mt-2 w-full h-8 lg:h-10 bg-[#C66828] text-white font-bold'
                    >
                        <option selected value="">{t('Select user')}</option>
                        <option value="producer">{t('Producer')}</option>
                        <option value="inspector">{t('Inspector')}</option>
                        <option value="contributor">{t('Validator')}</option>
                        <option value="investor">{t('Investor')}</option>
                        <option value="developer">{t('Developer')}</option>
                        <option value="researcher">{t('Researcher')}</option>
                    </select> */}
                    
                    {/* Componente de câmera */}
                    {/* <div className='w-full flex flex-col items-center overflow-auto py-2'>
                        {modalWebcam ? (
                            // <input
                            //     type='file'
                            //     capture='user'
                            // />
                            <Webcam
                                className="w-full h-[200px] z-50"
                                audio={false}
                                screenshotFormat="image/png"
                                videoConstraints={videoConstraints}
                            >
                                {({ getScreenshot }) => (
                                <>
                                    {imageSrc === '' && (
                                        <div className="flex flex-col items-center w-full">
                                        <button  
                                            style={{marginTop: 15}}
                                            onClick={() => {
                                                const data = getScreenshot();
                                                setImageSrc(data);
                                                setModalWebcam(false);
                                            }}
                                            className='px-5 h-10 bg-[#C66828] font-bold text-white rounded-md'
                                        >
                                            {t('Capture photo')}
                                        </button>
                                        </div>
                                    )}
                                </>
                                )}
                            </Webcam>
                        ) : (
                            <>
                            {imageSrc !== '' ? (
                                <div className="flex flex-col items-center w-full gap-2">
                                    <img 
                                        src={imageSrc} 
                                        alt="Captured photo"
                                        className="lg:w-[250px] h-[200px] object-contain lg:object-cover"
                                    />
                                    <div className="w-full flex justify-center gap-3">
                                        <button
                                            onClick={() => {
                                                setImageSrc('')
                                                setModalWebcam(true)
                                            }}
                                            className='px-5 h-10 bg-[#C66828] font-bold text-white rounded-md'
                                        >{t('Take another')}</button>
                            
                                        <button
                                            onClick={() => {
                                                handleProofPhoto(imageSrc)
                                            }}
                                            className='px-5 h-10 bg-[#C66828] font-bold text-white rounded-md'
                                        >{t('Confirm')}</button>
                                    </div>
                                </div>
                            ) : (
                                <>
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
                                            setTimeout(() => {
                                                setModalWebcam(true);
                                            }, 1000)
                                        }}

                                        className='flex items-center justify-center gap-2 px-5 h-8 lg:h-10 bg-[#2066CF] font-bold text-white rounded-md'
                                    >
                                        <FiCamera size={25} color='white'/>
                                        {t('Take Photo')}
                                    </button>
                                </>
                            )}
                            </>
                        )}
                    </div> */}

                    
                    {type !== 'investor' && (
                        <div className="flex flex-col mt-5">
                            <p className="font-bold text-white">{t('Proof photo')}</p>
                            {imageSrc === '' ? (
                                <>
                                <p className='text-white text-justify'>{t('Precisamos de uma foto de prova sua para continuarmos o cadastro. (Qualquer usuário sem foto de prova sera bloqueado no sistema)')}</p>
                                </>
                            ) : (
                                <div className="flex flex-col w-full items-center">
                                    <img
                                        src={imageSrc}
                                        className="w-[300px] object-contain"
                                    />
                                </div>
                            )}

                            <button 
                                onClick={() => setModalWebcam(true)}
                                className='px-3 py-2 bg-[#FF9900] rounded-md font-bold text-white mt-3'
                            >
                                {t('Take Photo')}
                            </button>
                        </div>
                    )}
                    
                    {/* Formulário de dados */}
                    <p className="font-bold text-white mt-5">{t('Data')}</p>
                    <div className='w-full flex flex-col items-center'>
                            {/* <h1 className='text-center lg:text-lg text-md text-white'>
                                {t('Now provide your details')}.
                                {type === 'producer' && ` ${t('Make sure that in address is correct, it can not be changed in the future')}.`}
                            </h1> */}

                            <div className='w-full'>
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

                                    
                                    <div className='flex items-center w-full gap-5 mt-3'>
                                        <div className='flex flex-col w-[50%]'>
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

                                        <div className='flex flex-col w-[50%]'>
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
                                        <div className='flex flex-col w-[50%]'>
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
                                    
                                        <div className='flex flex-col w-[50%]'>
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

                            {type === 'inspector' && (
                                <>
                                    <div className='flex flex-col lg:flex-row gap-3 mt-5 '>
                                        <div className='flex flex-col w-[50%]'>
                                            <label htmlFor="password" style={{fontWeight: 'bold', color: 'white'}}>{t('Password')}</label>
                                            <input
                                                placeholder='Type here'
                                                name="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className='w-full h-9 rounded-sm border-2 border-[#A75722] px-1'
                                                required
                                                type='password'
                                            />
                                        </div>

                                        <div className='flex flex-col w-[50%]'>
                                            <label htmlFor="confirmPassword" style={{fontWeight: 'bold', color: 'white'}}>{t('Confirm Password')}</label>
                                            <input
                                                placeholder='Type here'
                                                name="confirmPassword"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className='w-full h-9 rounded-sm border-2 border-[#A75722] px-1'
                                                required
                                                type='password'
                                            />
                                        </div>
                                    </div>

                                    <Help
                                        description="This password will be used to enter the inspector Mobile App"
                                    />
                                </>
                            )}
                            </div>
                    </div>

                    {/* mapa para produtores */}
                    {type === 'producer' && (
                        <div className='flex w-full mt-5'>
                            <Map
                                setCenter={(position) => {setGeolocation(JSON.stringify(position))}}
                                editable={true}
                                setPolyline={(path) => {
                                    setPropertyGeolocation(path);
                                    calculateArea(JSON.parse(path));
                                }}
                            />
                        </div>
                    )}

                    <button className="w-full rounded-xl h-12 font-bold text-white bg-blue-500 mt-10" onClick={validateData}>
                        {t('Save data')}
                    </button>
                </div>
            )}
            </div>

            <ToastContainer
                position='top-center'
            />

            {loading && (
                <Loading/>
            )}

            {modalSuccess && (
                <ModalSuccess/>
            )}

            {modalPermissions && (
                <ModalPermissions
                    close={(data) => {
                        setModalPermissions(false);
                        setGeolocation(data)
                    }}
                />
            )}

            {modalWebcam && (
                <WebcamComponent
                    close={() => setModalWebcam(false)}
                    onTake={(uri) => {
                        handleProofPhoto(uri);
                        setImageSrc(uri);
                    }}
                />
            )}
        </div>
    );
}