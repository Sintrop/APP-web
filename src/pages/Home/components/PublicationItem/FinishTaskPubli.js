import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { Marker } from '../../../Actions/components/DeveloperActions/FeedbackItem/components/Marker';

export function FinishTaskPubli({ data }) {
    const { t } = useTranslation();
    const additionalData = JSON.parse(data?.additionalData);

    return (
        <div className=''>
            <p className='text-white'>{t('textFinalizouTask')}</p>

            <div className='flex gap-3 my-2 items-center'>
                {additionalData?.taskData?.type === 'feedback' ? (
                    <Marker type='feedback' />
                ) : (
                    <>
                        {additionalData?.taskData?.priority === 1 && (
                            <Marker type='low' />
                        )}
                        {additionalData?.taskData?.priority === 2 && (
                            <Marker type='average' />
                        )}
                        {additionalData?.taskData?.priority === 3 && (
                            <Marker type='high' />
                        )}
                        {additionalData?.taskData?.team === 1 && (
                            <Marker type='frontend' />
                        )}
                        {additionalData?.taskData?.team === 2 && (
                            <Marker type='contracts' />
                        )}
                        {additionalData?.taskData?.team === 3 && (
                            <Marker type='mobile' />
                        )}
                        {additionalData?.taskData?.team === 4 && (
                            <Marker type='design' />
                        )}
                        {additionalData?.taskData?.team === 5 && (
                            <Marker type='ux' />
                        )}
                        {additionalData?.taskData?.team === 6 && (
                            <Marker type='api' />
                        )}
                        <Marker type='task' />
                    </>
                )}

                <p className='font-bold text-white'>+{additionalData?.taskData?.pts} pts</p>
            </div>

            <p className='font-bold text-white'>#{additionalData?.taskData?.id} - {additionalData?.taskData?.title}</p>
            <p className='text-white'>{additionalData?.taskData?.description}</p>

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