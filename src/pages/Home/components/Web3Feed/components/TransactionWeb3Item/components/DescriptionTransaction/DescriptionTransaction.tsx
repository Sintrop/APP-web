import React from "react";
import { ParametersTransactionProps } from "../../../../../../../../types/transaction";
import { AddProducerDescription } from "./AddUser/AddProducerDescription";
import { AddInspectorDescription } from "./AddUser/AddInspectorDescription";
import { AddResearcherDescription } from "./AddUser/AddResearcherDescription";
import { AddDeveloperDescription } from "./AddUser/AddDeveloperDescription";
import { AddContributorDescription } from "./AddUser/AddContributorDescription";
import { AddActivistDescription } from "./AddUser/AddActivistDescription";
import { AddSupporterDescription } from "./AddUser/AddSupporterDescription";
import { AddValidatorDescription } from "./AddUser/AddValidatorDescription";
import { InviteDescription } from "./InviteDescription";

interface Props{
    method: string;
    parameters: ParametersTransactionProps[];
}
export function DescriptionTransaction({method, parameters}: Props){
    const Description = DescriptionComponent[method as DescriptionComponentType] || null;
    
    return Description ? <Description parameters={parameters}/> : <div/>
}

const DescriptionComponent = {
    addProducer: AddProducerDescription,
    addInspector: AddInspectorDescription,
    addResearcher: AddResearcherDescription,
    addDeveloper: AddDeveloperDescription,
    addContributor: AddContributorDescription,
    addActivist: AddActivistDescription,
    addSupporter: AddSupporterDescription,
    addValidator: AddValidatorDescription,
    invite: InviteDescription
}
type DescriptionComponentType = keyof typeof DescriptionComponent;