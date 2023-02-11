import React, {useState, useEffect, useRef} from 'react';
import { useParams } from 'react-router';
import './modalRegister.css';
import * as Dialog from '@radix-ui/react-dialog';
import { LoadingTransaction } from '../LoadingTransaction';
import { WebcamComponent } from '../Webcam';
import InputMask from 'react-input-mask';
import axios from 'axios';
import { save, get } from '../../config/infura';
import { ToastContainer, toast } from "react-toastify";

export default function ModalRegister(){
    const {walletAddress, walletSelected} = useParams();
    const [loading, setLoading] = useState(false);
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
            setState(response.data.uf);
            setCity(response.data.localidade);
            setStreet(response.data.logradouro);
            setCountry('Brasil')
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
        
    }

    function handleNextStep(){
        if(step === 1 && type === ''){
            toast.error('Select a user type!')
            return;
        }
        if(step === 2 && type !== 'investor'){
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
                        onClick={handleNextStep}
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
            <ToastContainer/>
        </Dialog.Portal>
    )
}