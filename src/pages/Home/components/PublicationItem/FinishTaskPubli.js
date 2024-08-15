import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaExternalLinkAlt } from 'react-icons/fa';

export function FinishTaskPubli({ data }) {
    const { t } = useTranslation();
    const additionalData = JSON.parse(data?.additionalData);

    return (
        <div className=''>
            <p className='text-white'>{t('textFinalizouTask')}</p>
            <p className='font-bold text-white'>#{additionalData?.taskId} - {additionalData?.title}</p>
            <p className='text-white'>{additionalData?.descriptionTask}</p>

            <p className='text-gray-300 text-xs mt-2'>{t('dadosFinalizacaoTask')}:</p>
            <a
                className="flex items-center gap-1"
                href={additionalData?.urlPR}
                target="_blank"
            >
                <FaExternalLinkAlt className="text-blue-300" size={18} />
                <p
                    className="underline text-blue-300"
                >
                    Pull Request
                </p>
            </a>

            {additionalData?.descriptionFinish && (
                <p className='text-sm text-white'>{additionalData?.descriptionFinish}</p>
            )}
        </div>
    )
}