import React from "react";
import { useTranslation } from "react-i18next";
import { FaQrcode, FaUser, FaListAlt, FaList, FaMapMarkedAlt } from "react-icons/fa";
import { TabsUserDetailsName } from "../ContentTabsUserDetails/ContentTabsUserDetails";

interface Props{
    userType: number;
    selectedTab: string;
    onChange: (selectedTab: TabsUserDetailsName) => void;
}
export function TabSelectorUserDetails({onChange, selectedTab, userType}: Props) {
    const {t} = useTranslation();
    
    return (
        <div className="flex items-center gap-8 mt-2 w-full overflow-x-scroll">
            <button
                className={`text-sm font-bold py-1 border-b-2 flex items-center gap-1 ${selectedTab === 'certificates' ? ' border-green-600 text-green-600' : 'text-white border-transparent'} lg:text-base`}
                onClick={() => onChange('certificates')}
            >
                <FaQrcode size={18} color={selectedTab === 'certificates' ? 'green' : 'white'} />
                {t('certificados')}
            </button>

            <button
                className={`text-sm font-bold py-1 border-b-2 flex items-center gap-1 ${selectedTab === 'data' ? ' border-green-600 text-green-600' : 'text-white border-transparent'} lg:text-base`}
                onClick={() => onChange('data')}
            >
                <FaUser size={18} color={selectedTab === 'data' ? 'green' : 'white'} />
                {t('dados')}
            </button>

            <button
                className={`text-sm font-bold py-1 border-b-2 flex items-center gap-1 ${selectedTab === 'publis' ? ' border-green-600 text-green-600' : 'text-white border-transparent'} lg:text-base`}
                onClick={() => onChange('publis')}
            >
                <FaListAlt size={18} color={selectedTab === 'publis' ? 'green' : 'white'} />
                {t('publicacoes')}
            </button>

            {userType === 1 && (
                <>
                    <button
                        className={`text-sm font-bold py-1 border-b-2 flex items-center gap-1 ${selectedTab === 'inspections' ? ' border-green-600 text-green-600' : 'text-white border-transparent'} lg:text-base`}
                        onClick={() => onChange('inspections')}
                    >
                        <FaList size={18} color={selectedTab === 'inspections' ? 'green' : 'white'} />
                        {t('isps')}
                    </button>

                    <button
                        className={`text-sm font-bold py-1 border-b-2 flex items-center gap-1 ${selectedTab === 'zones' ? ' border-green-600 text-green-600' : 'text-white border-transparent'} lg:text-base`}
                        onClick={() => onChange('zones')}
                    >
                        <FaMapMarkedAlt size={18} color={selectedTab === 'zones' ? 'green' : 'white'} />
                        {t('zonasDeRegeneracao')}
                    </button>
                </>
            )}

            {userType === 2 && (
                <button
                    className={`text-sm font-bold py-1 border-b-2 flex items-center gap-1 ${selectedTab === 'inspections' ? ' border-green-600 text-green-600' : 'text-white border-transparent'} lg:text-base`}
                    onClick={() => onChange('inspections')}
                >
                    <FaList size={18} color={selectedTab === 'inspections' ? 'green' : 'white'} />
                    {t('isps')}
                </button>
            )}
        </div>
    )
}