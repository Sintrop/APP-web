import React, { useState, useEffect } from "react";
import { addProducer, addActivist,loadActivist } from "../../services/web3Service";
import "./register.css";
function Register() {
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [documetType, setDocumentType] = useState("");
  const [documetNumber, setDocumentNumber] = useState("");
  const [cep, setCep] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");


  useEffect(()=>{
    //loadActivist();
  },[])


  async function handleClick(e) {
    e.preventDefault();

    switch (type) {
      case "producer":
        await addProducer(
          name,
          documetNumber,
          documetType,
          cep,
          state,
          city,
          country
        );
        break;
      case "activist":
        await addActivist(
          name,
          documetNumber,
          documetType,
          cep,
          state,
          city,
          country
        );
        break;
      default:
        break;
    }
  }

  return (
    <div className="container">
      <form>
        <label>Select the type of user you want to registe.</label>
        <select defaultValue={type} onChange={(e) => setType(e.target.value)}>
          <option selected value=""></option>
          <option value="producer">PRODUCER</option>
          <option value="activist">ACTIVIST</option>
        </select>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label>Document Type</label>
        <input
          type="text"
          name="documetType"
          value={documetType}
          onChange={(e) => setDocumentType(e.target.value)}
          required
        />
        <label>Document Number</label>
        <input
          type="number"
          value={documetNumber}
          name="documetNumber"
          onChange={(e) => setDocumentNumber(e.target.value)}
          required
        />
        <label>CEP</label>
        <input
          name="cep"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          required
        />
        <label>State</label>
        <input
          name="state"
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
        />
        <label>City</label>
        <input
          name="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <label>Country</label>
        <input
          name="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />

        <button type="submit" onClick={handleClick}>
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
