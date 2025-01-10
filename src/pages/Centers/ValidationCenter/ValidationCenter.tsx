import React, { useState } from "react";
import { Header } from "../../../components/Header/header";
import { TopBar } from "../../../components/TopBar";
import { TabContent, ValidationCenterTabsNames } from "./components/Tabs/TabContent";
import { useTranslation } from "react-i18next";

export function ValidationCenter() {
    const {t} = useTranslation();
    const [selectedTab, setSelectedTab] = useState<ValidationCenterTabsNames>('inspections');

    return (
        <div className={`bg-gradient-to-b from-[#043832] to-[#1F5D38] flex flex-col h-[100vh]`}>
            <TopBar />
            <Header routeActive="" />

            <div className="flex flex-col items-center w-full pt-32 overflow-y-auto">
                <div className="flex flex-col gap-3 max-w-[1024px] mt-3 w-full lg:w-[1024px]">
                    <div className="flex items-center gap-8 mb-2 w-full">
                        <button
                            className={`font-bold py-1 border-b-2 ${selectedTab === 'inspections' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                            onClick={() => setSelectedTab('inspections')}
                        >
                            {t('textInspecoes')}
                        </button>

                        <button
                            className={`font-bold py-1 border-b-2 ${selectedTab === 'users' ? ' border-green-600 text-green-600' : 'text-white border-transparent'}`}
                            onClick={() => setSelectedTab('users')}
                        >
                            {t('textUsuarios')}
                        </button>
                    </div>

                    <TabContent selectedTab={selectedTab}/>
                </div>
            </div>
        </div>
    )
}