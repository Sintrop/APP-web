import React from "react";
import { IndicatorProps } from "../../../../../../../types/category";

interface Props{
    indicator: IndicatorProps;
}

export function IndicatorItem({indicator}: Props){
    return(
        <div className="flex flex-col">
            <p className="text-white text-sm">
                {indicator.isaId === 1 && 'Regenerative 6 (+25 pts)'}
                {indicator.isaId === 2 && 'Regenerative 5 (+16 pts)'}
                {indicator.isaId === 3 && 'Regenerative 4 (+8 pts)'}
                {indicator.isaId === 4 && 'Regenerative 3 (+4 pts)'}
                {indicator.isaId === 5 && 'Regenerative 2 (+2 pts)'}
                {indicator.isaId === 6 && 'Regenerative 1 (+1 pts)'}
                {indicator.isaId === 7 && 'Neutro'}
                {indicator.isaId === 8 && 'Not Regenerative 1 (-1 pts)'}
                {indicator.isaId === 9 && 'Not Regenerative 2 (-2 pts)'}
                {indicator.isaId === 10 && 'Not Regenerative 3 (-4 pts)'}
                {indicator.isaId === 11 && 'Not Regenerative 4 (-8 pts)'}
                {indicator.isaId === 12 && 'Not Regenerative 5 (-16 pts)'}
                {indicator.isaId === 13 && 'Not Regenerative 6 (-25 pts)'}
            </p>
            <p className="font-semibold text-white">{indicator?.description}</p>
        </div>
    )
}