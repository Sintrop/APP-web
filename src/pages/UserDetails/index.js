import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { useParams } from "react-router";
import { Blocks } from 'react-loader-spinner';
import { api } from "../../services/api";
import { getImage } from "../../services/getImage";

export function UserDetails() {
    const {wallet} = useParams();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [imageProfile, setImageProfile] = useState(null)

    useEffect(() => {
        getUserDetails();
    }, []);

    async function getUserDetails(){
        setLoading(true);
        
        const response = await api.get(`/user/${wallet}`);
        const user = response.data.user;

        setUserData(user);
        getImageProfile(user.imgProfileUrl);

        setLoading(false);
    }

    async function getImageProfile(hash){
        const response = await getImage(hash);
        setImageProfile(response);
    }

    return (
        <div className={`bg-[#062c01] flex flex-col h-[100vh]`}>
            <Header/>

            <div className="flex flex-col items-center w-full mt-20">
                <div className="flex flex-col w-[1024px] mt-3">
                    {loading && (
                        <div className="flex justify-center">
                            <Blocks
                                height="60"
                                width="60"
                                color="#4fa94d"
                                ariaLabel="blocks-loading"
                                wrapperStyle={{}}
                                wrapperClass="blocks-wrapper"
                                visible={true}
                            />
                        </div>
                    )}

                    {userData && (
                        <>
                        <p className="font-bold text-white">Perfil do usuário</p>
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
                                    <p className="text-white">Wallet: {wallet}</p>
                                </div>
                            </div>
                        </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}