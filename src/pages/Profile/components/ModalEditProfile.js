import React, {useEffect, useState} from "react";
import { MdClose } from "react-icons/md";
import { useMainContext } from "../../../hooks/useMainContext";
import { CropImage } from "../../../components/CropImage";
import { ToastContainer, toast } from "react-toastify";
import { api } from "../../../services/api";
import { ActivityIndicator } from "../../../components/ActivityIndicator";

export function ModalEditProfile({close, imageProfile}){
    const {userData, getUserDataApi} = useMainContext();
    const [imageUpdateType, setImageUpdateType] = useState('');
    const [file, setFile] = useState(null);
    const [editImage, setEditImage] = useState(false);
    const [bio, setBio] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(userData?.bio){
            setBio(userData?.bio)
        }
    }, []);

    function openFolderSelect(typeUpload){
        setImageUpdateType(typeUpload);
        const inputFile = document.querySelector('#input-file');
        inputFile.click();
    }

    async function updateImage(uri, hash){
        setEditImage(false);
        if(imageUpdateType === 'banner'){
            try{
                await api.put('/user/profile', {
                    userId: userData?.id,
                    bannerUrl: uri,
                });
                getUserDataApi(userData?.wallet);
                toast.success('Foto de capa atualizada!');
            }catch(err){
                toast.error('Algo deu errado!')
            }
        }else{
            try {
                await api.put('/update-profile-photo', {
                    userId: userData?.id,
                    hashPhoto: hash,
                    userData: JSON.stringify(userData),
                });
                toast.success('Foto do perfil atualizada!');
                getUserDataApi(userData?.wallet);
            } catch (err) {
                toast.error('Algo deu errado, tente novamente!')
            }
        }
    }

    async function handleUpdateBio(){
        if(loading)return;

        try{
            setLoading(true);
            const response = await api.put('/user/profile', {
                userId: userData.id,
                bio: bio
            })
            getUserDataApi(userData?.wallet);
            toast.success('Sua bio foi atualizada!');
        }catch(err){
            toast.error('Algo deu errado!');
        }finally{
            setLoading(false);
        }
    }

    return(
        <div className='flex justify-center items-center inset-0'>
            <div className='bg-[rgba(0,0,0,0.6)] fixed inset-0' onClick={close} />
            <div className='absolute flex flex-col justify-between p-3 lg:w-[500px] lg:h-[520px] bg-[#0a4303] rounded-md mx-2 my-2 lg:my-auto lg:mx-auto inset-0 border-2'>
                <div className="flex flex-col">
                    <div className="flex justify-between items-center">
                        <div className="w-[25px]"/>
                        <p className="font-semibold text-white">Editar perfil</p>
                        <button onClick={close}>
                            <MdClose size={25} color='white'/>
                        </button>
                    </div>

                    <div className="flex flex-col items-center mt-5">
                        <div 
                            className="w-[100px] h-[100px] rounded-full bg-gray-300 hover:cursor-pointer"
                            onClick={() => openFolderSelect('profile')}
                        >
                            {imageProfile ? (
                                <img
                                    src={imageProfile}
                                    className="w-[100px] h-[100px] rounded-full object-cover"
                                />
                            ) : (
                                <img
                                    src={require('../../../assets/icon-validator.png')}
                                    className="w-[100px] h-[100px] rounded-full object-cover"
                                />
                            )}
                        </div>
                        <p className="font-bold text-blue-500">Foto do perfil</p>
                        <p className="text-xs text-gray-400">Clique na imagem para alterar</p>

                        <div 
                            className="w-[180px] h-[100px] rounded-full bg-florest mt-8 hover:cursor-pointer"
                            onClick={() => openFolderSelect('banner')}
                        >
                            {userData?.bannerUrl && (
                                <img
                                    src={userData?.bannerUrl}
                                    className="w-[180px] h-[100px] rounded-md object-cover"
                                />
                            )}
                        </div>
                        <p className="font-bold text-blue-500">Foto de capa</p>
                        <p className="text-xs text-gray-400">Clique na imagem para alterar</p>
                    </div>

                    <div className="flex flex-col mt-5">
                        <label className="font-bold text-blue-500">Bio</label>
                        <input
                            type="text"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full px-3 h-10 bg-green-950 rounded-md text-white"
                            placeholder="Digite aqui"
                        />

                        {bio !== userData?.bio && (
                            <button
                                className="w-ful h-10 rounded-md flex items-center justify-center bg-blue-500 text-white font-bold mt-3"
                                onClick={handleUpdateBio}
                            >
                                {loading ? (
                                    <ActivityIndicator size={25}/>
                                ) : 'Salvar alterações'}
                            </button>
                        )}
                    </div>
                </div>

                <input 
                    type='file'
                    className="hidden"
                    onChange={(e) => {
                        setFile(e.target.files[0])
                        setEditImage(true)
                    }}
                    id='input-file'
                />
            </div>

            {editImage && (
                <CropImage
                    close={() => setEditImage(false)}
                    file={file}
                    returnType={imageUpdateType === 'banner' ? 'url' : 'hash'}
                    returnUri={(uri, hash) => {
                        updateImage(uri, hash)
                    }}
                />
            )}

            <ToastContainer/>
        </div>
    )
}