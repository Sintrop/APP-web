import React, { useEffect, useState } from "react";
import { getContributionsDev } from "../../../../../services/actions/voteDevContributionService";
import { ContributionProps } from "../../../../../types/developer";
import { ContributionDevToVoteItem } from "./ContributionDevToVoteItem";

export function VoteDevContribution(){
    const [contributions, setContributions] = useState<ContributionProps[]>([]);

    useEffect(() => {
        handleGetContributions();
    }, []);

    async function handleGetContributions(){
        const response = await getContributionsDev();
        setContributions(response);
    }

    return(
        <div className="flex flex-col gap-3 h-full overflow-y-auto mb-5">
            {contributions.map(contribution => (
                <ContributionDevToVoteItem
                    key={contribution.id}
                    contribution={contribution}
                />
            ))}
        </div>
    )
}