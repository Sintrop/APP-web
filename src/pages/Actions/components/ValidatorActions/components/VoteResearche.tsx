import React, { useEffect, useState } from "react";

export function VoteResearche(){
    const [researches, setResearches] = useState<[]>([]);

    useEffect(() => {
        handleGetResearches();
    }, []);

    async function handleGetResearches(){
        setResearches([]);
    }

    return(
        <div className="flex flex-col gap-3 h-full">
            {researches.map(researche => (
                <>
                    {researche}
                </>
            ))}
        </div>
    )
}