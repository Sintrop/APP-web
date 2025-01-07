import React from "react";
import { MdClose } from "react-icons/md";
import { SendContribuiton } from "../DeveloperActions/components/SendContribuiton";
import { WithdrawTokens } from "./components/WithdrawTokens";
import { PublishResearche } from "../ResearcherActions/components/PublishResearche";
import { RequestInspection } from "../ProducerActions/components/RequestInspection";
import { InviteUser } from "./components/InviteUser";
import { VoteUser } from "../ValidatorActions/components/VoteUser";
import { VoteInspection } from "../ValidatorActions/components/VoteInspection";
import { VoteDevContribution } from "../ValidatorActions/components/VoteDevContribution";
import { VoteResearche } from "../ValidatorActions/components/VoteResearche";
import { DeclareAlive } from "../ValidatorActions/components/DeclareAlive";

interface Props{
    close: () => void;
    type: actionsName;
}
export function ModalRealizeAction({close, type}: Props){
    const ActionComponent = actionsTypeToComponent[type];

    return(
        <div className='flex justify-center items-center inset-0'>
            <div className='bg-[rgba(0,0,0,0.6)] fixed inset-0'/>
            <div className='absolute flex flex-col items-center lg:h-[400px] p-3 lg:w-[400px] bg-container-primary rounded-md my-auto lg:mx-auto mx-2 inset-0 border-2'>
                <div className="flex items-center justify-between w-full">
                    <div className="w-6"/>

                    <p 
                        className="text-center text-white font-semibold max-w-[60%]"
                    >
                        Realizar ação
                    </p>

                    <button onClick={close}>
                        <MdClose size={25} color='white'/>
                    </button>
                </div>

                <div className="flex flex-col justify-center h-full w-full">
                    <ActionComponent 
                        close={close}
                    />
                </div>
            </div>
        </div>
    )
}

const actionsTypeToComponent = {
    sendContribution: SendContribuiton,
    withdrawTokens: WithdrawTokens,
    publishResearche: PublishResearche,
    requestInspection: RequestInspection,
    inviteUser: InviteUser,
    voteUser: VoteUser,
    voteInspection: VoteInspection,
    voteDevContribution: VoteDevContribution,
    voteResearche: VoteResearche,
    declareAlive: DeclareAlive,
}
type actionsType = typeof actionsTypeToComponent;
export type actionsName = keyof actionsType;