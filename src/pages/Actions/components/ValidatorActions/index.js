import React, {useEffect, useState} from "react";
import { api } from "../../../../services/api";
import { InspectionValidation } from "./InspectionValidation";
import { ActivityIndicator } from "../../../../components/ActivityIndicator";
import { UserValidation } from "./UserValidation";

export function ValidatorActions(){
    const [inspections, setInspections] = useState([]);
    const [tabSelected, setTabSelected] = useState('inspections');
    const [loadingApi, setLoadingApi] = useState(false);
    const [userType, setUserType] = useState(1);
    const [users, setUsers] = useState([]);
    const [reports, setReports] = useState([]);
    const [modalFeedback, setModalFeedback] = useState(false);
    const [validators, setValidators] = useState([]);

    useEffect(() => {
        getFinishedInspections();
        getReports();
    }, []);

    useEffect(() => {
        getUsers();
    }, [userType]);

    async function getUsers() {
        setLoadingApi(true);

        let array = [];
        if (userType === 1) {
            const response = await api.get('/web3/producers');
            array = response.data.producers;
        }
        if (userType === 2) {
            const response = await api.get('/web3/inspectors');
            array = response.data.inspectors;
        }
        if (userType === 3) {
            const response = await api.get('/web3/researchers');
            array = response.data.researchers;
        }
        if (userType === 4) {
            const response = await api.get('/web3/developers');
            array = response.data.developers;
        }
        
        const validators = await api.get('/web3/validators');
        setValidators(validators.data.validators);

        setUsers(array);
        setLoadingApi(false);
    }

    async function getFinishedInspections() {
        setLoadingApi(true);
        const response = await api.get('/web3/history-inspections');
        const inspections = response.data.inspections;
        setInspections(inspections);
        setLoadingApi(false);
    }

    async function getReports() {
        setLoadingApi(true);
        const response = await api.get('/delations');
        const delations = response.data.delations
        setReports(delations);
    }

    return(
        <div className="flex flex-col w-[800px]">
            <h3 className="font-bold text-white text-lg">Centro de validação</h3>

            <div className="flex items-center gap-8 mb-2">
                <button
                    className={`font-bold py-1 border-b-2 ${tabSelected === 'inspections' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                    onClick={() => setTabSelected('inspections')}
                >
                    Inspeções
                </button>

                <button
                    className={`font-bold py-1 border-b-2 ${tabSelected === 'users' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                    onClick={() => setTabSelected('users')}
                >
                    Usuários
                </button>

                <button
                    className={`font-bold py-1 border-b-2 ${tabSelected === 'reports' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                    onClick={() => setTabSelected('reports')}
                >
                    Denúncias
                </button>
            </div>

            {loadingApi ? (
                <div className="w-full h-[70vh] flex items-center justify-center">
                    <ActivityIndicator size={180}/>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {tabSelected === 'inspections' && (
                        <>
                        {inspections.map(item => (
                            <InspectionValidation
                                key={item.id}
                                data={item}
                                validatorsCount={validators.length}
                            />
                        ))}
                        </>
                    )}

                    {tabSelected === 'users' && (
                        <>
                        <select
                            value={userType}
                            onChange={(e) => setUserType(Number(e.target.value))}
                            className="w-[200px] p-2 rounded-md bg-[#0a4303] text-white"
                        >
                            <option value={1}>Produtores</option>
                            <option value={2}>Inspetores</option>
                            <option value={3}>Pesquisadores</option>
                            <option value={4}>Desenvolvedores</option>
                            <option value={6}>Ativistas</option>
                            <option value={7}>Apoiadores</option>
                        </select>

                        {users.map(item => (
                            <UserValidation
                                key={item.id}
                                data={item}
                                validatorsCount={validators.length}
                            />
                        ))}
                        </>
                    )}
                </div>
            )}

        </div>
    )
}