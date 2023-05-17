import React, {useEffect, useState} from "react";
import { api } from "../../services/api";

export function IndiceItem({data, attIndices}){
    const [loading, setLoading] = useState(false);
    const [edit, setEdit] = useState(false);
    const [carbon, setCarbon] = useState('');
    const [bio, setBio] = useState('');
    const [agua, setAgua] = useState('');
    const [solo, setSolo] = useState('');

    useEffect(() => {
        setCarbon(data.carbonValue);
        setAgua(data.aguaValue);
        setBio(data.bioValue);
        setSolo(data.soloValue);
    },[]);

    async function handleSave(){
        if(!carbon.trim() || !agua.trim() || !bio.trim() || !solo.trim()){
            alert('Preencha todos os campos')
            return;
        }

        try{
            await api.put('/update-category', {
                id: data.id,
                carbon,
                bio,
                agua,
                solo
            })
            setEdit(false);
            attIndices();
        }catch(err){
            alert('Algo deu errado, tente novamente!')
            setEdit(false);
        }
    }
    
    return(
        <div className="flex flex-col border-2 rounded-md">
            <div className="flex h-14">
                <div className='w-12 border-r-2 h-full flex items-center justify-center'>
                    {data.id}
                </div>
                <div className='w-[250px] border-r-2 h-full flex items-center justify-center'>
                    <p className=''>{data.title}</p>
                </div>

                <div className='w-[150px] border-r-2 h-full flex items-center justify-center'>
                    {edit ? (
                        <input
                            value={carbon}
                            className="w-[130px] h-10 border-2 border-[#ff9900] rounded-md text-center text-black"
                            onChange={(e) => setCarbon(e.target.value)}
                            placeholder="Type value"
                        />
                    ) : (
                        <p className='font-bold text-green-800'>{data.carbonValue}</p>
                    )}
                </div>

                <div className='w-[150px] border-r-2 h-full flex items-center justify-center'>
                    {edit ? (
                        <input
                            value={agua}
                            className="w-[130px] h-10 border-2 border-[#ff9900] rounded-md text-center text-black"
                            onChange={(e) => setAgua(e.target.value)}
                            placeholder="Type value"
                        />
                    ) : (
                        <p className='font-bold text-green-800'>{data.aguaValue}</p>
                    )}
                </div>

                <div className='w-[150px] border-r-2 h-full flex items-center justify-center'>
                    {edit ? (
                        <input
                            value={solo}
                            className="w-[130px] h-10 border-2 border-[#ff9900] rounded-md text-center text-black"
                            onChange={(e) => setSolo(e.target.value)}
                            placeholder="Type value"
                        />
                    ) : (
                        <p className='font-bold text-green-800'>{data.soloValue}</p>
                    )}
                </div>

                <div className='w-[150px] border-r-2 h-full flex items-center justify-center'>
                    {edit ? (
                        <input
                            value={bio}
                            className="w-[130px] h-10 border-2 border-[#ff9900] rounded-md text-center text-black"
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Type value"
                        />
                    ) : (
                        <p className='font-bold text-green-800'>{data.bioValue}</p>
                    )}
                </div>

                <div className='w-[80px] border-r-2 h-full flex items-center justify-center'>
                    {edit ? (
                        <button
                            className="px-2 py-1 bg-[#0a4303] rounded-md font-bold text-white"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    ):(
                        <button
                            className="px-2 py-1 bg-[#ff9900] rounded-md font-bold text-white"
                            onClick={() => setEdit(true)}
                        >
                            Edit
                        </button>

                    )}
                </div>
            </div>
        </div>
    )
}