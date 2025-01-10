import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "../../../../../components/ActivityIndicator/ActivityIndicator";
import { ActivistProps } from "../../../../../types/activist";
import { ContributorProps } from "../../../../../types/contributor";
import { DeveloperProps } from "../../../../../types/developer";
import { InspectorProps } from "../../../../../types/inspector";
import { ResearcherProps } from "../../../../../types/researcher";
import { SupporterProps } from "../../../../../types/supporter";
import { ProducerProps, UserTypeProps } from "../../../../../types/user";
import { ValidatorProps } from "../../../../../types/validator";
import { getUsersValidationCenter } from "../../../../../services/centers/validation/users";
import { useTranslation } from "react-i18next";
import { UserTabItem } from "./components/UserTabItem";

export function UsersContentTab() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [users, setUsers] = useState<
        ProducerProps[] | InspectorProps[] |
        ResearcherProps[] | DeveloperProps[] |
        ContributorProps[] | ActivistProps[] |
        SupporterProps[] | ValidatorProps[]
    >([]);
    const [userType, setUserType] = useState<UserTypeProps>(1);

    useEffect(() => {
        handleGetUsers();
    }, [userType]);

    async function handleGetUsers() {
        setLoading(true);
        const response = await getUsersValidationCenter(userType);
        setIsError(!response.success);

        if (response.success) {
            setUsers(response.users);
        }
        setLoading(false);
    }

    function handleTryAgain(){
        setIsError(false);
        setLoading(true);
        setTimeout(() => handleGetUsers(), 500)
    }

    if (isError) {
        return (
            <div className="flex flex-col mt-10">
                <p className="text-white">{t('erroNaBuscaDeDados')}</p>

                <button
                    className="w-fit bg-blue-500 rounded-md text-white font-semibold h-12 px-5 mt-5"
                    onClick={handleTryAgain}
                >
                    {t('tentarNovamente')}
                </button>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex flex-col w-full">
                <select
                    value={userType}
                    onChange={(e) => setUserType(parseInt(e.target.value) as UserTypeProps)}
                    className="w-[200px] h-10 rounded-md px-2 text-white bg-container-secondary mb-2"
                >
                    <option value={1}>{t('textProdutor')}</option>
                    <option value={2}>{t('textInspetor')}</option>
                    <option value={3}>{t('textPesquisador')}</option>
                    <option value={4}>{t('textDesenvolvedor')}</option>
                    <option value={5}>{t('textContribuidor')}</option>
                    <option value={6}>{t('textAtivista')}</option>
                    <option value={7}>{t('textApoiador')}</option>
                    <option value={8}>{t('textValidador')}</option>
                </select>
                <ActivityIndicator size={50} />
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full">
            <select
                value={userType}
                onChange={(e) => setUserType(parseInt(e.target.value) as UserTypeProps)}
                className="w-[200px] h-10 rounded-md px-2 text-white bg-container-primary mb-2"
            >
                <option value={1}>{t('textProdutor')}</option>
                <option value={2}>{t('textInspetor')}</option>
                <option value={3}>{t('textPesquisador')}</option>
                <option value={4}>{t('textDesenvolvedor')}</option>
                <option value={5}>{t('textContribuidor')}</option>
                <option value={6}>{t('textAtivista')}</option>
                <option value={7}>{t('textApoiador')}</option>
                <option value={8}>{t('textValidador')}</option>
            </select>
            {users.length === 0 ? (
                <div>
                    <p className="text-white">{t('nenhumUsuarioCadastrado')}</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {users.map(user => (
                        <UserTabItem
                            key={user.id}
                            getUsers={handleGetUsers}
                            user={user}
                            userType={userType}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}