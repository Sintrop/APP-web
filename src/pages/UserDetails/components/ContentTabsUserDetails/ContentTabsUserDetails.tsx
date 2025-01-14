import React from "react";
import { CertificatesTab } from "./CertificatesTab";
import { BlockchainUserDataProps } from "../../../../services/userDetails/userDetailsPage";
import { UserApiProps } from "../../../../types/user";
import { DataTab } from "./DataTab";
import { PublisTab } from "./PublisTab";
import { InspectionsTab } from "./InspectionsTab";
import { RegenerationZonesTab } from "./RegenerationZonesTab";

interface Props{
    userType: number;
    selectedTab: TabsUserDetailsName;
    blockchainData: BlockchainUserDataProps;
    userApi: UserApiProps;
    wallet: string;
}
export function ContentTabsUserDetails({userType, selectedTab, blockchainData, userApi, wallet}: Props){
    const Content = tabs[selectedTab];
    
    return <Content
        blockchainData={blockchainData}
        userApi={userApi}
        userType={userType}
        wallet={wallet}
    />
}

export type TabsUserDetailsName = keyof typeof tabs;
const tabs = {
    certificates: CertificatesTab,
    data: DataTab,
    publis: PublisTab,
    inspections: InspectionsTab,
    zones: RegenerationZonesTab
}