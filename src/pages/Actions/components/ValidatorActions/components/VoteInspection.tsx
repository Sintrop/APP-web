import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { InspectionProps } from "../../../../../types/inspection";
import { getHistoryInspectionsToVote } from "../../../../../services/actions/voteInspectionService";
import { InspectionToVoteItem } from "./InspectionToVoteItem";
import { ActivityIndicator } from "../../../../../components/ActivityIndicator/ActivityIndicator";

export function VoteInspection() {
    const { t } = useTranslation();
    const [inspections, setInspections] = useState<InspectionProps[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        handleGetInspections();
    }, []);

    async function handleGetInspections() {
        setLoading(true);
        const response = await getHistoryInspectionsToVote();
        setInspections(response);
        setLoading(false);
    }

    if(loading){
        return (
            <div className="flex flex-col w-full h-full items-center justify-center">
                <ActivityIndicator size={100}/>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex flex-col overflow-auto max-h-[83%]">
                {inspections.length > 0 ? (
                    <div className="flex flex-col gap-3">
                        {inspections?.map(inspection => (
                            <InspectionToVoteItem
                                key={inspection.id}
                                inspection={inspection}
                                getInspections={handleGetInspections}
                            />
                        ))}
                    </div>
                ) : (
                    <>
                    </>
                )}
            </div>
        </div>
    )
}