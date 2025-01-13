import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "../../components/Header/header";
import { TopBar } from "../../components/TopBar";
import { useParams } from "react-router";
import { Chat } from "../../components/Chat";
import { Feedback } from "../../components/Feedback";
import { BlockchainUserDataProps, getUserDetailsPage } from "../../services/userDetails/userDetailsPage";
import { HeaderUserDetails } from "./components/HeaderUserDetails/HeaderUserDetails";
import { TabSelectorUserDetails } from "./components/TabSelectorUserDetails/TabSelectorUserDetails";
import { ContentTabsUserDetails, TabsUserDetailsName } from "./components/ContentTabsUserDetails/ContentTabsUserDetails";
import { UserApiProps } from "../../types/user";
import { ActivityIndicator } from "../../components/ActivityIndicator/ActivityIndicator";

export function UserDetails() {
    const { wallet } = useParams();
    const [loading, setLoading] = useState(true);
    const [userType, setUserType] = useState(0);
    const [isError, setIsError] = useState(false);
    const [blockchainData, setBlockchainData] = useState({} as BlockchainUserDataProps);
    const [userApi, setUserApi] = useState({} as UserApiProps);
    const [selectedTab, setSelectedTab] = useState<TabsUserDetailsName>('certificates');

    useEffect(() => {
        handleGetUserDetails();
    }, []);

    async function handleGetUserDetails() {
        setLoading(true);
        const response = await getUserDetailsPage(wallet as string);
        setIsError(!response.success);

        if (response.success) {
            setUserType(response.userType);
            if (response.blockchainData) setBlockchainData(response.blockchainData);
            if (response.userApi) setUserApi(response.userApi);
        }
        setLoading(false);
    }

    if (loading) {
        return (
            <div className={`bg-gradient-to-b from-[#043832] to-[#1F5D38] flex flex-col h-[100vh]`}>
                <TopBar />
                <Header routeActive="" />

                <div className="flex flex-col items-center w-full pt-10 px-1 lg:px-0 lg:pt-32 overflow-auto">
                    <div className="flex flex-col items-center w-full lg:w-[1024px] mt-3 mb-20">
                        <ActivityIndicator
                            size={80}
                        />
                    </div>
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className={`bg-gradient-to-b from-[#043832] to-[#1F5D38] flex flex-col h-[100vh]`}>
                <TopBar />
                <Header routeActive="" />

                <div className="flex flex-col items-center w-full pt-10 px-1 lg:px-0 lg:pt-32 overflow-auto">
                    <div className="flex flex-col items-center w-full lg:w-[1024px] mt-3 mb-20">
                        <p className="text-white">Erro na busca de dados</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={`bg-gradient-to-b from-[#043832] to-[#1F5D38] flex flex-col h-[100vh]`}>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Sintrop App</title>
                <link rel="canonical" href={`https://app.sintrop.com/user-details/${String(wallet).toLowerCase()}`} />
                <link rel="icon" href="/favicon.png" />
                <meta
                    name="description"
                    content="Sistema Descentralizado de Regeneração da Natureza"
                />
            </Helmet>
            <TopBar />
            <Header routeActive="" />

            <div className="flex flex-col items-center w-full pt-10 px-1 lg:px-0 lg:pt-32 overflow-auto">
                <div className="flex flex-col w-full lg:w-[1024px] mt-3 mb-20">
                    <HeaderUserDetails
                        blockchainData={blockchainData}
                        userType={userType}
                        wallet={wallet as string}
                        userApi={userApi}
                    />

                    <TabSelectorUserDetails
                        selectedTab={selectedTab}
                        userType={userType}
                        onChange={setSelectedTab}
                    />

                    <ContentTabsUserDetails
                        blockchainData={blockchainData}
                        selectedTab={selectedTab}
                        userType={userType}
                        userApi={userApi}
                        wallet={wallet as string}
                    />
                </div>
            </div>

            <div className="hidden lg:flex">
                <Feedback />
                <Chat openChat="" />
            </div>

        </div>
    )
}