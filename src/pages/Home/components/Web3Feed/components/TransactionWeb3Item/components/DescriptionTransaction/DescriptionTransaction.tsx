import React from "react";
import { ParametersTransactionProps } from "../../../../../../../../types/transaction";
import { AddProducerDescription } from "./AddUser/AddProducerDescription";
import { AddInspectorDescription } from "./AddUser/AddInspectorDescription";

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
    addInspector: AddInspectorDescription
}
type DescriptionComponentType = keyof typeof DescriptionComponent;