import React, { useEffect, useState } from "react";
import { getResearches } from "../../../../../services/actions/voteResearcheService";
import { ResearcheProps } from "../../../../../types/researche";
import { VoteResearcheItem } from "./VoteResearcheItem";

export function VoteResearche(){
    const [loading, setLoading] = useState(false);
    const [researches, setResearches] = useState<ResearcheProps[]>([]);
    

    useEffect(() => {
        handleGetResearches();
    }, []);

    async function handleGetResearches(){
        setLoading(true);
        const response = await getResearches();
        setResearches(response);
        setLoading(false);
    }

    return(
        <div className="flex flex-col gap-3 h-full overflow-y-auto mb-5">
            {researches.map(researche => (
                <VoteResearcheItem
                    key={researche.id}
                    researche={researche}
                />
            ))}
        </div>
    )
}