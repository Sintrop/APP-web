import React, {useEffect, useState} from "react";
import { Header } from "../../components/Header";
import { ActivityIndicator } from "../../components/ActivityIndicator";
import { useMainContext } from "../../hooks/useMainContext";
import { FaUser, FaListAlt, FaList, FaChevronRight, FaQrcode } from "react-icons/fa";
import { getImage } from "../../services/getImage";

export function Profile(){
    const {userData, walletConnected, blockchainData} = useMainContext();
    const [imageProfile, setImageProfile] = useState(null);
    const [tabSelected, setTabSelected] = useState('certificates');
    const [loading, setLoading] = useState(false);
    const [proofPhoto, setProofPhoto] = useState('');
    const [pathProperty, setPathProperty] = useState([]);

    useEffect(() => {
        if(userData){
            getImageProfile(userData?.imgProfileUrl);
        }
    }, [userData]);

    useEffect(() => {
        if(blockchainData){
            getProofPhoto(blockchainData?.proofPhoto);
        }
    }, [blockchainData]);

    
    function fixCoordinatesProperty(coords) {
        let array = [];
        for (var i = 0; i < coords.length; i++) {
            array.push(coords[i]);
        }
        array.push(coords[0]);
        setPathProperty(array);
    }

    async function getProofPhoto(hash) {
        const response = await getImage(hash);
        setProofPhoto(response);
    }

    async function getImageProfile(hash) {
        const response = await getImage(hash);
        setImageProfile(response);
    }

    return (
        <div className={`bg-[#062c01] flex flex-col h-[100vh]`}>
            <Header />

            <div className="flex flex-col items-center w-full mt-20 overflow-auto">
                <div className="flex flex-col w-[1024px] mt-3">
                    {loading ? (
                        <div className="flex justify-center h-[90vh]">
                            <ActivityIndicator size={180} />
                        </div>
                    ) : (
                        <>
                            {userData ? (
                                <>
                                    <p className="font-bold text-white">Seu perfil</p>
                                    <div className="w-full flex flex-col bg-[#0a4303] p-3 rounded">
                                        <div className="flex flex-col bg-green-950 p-3 rounded">
                                            <div className="flex items-center gap-5">
                                                <div className="w-20 h-20 rounded-full bg-gray-400">
                                                    {imageProfile && (
                                                        <img
                                                            src={imageProfile}
                                                            className="w-20 h-20 rounded-full object-cover"
                                                        />
                                                    )}
                                                </div>

                                                <div className="flex flex-col items-center ml-10">
                                                    <p className="font-bold text-white">0</p>
                                                    <p className=" text-white">Seguidores</p>
                                                </div>

                                                <div className="flex flex-col items-center">
                                                    <p className="font-bold text-white">0</p>
                                                    <p className=" text-white">Seguindo</p>
                                                </div>
                                            </div>

                                            <p className="font-bold text-white mt-3">{userData?.name}</p>
                                            <p className="text-gray-300">
                                                {userData?.userType === 1 && 'Produtor(a)'}
                                                {userData?.userType === 2 && 'Inspetor(a)'}
                                                {userData?.userType === 3 && 'Pesquisador(a)'}
                                                {userData?.userType === 4 && 'Desenvolvedor(a)'}
                                                {userData?.userType === 5 && 'Contribuidor(a)'}
                                                {userData?.userType === 6 && 'Ativista'}
                                                {userData?.userType === 7 && 'Apoiador(a)'}
                                                {userData?.userType === 8 && 'Validador(a)'}
                                            </p>
                                            <div className="p-1 bg-[#0a4303] border-2 border-green-500 rounded-md w-fit mt-1">
                                                <p className="text-white">Wallet: {walletConnected}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 mt-2">
                                        <button
                                            className={`font-bold py-1 border-b-2 flex items-center gap-1 ${tabSelected === 'certificates' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                                            onClick={() => setTabSelected('certificates')}
                                        >
                                            <FaQrcode size={18} color={tabSelected === 'certificates' ? 'green' : 'white'} />
                                            Certificados
                                        </button>

                                        <button
                                            className={`font-bold py-1 border-b-2 flex items-center gap-1 ${tabSelected === 'data' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                                            onClick={() => setTabSelected('data')}
                                        >
                                            <FaUser size={18} color={tabSelected === 'data' ? 'green' : 'white'} />
                                            Dados
                                        </button>

                                        <button
                                            className={`font-bold py-1 border-b-2 flex items-center gap-1 ${tabSelected === 'publis' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                                            onClick={() => setTabSelected('publis')}
                                        >
                                            <FaListAlt size={18} color={tabSelected === 'publis' ? 'green' : 'white'} />
                                            Publicações
                                        </button>

                                        {userData?.userType === 1 && (
                                            <button
                                                className={`font-bold py-1 border-b-2 flex items-center gap-1 ${tabSelected === 'inspections' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                                                onClick={() => setTabSelected('inspections')}
                                            >
                                                <FaList size={18} color={tabSelected === 'inspections' ? 'green' : 'white'} />
                                                Inspeções
                                            </button>
                                        )}

                                        {userData?.userType === 2 && (
                                            <button
                                                className={`font-bold py-1 border-b-2 flex items-center gap-1 ${tabSelected === 'inspections' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                                                onClick={() => setTabSelected('inspections')}
                                            >
                                                <FaList size={18} color={tabSelected === 'inspections' ? 'green' : 'white'} />
                                                Inspeções
                                            </button>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <></>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}