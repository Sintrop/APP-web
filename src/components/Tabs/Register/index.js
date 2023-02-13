import React, { useState, useEffect, useRef, useContext } from "react";
import { ToastContainer } from "react-toastify";
import InputMask from 'react-input-mask';
import {addContributor, addActivist, addProducer, addInvestor, addDeveloper, addAdvisor, addResearcher} from "../../../services/registerService";
import 'react-toastify/dist/ReactToastify.min.css';
import {WebcamComponent} from '../../Webcam';
import * as Dialog from '@radix-ui/react-dialog';
import {save, get} from '../../../config/infura';
import { LoadingTransaction } from "../../LoadingTransaction";
import {useParams, useNavigate} from 'react-router-dom';
import { MainContext } from "../../../contexts/main";

import "./register.css";
function Register({ wallet, setTab }) {
    const {walletConnected} = useContext(MainContext);
    const {tabActive} = useParams()
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [modalTransaction, setModalTransaction] = useState(false);
    const [logTransaction, setLogTransaction] = useState({});

    const [type, setType] = useState("");
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
    const [openWebcam, setOpenWebcam] = useState(false);
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
      
    function handleContinue(){
        setTab('isa', '')
        navigate(`/dashboard/${walletConnected}/isa/main`)
    }

    useEffect(() => {
        setTab(tabActive, '');
    }, [tabActive]);

    async function handleClick(e) {
        e.preventDefault();
        // if(proofPhoto === '' && type !== 'investor'){
        //     return;
        // }
        if(type === 'producer'){
            setModalTransaction(true);
            setLoading(true);
            addProducer(wallet, name, documetNumber, documetType, country, state, city, cep, street, complement, proofPhoto)
            .then(res => {
                setLogTransaction({
                    type: res.type,
                    message: res.message,
                    hash: res.hashTransaction
                })
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
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
            setLoading(true);
            addActivist(wallet, name, country, state, city, cep, proofPhoto)
            .then(res => {
                setLogTransaction({
                    type: res.type,
                    message: res.message,
                    hash: res.hashTransaction
                })
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
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
            setLoading(true);
            addContributor(wallet, name, proofPhoto)
            .then(res => {
                setLogTransaction({
                    type: res.type,
                    message: res.message,
                    hash: res.hashTransaction
                })
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
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
            setLoading(true);
            addInvestor(wallet, name)
            .then(res => {
                setLogTransaction({
                    type: res.type,
                    message: res.message,
                    hash: res.hashTransaction
                })
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
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
            setLoading(true);
            addDeveloper(wallet, name, proofPhoto)
            .then(res => {
                setLogTransaction({
                    type: res.type,
                    message: res.message,
                    hash: res.hashTransaction
                })
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
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
            setLoading(true);
            addResearcher(wallet, name, proofPhoto)
            .then(res => {
                setLogTransaction({
                    type: res.type,
                    message: res.message,
                    hash: res.hashTransaction
                })
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
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
            setLoading(true);
            addAdvisor(wallet, name, proofPhoto)
            .then(res => {
                setLogTransaction({
                    type: res.type,
                    message: res.message,
                    hash: res.hashTransaction
                })
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
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

  return (
        <div className="container">
        <form>
            <div className="inputGroup">
                <div className="inputControl">
                    <label>Select the type of user you want to register.</label>
                    <select
                    defaultValue={type}
                    onChange={(e) => setType(e.target.value)}
                    >
                    <option selected value=""></option>
                    <option value="producer">PRODUCER</option>
                    <option value="activist">ACTIVIST</option>
                    <option value="contributor">CONTRIBUTOR</option>
                    <option value="investor">INVESTOR</option>
                    <option value="developer">DEVELOPER</option>
                    <option value="researcher">RESEARCHER</option>
                    <option value="advisor">ADVISOR</option>
                    </select>
                </div>
            </div>

            {proofPhoto != '' && (
                <img
                    src={`data:image/png;base64,${proofPhotoBase64}`}
                    className="register__proofPhoto"
                />
            )}
            
            {type !== 'investor' && (
                <button
                    className='register__btn-takePhoto'
                    onClick={() => setOpenWebcam(true)} 
                    type="button"
                >
                    Take Photo
                </button>
            )}
      
            <div className="inputGroup">
            <div className="inputControl">
                <label>Name</label>
                <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: '445px'}}
                />
            </div>
            </div>
            <div className="inputGroup">
                {type === 'producer'&& (
                    <>
                        <div className="inputControl">
                            <label htmlFor="documetType">Document Type</label>
                            <select 
                            value={documetType}
                            onChange={(e) => setDocumentType(e.target.value)}
                            >
                            <option selected value=""></option>
                            <option value="rg">RG</option>
                            <option value="cpf">CPF</option>
                            <option value="cnpj">CNPJ</option>
                            </select>
                        </div>

                        <div className="inputControl">
                            <label htmlFor="documetNumber">Document Number</label>
                            <InputMask
                            type="text"
                            mask={formatDocument.current}
                            value={documetNumber}
                            name="documetNumber"
                            onChange={(e) => setDocumentNumber(e.target.value)}
                            required
                            />
                        </div>
                    </>
                )}
            </div>

            {type === 'producer' && (
                <>
                    <div className="inputGroup">
                        <div className="inputControl">
                            <label htmlFor="cep">CEP</label>
                            <InputMask
                            type="text"
                            name="cep"
                            value={cep}
                            onChange={(e) => setCep(e.target.value)}
                            mask='99999-999'
                            required
                            />
                        </div>
                    </div>
                    <div className="inputGroup">
                        <div className="inputControl">
                            <label htmlFor="state">State</label>
                            <input
                            name="state"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            required
                            />
                        </div>
                        <div className="inputControl">
                            <label htmlFor="city">City</label>
                            <input
                            name="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                            />
                        </div>
                        <div className="inputControl">
                            <label>Country</label>
                            <input
                            name="country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            required
                            />
                        </div>
                    </div>
                </>
            )}

            {type === 'activist' && (
                <>
                    <div className="inputGroup">
                        <div className="inputControl">
                            <label htmlFor="cep">CEP</label>
                            <InputMask
                            type="text"
                            name="cep"
                            value={cep}
                            onChange={(e) => setCep(e.target.value)}
                            mask='99999-999'
                            required
                            />
                        </div>
                    </div>
                    <div className="inputGroup">
                        <div className="inputControl">
                            <label htmlFor="state">State</label>
                            <input
                            name="state"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            required
                            />
                        </div>
                        <div className="inputControl">
                            <label htmlFor="city">City</label>
                            <input
                            name="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                            />
                        </div>
                        <div className="inputControl">
                            <label>Country</label>
                            <input
                            name="country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            required
                            />
                        </div>
                    </div>
                </>
            )}
            <div className="inputGroup">
            {type === 'producer' && (
                <>
                    <div className="inputControl">
                        <label htmlFor="street">Street</label>
                        <input
                            name="street"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            required
                        />
                    </div>

                    <div className="inputControl">
                        <label htmlFor="complement">Complement</label>
                        <input
                            name="complement"
                            value={complement}
                            onChange={(e) => setComplement(e.target.value)}
                            required
                        />
                    </div>
                </>
            )}

            </div>
            <button className="buttonRegister" type="submit" onClick={handleClick}>
                Register
            </button>
        </form>
            <button className="buttonRegister" onClick={handleContinue}>
                Continue without registration
            </button>
        <Dialog.Root open={openWebcam} onOpenChange={(open) => setOpenWebcam(open)}>
            <WebcamComponent
                onTake={(data) => {
                    handleProofPhoto(data);
                    setOpenWebcam(false)
                }}
            />
        </Dialog.Root>
        <ToastContainer
            position="top-left"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />

        <Dialog.Root open={modalTransaction} onOpenChange={(open) => {if(!loading)setModalTransaction(open)}}>
            <LoadingTransaction
                loading={loading}
                logTransaction={logTransaction}
            />
        </Dialog.Root>
        
        </div>
    );
}

export default Register;
