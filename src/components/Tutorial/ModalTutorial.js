import React, {useState, useEffect} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useMainContext } from '../../hooks/useMainContext';
import {TbArrowsDiagonalMinimize2} from 'react-icons/tb';
import { ModalRequestSepolia } from '../ModalRequestSepolia';
import { ToastContainer, toast} from 'react-toastify';

const tutorial1 = [
    {
        id: 1, 
        title: 'Missão 1: Entrar na plataforma', 
        description: 'Nosso sistema utiliza a tecnologia da blockchain. E para interagir com ele, é necessário possuir uma carteira na rede Ethereum e o provedor mais popular é o MetaMask. É por ela que será feita a distribuição dos tokens como pagamento aos serviços ambientais ecossistêmicos prestados para a sociedade.',
        description2: 'Pense que essa etapa seria o equivalente a abertura de uma conta no banco. Porém no universo descentralizado.',
        img: 'formiga-semente-1',
        imgLong: ''
    },
    {
        id: 2, 
        title: 'Etapa 1: Criar carteira no MetaMask', 
        description: 'Vá até a loja de extensões do seu navegador e faça a instalação do MetaMask. Fique atento para apenas instalar a extensão com o nome correto, com o selo azul de verificação e do site metamask.io',
        description2: 'Nunca baixe nenhuma extensão sem ser da fonte original confiável',
        img: '',
        imgLong: 'tutorial-metamask-11'
    },
    {
        id: 3, 
        title: 'Etapa 1: Criar carteira no MetaMask', 
        description: '4º Passo: Digite Metamask no campo de pesquisa',
        description2: '',
        img: '',
        imgLong: 'tutorial-metamask-12'
    },
    {
        id: 4, 
        title: 'Etapa 1: Criar carteira no MetaMask', 
        description: 'Irá acontecer o download da extensão, agora é só instalar e configurar.',
        description2: 'Selecione o campo para aceitar os termos do MetaMask e clique no botão “CRIAR UMA NOVA CARTEIRA” conforme mostra a primeira imagem abaixo, logo em seguida clique no botão “I AGREE”, conforme mostra a segunda imagem abaixo.',
        img: '',
        imgLong: 'tutorial-metamask-13'
    },
    {
        id: 5, 
        title: 'Etapa 1: Criar carteira no MetaMask', 
        description: 'Crie uma senha anote e guarde em segurança, para não perder, logo após criar a senha, selecione as regras abaixo e clique no botão “CRIAR UMA NOVA CARTEIRA”.',
        description2:'',
        img: '',
        imgLong: 'tutorial-metamask-14'
    },
    {
        id: 6, 
        title: 'Etapa 1: Criar carteira no MetaMask', 
        description: '',
        description2:'',
        img: '',
        imgLong: 'tutorial-metamask-15'
    },
    {
        id: 7, 
        title: 'Etapa 1: Criar carteira no MetaMask', 
        description: 'Anote suas frases que apareceram nos campos do 1 ao 12, e guarde em segurança!',
        description2:'',
        img: '',
        imgLong: 'tutorial-metamask-16'
    },
    {
        id: 8, 
        title: 'Etapa 1: Criar carteira no MetaMask', 
        description: 'Sua carteira foi criada com sucesso!',
        description2:'',
        img: '',
        imgLong: 'tutorial-metamask-17'
    },
    {
        id: 9, 
        title: 'Etapa 2: Configurar Metamask', 
        description: "Agora que sua carteira foi criada, é hora de configurar...",
        description2:'',
        img: '',
        imgLong: 'tutorial-metamask-18',
    },
    {
        id: 10, 
        title: 'Etapa 2: Configurar Metamask', 
        description: "Procure pela opção “Mostrar redes de teste” e ative a visualização das redes de teste.",
        description2:'',
        img: '',
        imgLong: 'tutorial-metamask-19',
    },
    {
        id: 11, 
        title: 'Etapa 2: Configurar Metamask', 
        description: "",
        description2:'',
        img: '',
        imgLong: 'tutorial-metamask-20',
    },
    {
        id: 12, 
        title: 'Etapa 3: Editar nome da conta', 
        description: "",
        description2:'',
        img: '',
        imgLong: 'tutorial-metamask-21',
    },
    {
        id: 13, 
        title: 'Etapa 4: Conseguir Sepólia', 
        description: "Sepolia é a moeda virtual necessária para realizarmos as transações no sistema. Você tem 2 maneiras de conseguir Sepolia para testes.",
        description2:'Pelo site que vai estar abaixo das imagens (Imediato), ou então solicitando para nossa equipe (Pode ser que demore algumas horas para que nossa equipe envie sepolia para você)',
        img: '',
        imgLong: 'tutorial-metamask-22',
        link: 'https://sepoliafaucet.com/'
    },
    {
        id: 14, 
        title: 'Etapa 5: Sincronizar conta', 
        description: "Pronto agora é só sincronizar a conta do MetaMask com o sistema e concluir o cadastro do seu usuário",
        description2:'Com a página do sistema aberta, abra o MetaMask para conectar sua conta com a V4 do sistema. *link do sistema abaixo:',
        img: '',
        imgLong: 'tutorial-metamask-23',
        link: 'https://v4-sintrop.netlify.app'
    },
    {
        id: 15, 
        title: 'Etapa 5: Sincronizar conta', 
        description: "Pronto agora é só sincronizar a conta criada com o sistema e concluir o cadastro do seu usuário",
        description2:'Com a página do sistema aberto, abra o metaMask para sincronizar. *link do sistema abaixo:',
        img: '',
        imgLong: 'tutorial-metamask-24',
        link: 'https://v4-sintrop.netlify.app'
    },
];
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
    // {
    //     id: 17, 
    //     title: 'PARABÉNS INSPEÇÃO CONCLUÍDA', 
    //     description: "Clicando em “EM HISTÓRICO DE INSPEÇÕES” Você consegue acompanhar todos os detalhes da sua inspeção.",
    //     description2:'',
    //     img: '',
    //     imgLong: 'tutorial-req-inspection-5',
    // }
];
const tutorialAcceptInspection = [
    {
        id: 1, 
        title: 'Missão 2: Aceitar uma inspeção', 
        description: "A segunda missão é aceitar uma inspeção de um produtor, que você consiga ir até a propriedade dele.",
        description2:'Ao concluir você será promovido a SARGENTO MUDA.',
        img: 'formiga-muda',
        imgLong: '',
    },
    {
        id: 12, 
        title: 'Missão 2: Aceitar uma inspeção', 
        description: "Primeiro clique no menu lateral na opção 'Gerenciar Inspeções'",
        description2:'Nessa página você terá acesso a todas as inpeções NÃO concluidas do sistema',
        img: '',
        imgLong: 'tutorial-accept-inspection-1',
    },
    {
        id: 13, 
        title: 'Missão 2: Aceitar uma inspeção', 
        description: "Você só pode aceitar inspeções que esteja com o status 'ABERTA' e que seja de seu alcance se deslocar até a propriedade!",
        description2:"Depois clique no botão 'Aceitar Inspeção', no canto direito da inspeção desejada",
        img: '',
        imgLong: 'tutorial-accept-inspection-2',
    },
    {
        id: 14, 
        title: 'Missão 2: Aceitar uma inspeção', 
        description: "Finalize a transação, clicando no botão “CONFIRMAR” no METAMASK",
        description2:'',
        img: '',
        imgLong: 'tutorial-accept-inspection-3',
    }
];

export function ModalTutorial(){
    const {chooseModalTutorial, user, userData} = useMainContext();
    const [step, setStep] = useState(1);
    const [tutorial, setTutorial] = useState([]);
    const [modalRequestSepolia, setModalRequestSepolia] = useState(false);

    useEffect(() => {
        if(user === '0'){
            setTutorial(tutorial1);
        }
        if(user === '1' && userData?.level === 1){
            setTutorial(tutorialRequestInspection);
        }
        if(user === '2' && userData?.level === 1){
            setTutorial(tutorialAcceptInspection);
        }
    },[user, userData])

    if(tutorial.length === 0){
        return <div/>
    }

    return(
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] fixed inset-0'/>
            <Dialog.Content className='absolute flex flex-col items-center justify-between p-1 lg:p-3 lg:w-[1000px] lg:h-[600px] bg-green-800 rounded-md m-auto inset-0 border-8 border-[#783E19]'>
                <div className='flex items-center justify-between w-full'>
                    <div className='w-[25px]'/>
                    <img
                        src={require('../../assets/logo-branco.png')}
                        className='w-[120px] object-contain'
                    />
                    <Dialog.Trigger>
                        <TbArrowsDiagonalMinimize2 size={25} color='white'/>
                    </Dialog.Trigger>
                </div>

                <div className='flex flex-col items-center overflow-auto pb-10'>
                    <div className='flex flex-col items-center w-full' key={tutorial[step - 1]?.id}>
                        <div className='flex flex-col w-full h-full items-center justify-between px-1 lg:px-6'>
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
                                    className='w-full object-contain'
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

                    {tutorial[step - 1]?.title === 'Etapa 4: Conseguir Sepólia' && (
                        <button 
                            className='px-3 py-2 bg-blue-500 text-white font-bold rounded-md mt-[-20px]'
                            onClick={() => {
                                setModalRequestSepolia(true);
                            }}
                        >
                            Solicitar Sepolia
                        </button>
                    )}
                </div>
            </Dialog.Content>

            <ToastContainer
                position='top-center'
            />

            <Dialog.Root
                open={modalRequestSepolia}
                onOpenChange={(open) => setModalRequestSepolia(open)}
            >
                <ModalRequestSepolia
                    close={() => {
                        setModalRequestSepolia(false);
                        toast.success('SepoliaETH requisitado com sucesso! O quanto antes a nossa equipe enviará seus SepoliaETH.')
                    }}
                />
            </Dialog.Root>
        </Dialog.Portal>
    )
}