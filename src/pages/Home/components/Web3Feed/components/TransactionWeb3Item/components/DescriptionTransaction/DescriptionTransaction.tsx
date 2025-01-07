import React from "react";
import { ParametersTransactionProps, TokensTransferProps } from "../../../../../../../../types/transaction";
import { AddProducerDescription } from "./AddUser/AddProducerDescription";
import { AddInspectorDescription } from "./AddUser/AddInspectorDescription";
import { AddResearcherDescription } from "./AddUser/AddResearcherDescription";
import { AddDeveloperDescription } from "./AddUser/AddDeveloperDescription";
import { AddContributorDescription } from "./AddUser/AddContributorDescription";
import { AddActivistDescription } from "./AddUser/AddActivistDescription";
import { AddSupporterDescription } from "./AddUser/AddSupporterDescription";
import { AddValidatorDescription } from "./AddUser/AddValidatorDescription";
import { InviteDescription } from "./InviteDescription";
import { WithdrawDescription } from "./WithdrawDescription";
import { UserValidationDescription } from "./Validations/UserValidationDescription";
import { AddContributionDescription } from "./AddContribution";
import { AddWorkDescription } from "./AddWork";

interface Props{
    method: string;
    parameters: ParametersTransactionProps[];
    transactionHash: string;
}
export function DescriptionTransaction({method, parameters, transactionHash}: Props){
    const Description = DescriptionComponent[method as DescriptionComponentType] || null;
    
    return Description ? <Description parameters={parameters} transactionHash={transactionHash}/> : <div/>
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
    invite: InviteDescription,
    withdraw: WithdrawDescription,
    addUserValidation: UserValidationDescription,
    addContribution: AddContributionDescription,
    addWork: AddWorkDescription
}
type DescriptionComponentType = keyof typeof DescriptionComponent;