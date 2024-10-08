import React, {useState} from "react";
import { format } from "date-fns";
import {useNavigate} from 'react-router-dom';
import { ModalValidation } from "./ModalValidation";
import {useMainContext} from '../../../../hooks/useMainContext';

export function InspectionValidation({data, validatorsCount}){
    const {userData} = useMainContext();
    const navigate = useNavigate();
    const [modalValidation, setModalValidation] = useState(false);

    return(
        <div className="flex flex-col w-full p-3 rounded-md bg-[#03364B]">
            <div className="flex items-center justify-between w-full">
                <div className="flex flex-col">
                    <p className="font-semibold text-white">Inspeção #{data?.id}</p>

                    {data.status === 2 && (
                        <p className="text-white text-sm">Finalizada em: {format(new Date(Number(data?.inspectedAtTimestamp) * 1000), 'dd/MM/yyyy - kk:mm')}</p>
                    )}

                    {data.status === 3 && (
                        <p className="font-semibold text-yellow-500">EXPIRADA</p>
                    )}

                    {data.status === 4 && (
                        <p className="font-semibold text-red-500">INVALIDADA</p>
                    )}
                </div>

                <div className="p-3 rounded-md bg-[#012939]">
                    <p className="font-semibold text-white">Votos: {data?.validationsCount}/{validatorsCount}</p>
                </div>
            </div>
            
            <div className="flex items-center justify-center mt-5 gap-5">
                {data?.status === 2 && (
                    <button className="font-semibold text-white px-3 py-1 rounded-md bg-blue-500" onClick={() => navigate(`/result-inspection/${data?.id}`)}>
                        Ver inspeção
                    </button>
                )}

                {userData?.userType === 8 && (
                    <button className="font-semibold text-white px-3 py-1 rounded-md bg-green-600" onClick={() => setModalValidation(true)}>
                        Votar para invalidar
                    </button>
                )}
            </div>

            {modalValidation && (
                <ModalValidation
                    close={() => setModalValidation(false)}
                    data={data}
                />
            )}
        </div>
    )
}