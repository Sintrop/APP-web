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

interface Props{
    method: string;
    parameters: ParametersTransactionProps[];
    tokensTransfer?: TokensTransferProps[];
}
export function DescriptionTransaction({method, parameters, tokensTransfer}: Props){
    const Description = DescriptionComponent[method as DescriptionComponentType] || null;
    
    return Description ? <Description parameters={parameters} tokensTransfer={tokensTransfer}/> : <div/>
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
}
type DescriptionComponentType = keyof typeof DescriptionComponent;