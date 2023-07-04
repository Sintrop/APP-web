import React, {useEffect, useState} from 'react';
import axios from 'axios';

export function PhotoBiodiversityItem({data, click}){
    const [loading, setLoading] = useState(true);
    const [image64, setImage64] = useState('');
    
    useEffect(() => {
        getImage()
    },[]);

    async function getImage(){
        try{
            const response = await axios.get(`https://ipfs.io/ipfs/${data.photo}`);
            setImage64(response.data);
        }catch{

        }finally{
            setLoading(false);
        }
    }

    return(            
        <img
            src={image64}
            className='w-[150px] h-[170px] object-cover rounded-md cursor-pointer'
            onClick={() => click(data.photo)}
        />
    )
}