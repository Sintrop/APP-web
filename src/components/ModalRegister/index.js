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

export default function ModalRegister(){
    const navigate = useNavigate();
    const {walletConnected, chooseModalRegister} = useContext(MainContext);
    const {walletAddress, walletSelected} = useParams();
    const [loading, setLoading] = useState(false);
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});

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

    async function handleSearchAddress(){
        setLoading(true);
        try{
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json`);
            if(response.data.erro === true){
                toast.error('No address found with that zip code!');
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
            toast.error('Fill in the name field!');
            return;
        }

        if(type === 'producer'){
            if(documetType === ''){
                toast.error('Select document type!');
                return;
            }

            if(!documetNumber.trim()){
                toast.error('Fill in the document field!');
                return;
            }

            if(state === '' || !cep.trim()){
                toast.error('Enter a valid zip code!');
                return;
            }

            if(!street.trim()){
                toast.error('Fill in the street field!');
                return;
            }

            if(!complement.trim()){
                toast.error('Fill in the complement field!');
                return;
            }
        }

        if(type === 'activist'){
            if(state === '' || !cep.trim()){
                toast.error('Enter a valid zip code!');
                return;
            }

            if(!street.trim()){
                toast.error('Fill in the street field!');
                return;
            }

            if(!complement.trim()){
                toast.error('Fill in the complement field!');
                return;
            }
        }

        register();
    }

    async function register() {
        if(type === 'producer'){
            setModalTransaction(true);
            setLoadingTransaction(true);
            addProducer(walletConnected, name, documetNumber, documetType, country, state, city, cep, street, complement, proofPhoto)
            .then(res => {
                setLogTransaction({
                    type: res.type,
                    message: res.message,
                    hash: res.hashTransaction
                })
                setLoadingTransaction(false);
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
            addActivist(walletConnected, name, country, state, city, cep, proofPhoto)
            .then(res => {
                setLogTransaction({
                    type: res.type,
                    message: res.message,
                    hash: res.hashTransaction
                })
                setLoadingTransaction(false);
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

    return(
        <Dialog.Portal className='modal-register__portal'>
            <Dialog.Overlay className='modal-register__overlay'/>
            <Dialog.Content className='modal-register__content'>
                {step === 1 ? (
                    <Dialog.Title className='modal-register__title'>
                        Register
                    </Dialog.Title>
                ) : (
                    <div/>
                )}

                {step === 1 && (
                    <div className='modal-register__container-content'>
                        <h1 className='modal-register__title'>Do you want to register as one?</h1>
                        
                        <select
                            defaultValue={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option selected value="">Select the type of user you want to register</option>
                            <option value="producer">PRODUCER</option>
                            <option value="activist">ACTIVIST</option>
                            <option value="contributor">CONTRIBUTOR</option>
                            <option value="investor">INVESTOR</option>
                            <option value="developer">DEVELOPER</option>
                            <option value="researcher">RESEARCHER</option>
                            <option value="advisor">ADVISOR</option>
                        </select>
                    </div>
                )}

                {step === 2 && (
                    <div className='modal-register__container-content'>
                        <h1 className='modal-register__title'>Now we need a picture of you, would you?</h1>

                        {proofPhoto != '' && (
                            <img
                                src={`data:image/png;base64,${proofPhotoBase64}`}
                                className="register__proofPhoto"
                            />
                        )}
                        
                        <button
                            onClick={() => {
                                setCheckWebcam(true);
                                setTimeout(() => {
                                    setModalWebcam(true);
                                }, 1000)
                            }}
                        >
                            Take photo
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className='modal-register__container-content'>
                        <h1 className='modal-register__title'>We will need your details now.</h1>

                        <label style={{fontWeight: 'bold', color: 'green'}}>Your name</label>
                        <input
                            placeholder='Type here'
                            type="text"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={{ width: '300px', height: 25}}
                        />

                        {type === 'producer'&& (
                            <>
                                <div style={{display: 'flex', flexDirection: 'row', gap: 10, marginTop: 15}}>
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <label htmlFor="documetType" style={{fontWeight: 'bold', color: 'green'}}>Document Type</label>
                                        <select 
                                            value={documetType}
                                            onChange={(e) => setDocumentType(e.target.value)}
                                        >
                                            <option selected value="">Select Document Type</option>
                                            <option value="rg">RG</option>
                                            <option value="cpf">CPF</option>
                                            <option value="cnpj">CNPJ</option>
                                        </select>
                                    </div>
                                
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <label htmlFor="documetNumber" style={{fontWeight: 'bold', color: 'green'}}>Document Number</label>
                                        <InputMask
                                            type="text"
                                            mask={formatDocument.current}
                                            value={documetNumber}
                                            name="documetNumber"
                                            onChange={(e) => setDocumentNumber(e.target.value)}
                                            required
                                            style={{width: '180px', height: 22}}
                                        />
                                    </div>
                                </div>

                                <div style={{display: 'flex', flexDirection: 'row', gap: 10, marginTop: 15}}>
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <label htmlFor="cep" style={{fontWeight: 'bold', color: 'green'}}>CEP</label>
                                        <InputMask
                                            placeholder='Type here'
                                            type="text"
                                            name="cep"
                                            value={cep}
                                            onChange={(e) => setCep(e.target.value)}
                                            mask='99999-999'
                                            required
                                            style={{width: '180px', height: 22}}
                                        />
                                    </div>
                                
                                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                        <p style={{margin: 0, marginTop: 15, fontWeight: 'bold'}}>
                                            {state === '' ? '' : `${city}-${state}, ${country}.`}
                                        </p>
                                    </div>
                                </div>

                                <div style={{display: 'flex', flexDirection: 'row', gap: 10, marginTop: 15}}>
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <label htmlFor="street" style={{fontWeight: 'bold', color: 'green'}}>Street</label>
                                        <input
                                            placeholder='Type here'
                                            name="street"
                                            value={street}
                                            onChange={(e) => setStreet(e.target.value)}
                                            style={{width: '180px', height: 22}}
                                            required
                                        />
                                    </div>

                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <label htmlFor="complement" style={{fontWeight: 'bold', color: 'green'}}>Complement</label>
                                        <input
                                            placeholder='Type here'
                                            name="complement"
                                            value={complement}
                                            onChange={(e) => setComplement(e.target.value)}
                                            style={{width: '180px', height: 22}}
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {type === 'activist' && (
                            <>
                                <div style={{display: 'flex', flexDirection: 'row', gap: 10, marginTop: 15}}>
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <label htmlFor="cep" style={{fontWeight: 'bold', color: 'green'}}>CEP</label>
                                        <InputMask
                                            placeholder='Type here'
                                            type="text"
                                            name="cep"
                                            value={cep}
                                            onChange={(e) => setCep(e.target.value)}
                                            mask='99999-999'
                                            required
                                            style={{width: '180px', height: 22}}
                                        />
                                    </div>
                                
                                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                        <p style={{margin: 0, marginTop: 15, fontWeight: 'bold'}}>
                                            {state === '' ? '' : `${city}-${state}, ${country}.`}
                                        </p>
                                    </div>
                                </div>

                                <div style={{display: 'flex', flexDirection: 'row', gap: 10, marginTop: 15}}>
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <label htmlFor="street" style={{fontWeight: 'bold', color: 'green'}}>Street</label>
                                        <input
                                            placeholder='Type here'
                                            name="street"
                                            value={street}
                                            onChange={(e) => setStreet(e.target.value)}
                                            style={{width: '180px', height: 22}}
                                            required
                                        />
                                    </div>

                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <label htmlFor="complement" style={{fontWeight: 'bold', color: 'green'}}>Complement</label>
                                        <input
                                            placeholder='Type here'
                                            name="complement"
                                            value={complement}
                                            onChange={(e) => setComplement(e.target.value)}
                                            style={{width: '180px', height: 22}}
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        </div>
                    
                )}

                <div className='modal-register__area-btn'>
                    <Dialog.Close>
                        Continue without register
                    </Dialog.Close>
                    {step > 1 && (
                        <button 
                            onClick={handlePreviousStep}
                        >
                            Previous
                        </button>
                    )}
                    <button 
                        onClick={() => {
                            if(step === 3){
                                validateData();
                            }else{
                                handleNextStep();
                            }
                        }}
                    >
                        {step === 3 ? 'Register' : 'Next step'}
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
            <ToastContainer/>
        </Dialog.Portal>
    )
}