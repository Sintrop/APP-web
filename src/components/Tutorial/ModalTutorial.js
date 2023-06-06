import React, {useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useMainContext } from '../../hooks/useMainContext';

const tutorialRequestInspection = [
    {
        id: 1, 
        title: 'Missão 2: Concluir uma inspeção', 
        description: "A segunda missão é concluir uma inspeção e receber sua primeira avaliação de regeneração.",
        description2:'Ao concluir você será promovido a SARGENTO MUDA.',
        img: 'formiga-muda',
        imgLong: '',
    },
    {
        id: 12, 
        title: 'Missão 2: Concluir uma inspeção', 
        description: "Essa missão possui 3 etapas:",
        description2:'1) Solicitar uma inspeção; 2) Acompanhar o andamento; 3) Receber o ativista',
        img: 'formiga-muda',
        imgLong: '',
    },
    {
        id: 13, 
        title: 'Etapa 1: Solicitar inspeção', 
        description: "Clique em 'Gerenciar Inspeções' no menu lateral,",
        description2:'Depois clique no botão “SOLICITAR NOVA INSPEÇÃO”, no canto superior direito.',
        img: '',
        imgLong: 'tutorial-req-inspection-1',
    },
    {
        id: 14, 
        title: 'Etapa 1: Solicitar inspeção', 
        description: "Finalize a transação, clicando no botão “CONFIRMAR” no METAMASK",
        description2:'',
        img: '',
        imgLong: 'tutorial-req-inspection-2',
    },
    {
        id: 15, 
        title: 'TRANSAÇÃO BEM - SUCEDIDA', 
        description: "",
        description2:'',
        img: '',
        imgLong: 'tutorial-req-inspection-3',
    },
    {
        id: 16, 
        title: 'Pronto! Inspeção solicitada', 
        description: "Agora acompanhe a sua inspeção em “HISTÓRICO DE INSPEÇÕES e aguarde ser aceita pelo ativista.",
        description2:'Caso a inspeção apareça expirada, ou ativista não comparecer volte e solicite uma nova inspeção.',
        img: '',
        imgLong: 'tutorial-req-inspection-4',
    },
    {
        id: 17, 
        title: 'PARABÉNS INSPEÇÃO CONCLUÍDA', 
        description: "Clicando em “EM HISTÓRICO DE INSPEÇÕES” Você consegue acompanhar todos os detalhes da sua inspeção.",
        description2:'',
        img: '',
        imgLong: 'tutorial-req-inspection-5',
    }
];

export function ModalTutorial(){
    const {chooseModalTutorial} = useMainContext()
    const [step, setStep] = useState(1);

    const tutorial = tutorialRequestInspection

    return(
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] fixed inset-0'/>
            <Dialog.Content className='absolute flex flex-col items-center justify-between p-3 w-[450px] h-[600px] bg-green-800 rounded-md m-auto inset-0 border-8 border-[#783E19]'>
                <img
                    src={require('../../assets/logo-branco.png')}
                    className='w-[120px] object-contain'
                />

                <div className='flex flex-col items-center'>
                    <div className='flex flex-col items-center w-full h-full' key={tutorial[step - 1]?.id}>
                        <div className='flex flex-col w-full h-full items-center justify-between px-6'>
                            <div>
                                <h1 className='font-bold text-center text-[#ff9900] text-lg'>{tutorial[step - 1]?.title}</h1>
                                <h2 className='text-center mt-3 text-white'>{tutorial[step - 1]?.description}</h2>
                                <h3 className='text-center mt-3 text-white'>{tutorial[step - 1]?.description2}</h3>
                            </div>
                            {tutorial[step - 1]?.img !== '' && (
                                <img
                                    src={require(`../../assets/${tutorial[step - 1]?.img}.png`)}
                                    className='w-[90px] object-contain'
                                />
                            )}
                            {tutorial[step - 1]?.imgLong !== '' && (
                                <img
                                    src={require(`../../assets/${tutorial[step - 1]?.imgLong}.png`)}
                                    className='w-full max-h-[250px] object-contain'
                                />
                            )}
                            {tutorial[step - 1]?.link && (
                                <a
                                    href={tutorial[step - 1]?.link}
                                    target='_blank'
                                    className='border-b-2 border-blue-400 text-blue-400'
                                >
                                    {tutorial[step - 1]?.link}    
                                </a>
                            )}
                            {tutorial[step - 1]?.banner && (
                                <img
                                    src={require(`../../assets/${tutorial[step - 1]?.banner}.png`)}
                                    className='w-full h-[100%] object-contain'
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className='flex items-center gap-3'>
                    <button 
                        className='px-3 py-2 bg-[#ff9900] text-white font-bold rounded-md mt-[-20px]'
                        onClick={() => {
                            if(step > 1)setStep(step - 1)
                        }}
                    >
                        Voltar
                    </button>
                    <button 
                        className='px-3 py-2 bg-[#ff9900] text-white font-bold rounded-md mt-[-20px]'
                        onClick={() => {
                            if(step === tutorial.length){
                                chooseModalTutorial()
                            }
                            if(step < tutorial.length)setStep(step + 1)
                        }}
                    >
                        {step === tutorial.length ? 'Concluir' : 'Prosseguir'}
                    </button>
                </div>
            </Dialog.Content>
        </Dialog.Portal>
    )
}