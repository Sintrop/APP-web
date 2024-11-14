import React, { useEffect, useState } from "react";
import * as Dialog from '@radix-ui/react-dialog';
import { api } from "../../../../services/api";
import { MdClose } from "react-icons/md";
import { ActivityIndicator } from "../../../ActivityIndicator/ActivityIndicator";
import { UserChatItem } from "./UserChatItem";
import { IoMdSearch } from "react-icons/io";

export function ModalNewChat({ chats, chatCreated }) {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [filterUsers, setFilterUsers] = useState([]);

    useEffect(() => {
        getUsers();
    }, []);

    async function getUsers() {
        setLoading(true);

        const response = await api.get('/users');
        const resUsers = response.data.users;

        let usersList = [];

        for (var i = 0; i < resUsers.length; i++) {
            if (resUsers[i].accountStatus === 'blockchain') {
                if (resUsers[i].userType !== 8) {
                    usersList.push(resUsers[i])
                }
            }
        }
        setUsers(usersList);

        setLoading(false);
    }

    return (
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] fixed inset-0' />
            <Dialog.Content className='absolute flex flex-col p-3 lg:w-[500px] lg:h-[500px] bg-[#0a4303] rounded-md mx-2 my-2 lg:my-auto lg:mx-auto inset-0 border-2'>
                <div className="flex items-center justify-between">
                    <div />

                    <Dialog.Close>
                        <MdClose size={30} color='white' />
                    </Dialog.Close>
                </div>

                <div className="bg-green-950 rounded-md w-full flex items-center gap-2 py-2 px-3">
                    <IoMdSearch size={20} color='white' />

                    <input
                        className="w-full text-white bg-transparent"
                        placeholder="Pesquisar"
                        onChange={(e) => {
                            const text = e.target.value;
                            if (text === '') {
                                setFilterUsers([]);
                                return;
                            }
                            const filter = users.filter((item) => item.name.toLowerCase().includes(text.toLowerCase()))
                            setFilterUsers(filter);
                        }}
                    />
                </div>
                <div className="flex flex-col overflow-auto pt-1">
                    {loading ? (
                        <ActivityIndicator size={50} />
                    ) : (
                        <>

                            {filterUsers.length === 0 ? (
                                <>
                                    {users.map(item => (
                                        <UserChatItem
                                            key={item.id}
                                            data={item}
                                            chats={chats}
                                            chatCreated={chatCreated}
                                        />
                                    ))}
                                </>
                            ) : (
                                <>
                                    {filterUsers.map(item => (
                                        <UserChatItem
                                            key={item.id}
                                            data={item}
                                            chats={chats}
                                            chatCreated={chatCreated}
                                        />
                                    ))}
                                </>
                            )}

                        </>
                    )}

                </div>
            </Dialog.Content>
        </Dialog.Portal>
    )
}