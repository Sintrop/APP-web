import React, {useState, useEffect} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useMainContext } from '../../hooks/useMainContext';

const tutorial1 = [
    {
        id: 1, 
        title: 'Missão 1: Entrar na plataforma', 
        description: 'A primeira missão é a conclusão do cadastro. Essa missão é bem difícil, envolve o uso de algumas tecnologias que talvez sejam novas para você. Mas não se assuste, basta seguir os passos aqui certinho que você vai conseguir!',
        description2: 'Ao concluir você se tornará um SOLDADO SEMENTE',
        img: 'formiga-semente-1',
        imgLong: ''
    },
    {
        id: 2, 
        title: 'Missão 1: Entrar na plataforma', 
        description: 'Essa missão possui 5 etapas:',
        description2: '1) Criar uma carteira no MetaMask; 2) Configurações do MetaMask; 3) Entrar na plataforma; 4) Conseguir goerliETH; 5) Registrar usuário',
        img: 'formiga-semente-1',
        imgLong: ''
    },
    {
        id: 3, 
        title: 'Etapa 1: Criar carteira no MetaMask', 
        description: 'Nosso sistema utiliza a tecnologia da blockchain. E para interagir com ele, é necessário possuir uma carteira na rede Ethereum e o provedor mais popular é o MetaMask.',
        description2: 'É por ela que será feita a distribuição dos tokens como pagamento aos serviços ambientais ecossistêmicos prestados para a sociedade. Pense que essa etapa seria o equivalente a abertura de uma conta no banco. Porém no universo descentralizado.',
        img: '',
        imgLong: ''
    },
    {
        id: 4, 
        title: 'Etapa 1: Criar carteira no MetaMask', 
        description: 'Vá até a loja de extensões do seu navegador e faça a instalação do MetaMask. Fique atento para apenas instalar a extensão com o nome correto, com o selo azul de verificação e do site metamask.io',
        description2: 'É por ela que será feito. Nunca baixe nenhuma extensão sem ser da fonte original confiável.',
        img: '',
        imgLong: 'tutorial-metamask-1'
    },
    {
        id: 5, 
        title: 'Etapa 1: Criar carteira no MetaMask', 
        description: 'Após a instalação, o MetaMask irá perguntar se você deseja importar uma conta ou criar uma do zero. Caso já tenha uma, poderá importá-la nessa parte. Caso contrário, clique em criar uma carteira.',
        description2:'',
        img: '',
        imgLong: 'tutorial-metamask-2'
    },
    {
        id: 6, 
        title: 'Etapa 2: Configurações do MetaMask', 
        description: 'Parabéns, você está indo muito bem até aqui. Agora vamos para as configurações do MetaMask. Sua tela inicial deverá ser algo semelhante a essa:',
        description2:'',
        img: '',
        imgLong: 'tutorial-metamask-3'
    },
    {
        id: 7, 
        title: 'Etapa 2: Configurações do MetaMask', 
        description: 'O primeiro passo será selecionar a rede de testes Sepolia.',
        description2:'No menu superior, clique onde a seta está indicando',
        img: '',
        imgLong: 'tutorial-metamask-4'
    },
    {
        id: 8, 
        title: 'Etapa 2: Configurações do MetaMask', 
        description: 'Agora selecione a "Sepolia Test Network". E pronto, você já estará conectado devidamente. Caso ela não apareça, vá até configurações -> avançado e habilite a opção.',
        description2:'',
        img: '',
        imgLong: 'tutorial-metamask-5'
    },
    {
        id: 9, 
        title: 'Etapa 3: Conseguir SepoliaETH faucet', 
        description: "A SEPOLIA FAUCET é uma rede de testes que simula a rede principal do Ethereum. Para realizar alguma ação no Sistema é preciso ter SEPOLIA, o que seria equivalente a ter Ether se fosse na rede principal. Portanto todos valores e dados nela são 'faucets' de apenas exemplo e não possuem valor real.",
        description2:'Não é necessário pagar nada para rodar o sistema na SEPOLIA. Para conseguir os faucets é muito fácil, basta criar uma conta na Alchemy e solicitar os tokens.',
        img: '',
        imgLong: '',
        link: 'https://sepoliafaucet.com/'
    },
    {
        id: 10, 
        title: 'Parabéns!!!', 
        description: "Você está indo muito bem, parabéns pelo progresso!",
        description2:'Já estamos prontos para sincronizar na plataforma. Se a barra superior indicar que a conexão está disponível, pode clicar no botão sincronizar.',
        img: '',
        imgLong: 'tutorial-metamask-6',
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

export function ModalTutorial(){
    const {chooseModalTutorial, user, userData} = useMainContext();
    const [step, setStep] = useState(1);
    const [tutorial, setTutorial] = useState([]);

    useEffect(() => {
        if(user === '0'){
            setTutorial(tutorial1);
        }
        if(user === '1' && userData?.level === 1){
            setTutorial(tutorialRequestInspection);
        }
    },[user, userData])

    if(tutorial.length === 0){
        return <div/>
    }

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