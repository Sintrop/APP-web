import React, { useState, useEffect, useRef } from "react";
import { ToastContainer } from "react-toastify";
import InputMask from 'react-input-mask';
import RegisterService from "../../../services/registerService";
import 'react-toastify/dist/ReactToastify.min.css';

import "./register.css";
function Register({ wallet }) {
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [documetType, setDocumentType] = useState("");
  const [documetNumber, setDocumentNumber] = useState("");
  const [cep, setCep] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  let formatDocument = useRef('')
  const registerService = new RegisterService(wallet);
  function handleClick(e) {
    e.preventDefault();
    switch (type) {
      case "producer":
        registerService.addProducer(
          name,
          documetNumber,
          documetType,
          country,
          state,
          city,
          cep
          ).then(res => console.log(res)).catch(err => console.log(err));
        break;
      case "activist":
        registerService.addActivist(
          name,
          documetNumber,
          documetType,
          country,
          state,
          city,
          cep
        ).then(res => console.log(res)).catch(err => console.log(err));
        break;
      case "contributor":
        registerService.addContributor(
          name,
          documetNumber,
          documetType,
          country,
          state,
          city,
          cep
        ).then(res => console.log(res)).catch(err => console.log(err));
        break;
      case "investor":
        registerService.addInvestor(
          name,
          documetNumber,
          documetType,
          country,
          state,
          city,
          cep
        ).then(res => console.log(res)).catch(err => console.log(err));
        break;
      case "developer":
        registerService.addDeveloper(
          name,
          documetNumber,
          documetType,
          country,
          state,
          city,
          cep
        ).then(res => console.log(res)).catch(err => console.log(err));
        break;
      case "researcher":
        registerService.addResearcher(
          name,
          documetNumber,
          documetType,
          country,
          state,
          city,
          cep
        ).then(res => console.log(res)).catch(err => console.log(err));
        break;
      case "advisor":
        registerService.addAdvisor(
          name,
          documetNumber,
          documetType,
          country,
          state,
          city,
          cep
        ).then(res => console.log(res)).catch(err => console.log(err));
        break;                                                  
      default:
        break;
    }
  }

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
  }, [documetType])

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
        </div>
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
        <button className="buttonRegister" type="submit" onClick={handleClick}>
          Register
        </button>
      </form>
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
    </div>
  );
}

export default Register;
