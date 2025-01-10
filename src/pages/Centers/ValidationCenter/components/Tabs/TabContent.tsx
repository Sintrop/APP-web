import React from "react";
import { InspectionsContentTab } from "./InspectionsContentTab";
import { UsersContentTab } from "./UsersContentTab";

interface Props{
    selectedTab: ValidationCenterTabsNames
}
export function TabContent({selectedTab}: Props){
    const Content = ValidationCenterTabs[selectedTab];

    return <Content />
}

export type ValidationCenterTabsNames = keyof typeof ValidationCenterTabs;
const ValidationCenterTabs = {
    inspections: InspectionsContentTab,
    users: UsersContentTab,
}