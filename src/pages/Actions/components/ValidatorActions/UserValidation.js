import React, { useEffect, useState } from "react";
import { getImage } from "../../../../services/getImage";
import { api } from "../../../../services/api";
import { useMainContext } from "../../../../hooks/useMainContext";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ModalValidation } from "./ModalValidation";

export function UserValidation({ data, validatorsCount }) {
    const navigate = useNavigate();
    const { userData } = useMainContext();
    const [modalValidation, setModalValidation] = useState(false);
    const [modalQueue, setModalQueue] = useState(false);
    const [validations, setValidations] = useState([]);
    const [openValidations, setOpenValidations] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userIsVoted, setUserIsVoted] = useState(false);
    const [wallet, setWallet] = useState('')
    const [imageProfile, setImageProfile] = useState(null)

    useEffect(() => {
        getValidations();
        getImageProfile();
    }, [data]);

    async function getValidations() {
        let wallet = '';
        if (data?.userType === 1) {
            wallet = data.producerWallet
            setWallet(wallet)
        }
        if (data?.userType === 2) {
            wallet = data.inspectorWallet
            setWallet(wallet)
        }
        if (data?.userType === 3) {
            wallet = data.researcherWallet
            setWallet(wallet)
        }
        if (data?.userType === 4) {
            wallet = data.developerWallet
            setWallet(wallet)
        }
        if (data?.userType === 7) {
            wallet = data.supporterWallet
            setWallet(wallet)
        }
        const response = await api.get(`/web3/validations-user/${wallet}`);
        const array = response.data.validations

        setValidations(array);

        if (array.length > 0) {
            checkIsVoted(array)
        } else {
            setUserIsVoted(false)
        }
    }

    async function clickUser() {
        let wallet = '';

        if (data?.userType === 1) {
            wallet = data.producerWallet
        }
        if (data?.userType === 2) {
            wallet = data.inspectorWallet
        }
        if (data?.userType === 3) {
            wallet = data.researcherWallet
        }
        if (data?.userType === 4) {
            wallet = data.developerWallet
        }
        if (data?.userType === 7) {
            wallet = data.supporterWallet
        }

        navigate(`/user-details/${wallet}`)
    }

    function checkIsVoted(array) {
        for (var i = 0; i < array.length; i++) {
            if (String(array[i].validator).toUpperCase() === userData?.wallet) {
                setUserIsVoted(true);
            }
        }
    }

    async function getImageProfile() {
        const response = await getImage(data.proofPhoto)
        setImageProfile(response)
    }

    return (
        <div className="flex flex-col p-2 rounded-md bg-[#0a4303]">
            <div className="flex gap-2">
                <div className="h-12 w-12 rounded-full bg-gray-500">
                    {imageProfile && (
                        <img
                            src={imageProfile}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    )}
                </div>

                <div className="flex flex-col">
                    <p className="text-white font-semibold hover:underline hover:cursor-pointer" onClick={clickUser}>{data?.name}</p>
                    <p className="text-white text-sm">{wallet}</p>
                </div>
            </div>

            <div className="flex flex-col w-full p-2 rounded-md bg-green-950 mt-2">
                <div className="flex items-center justify-between w-full">
                    <p className="font-semibold text-white">Votos {validations.length}/{validatorsCount}</p>

                    {validations.length > 0 && (
                        <button
                            onClick={() => setOpenValidations(!openValidations)}
                        >
                            {openValidations ? (
                                <FaChevronUp size={25} color='white' />
                            ) : (
                                <FaChevronDown size={25} color='white' />
                            )}
                        </button>
                    )}
                </div>

                {openValidations && (
                    <div className="flex flex-col mt-2">
                        <p className="text-gray-300 text-xs mb-1">Validações:</p>

                        {validations.map(item => (
                            <div key={item.validator} className="border p-2 rounded-md mb-2">
                                <p className="text-white">Validador: {item.validator}</p>
                                <p className="text-white mt-1">Justificativa: {item.justification}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {userData?.userType === 8 && (
                <div className="flex items-cneter justify-center mt-2">
                    <button className="font-semibold text-white px-3 py-1 rounded-md bg-green-600" onClick={() => setModalValidation(true)}>
                        Votar para invalidar
                    </button>
                </div>
            )}

            {modalValidation && (
                <ModalValidation
                    close={() => setModalValidation()}
                    data={data}
                />
            )}
        </div>
    )
}