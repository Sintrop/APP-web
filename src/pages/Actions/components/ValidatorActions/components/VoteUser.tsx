import React, { useEffect, useState } from "react";
import { getUsers } from "../../../../../services/actions/voteUserService";
import { useTranslation } from "react-i18next";
import { UserToVoteItem } from "./UserToVoteItem";
import { ProducerProps, UserTypeProps } from "../../../../../types/user";
import { DeveloperProps } from "../../../../../types/developer";

export function VoteUser() {
    const { t } = useTranslation();
    const [users, setUsers] = useState<ProducerProps[] | DeveloperProps[]>([]);
    const [userType, setUserType] = useState<UserTypeProps>(1);

    useEffect(() => {
        handleGetUsers();
    }, []);

    async function handleGetUsers() {
        const response = await getUsers(userType);
        setUsers(response);
    }

    return (
        <div className="flex flex-col w-full h-full">
            <select
                value={userType}
                onChange={(e) => setUserType(parseInt(e.target.value) as UserTypeProps)}
                className="w-full h-10 rounded-md px-2 text-white bg-container-secondary mb-2"
            >
                <option value={1}>{t('textProdutor')}</option>
            </select>

            <div className="flex flex-col overflow-auto max-h-[83%]">
                {users.length > 0 ? (
                    <div className="flex flex-col gap-3">
                        {users?.map(user => (
                            <UserToVoteItem
                                key={user.id}
                                userType={userType}
                                user={user}
                                getUsers={handleGetUsers}
                            />
                        ))}
                    </div>
                ) : (
                    <>
                    </>
                )}
            </div>
        </div>
    )
}