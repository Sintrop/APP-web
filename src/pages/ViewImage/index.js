import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router';
import axios from 'axios';

export function ViewImage(){
    const {hashPhoto} = useParams();
    const [base64, setBase64] = useState();

    useEffect(() => {
        getImage();
    },[]);

    async function getImage(){
        const response = await axios.get(`https://ipfs.io/ipfs/${hashPhoto}`);
        setBase64(response.data);
    }
    return(
        <div className="w-full h-full flex items-center justify-between">
            {base64 !== '' ? (
                <img
                    src={base64}
                    className='h-screen object-contain'
                />
            ) : (
                <p>Carregando imagem...</p>
            )}
        </div>
    )
}