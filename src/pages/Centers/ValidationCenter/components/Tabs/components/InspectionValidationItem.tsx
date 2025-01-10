import React, { useState } from "react";
import { InspectionProps } from "../../../../../../types/inspection";
import { Jazzicon } from "@ukstv/jazzicon-react";
import { useTranslation } from "react-i18next";
import { BiCubeAlt } from "react-icons/bi";

interface Props {
    inspection: InspectionProps;
}
export function InspectionValidationItem({ inspection }: Props) {
    const { t } = useTranslation();
    const [showValidations, setShowValidations] = useState(false);

    return (
        <div className={`w-full flex flex-col px-3 border-b border-container-secondary bg-container-primary duration-300 ${showValidations ? 'h-[300px]' : 'h-[45px]'}`}>
            <div className="flex items-center bg-container-primary rounded-t-md pt-2">
                <div className="w-[50px]">
                    <p className="text-white text-sm">{inspection.id}</p>
                </div>

                <div className="w-[200px] pl-2">
                    {/* wallet produtor */}
                    <div className="flex items-center gap-2 w-full">
                        <Jazzicon address={inspection.producer} className="w-7 h-7" />
                        <p
                            className="text-white text-sm truncate max-w-[70%]"
                        >
                            {inspection.producer}
                        </p>
                    </div>
                </div>

                <div className="w-[200px] pl-2">
                    {/* wallet inspetor */}
                    <div className="flex items-center gap-2 w-full">
                        <Jazzicon address={inspection.inspector} className="w-7 h-7" />
                        <p
                            className="text-white text-sm truncate max-w-[70%]"
                        >
                            {inspection.inspector}
                        </p>
                    </div>
                </div>

                <div className="w-[150px] pl-2">
                    {/* Bloco finalizada */}
                    {inspection.inspectedAt === "0" ? (
                        <p className="text-white text-sm">
                            {t('naoInspecionada')}
                        </p>
                    ) : (
                        <a
                            className="text-sm text-white underline flex items-center gap-1"
                            href={`${process.env.REACT_APP_URL_EXPLORER}/block/${inspection.inspectedAt}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <BiCubeAlt size={15} color='white' />
                            {inspection.inspectedAt}
                        </a>
                    )}

                </div>

                <div className="w-[150px] pl-2">
                    <p className="text-white text-sm">{inspection.regenerationScore}</p>
                </div>

                <div className="w-[150px] pl-2">
                    <p className="text-white text-sm">{inspection.validationsCount}</p>
                </div>
            </div>
        </div>
    )
}