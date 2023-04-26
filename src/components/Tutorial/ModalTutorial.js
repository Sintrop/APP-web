import React, {useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';

export function ModalTutorial(){
    const [step, setStep] = useState(1);

    const tutorial1 = [
        {
            id: 1, 
            title: 'Etapa 1: Entrar na plataforma', 
            description: 'A primeira missão é a conclusão do cadastro. Essa missão é bem difícil, envolve o uso de algumas tecnologias que talvez sejam novas para você. Mas não se assuste, basta seguir os passos aqui certinho que você vai conseguir!',
            description2: 'Ao concluir você se tornará um SOLDADO SEMENTE',
            img: 'formiga-semente-1',
            imgLong: ''
        },
        {
            id: 2, 
            title: 'Etapa 1: Entrar na plataforma', 
            description: 'Essa missão possui 5 etapas:',
            description2: '1) Criar uma carteira no MetaMask; 2) Configurações do MetaMask; 3) Entrar na plataforma; 4) Conseguir goerliETH; 5) Registrar usuário',
            img: 'formiga-semente-1',
            imgLong: ''
        },
        {
            id: 3, 
            title: 'Etapa 1: Entrar na plataforma', 
            description: 'Nosso sistema utiliza a tecnologia da blockchain. E para interagir com ele, é necessário possuir uma carteira na rede Ethereum e o provedor mais popular é o MetaMask.',
            description2: 'É por ela que será feita a distribuição dos tokens como pagamento aos serviços ambientais ecossistêmicos prestados para a sociedade. Pense que essa etapa seria o equivalente a abertura de uma conta no banco. Porém no universo descentralizado.',
            img: '',
            imgLong: ''
        },
        {
            id: 4, 
            title: 'Etapa 1: Entrar na plataforma', 
            description: 'Vá até a loja de extensões do seu navegador e faça a instalação do MetaMask. Fique atento para apenas instalar a extensão com o nome correto, com o selo azul de verificação e do site metamask.io',
            description2: 'É por ela que será feito. Nunca baixe nenhuma extensão sem ser da fonte original confiável.',
            img: '',
            imgLong: 'tutorial-metamask-1'
        },
        {
            id: 5, 
            title: 'Etapa 1: Entrar na plataforma', 
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
            description: 'O primeiro passo será selecionar a rede de testes Goerli.',
            description2:'No menu superior, clique na seta indicada pelo círculo vermelho na imagem:',
            img: '',
            imgLong: 'tutorial-metamask-4'
        },
        {
            id: 8, 
            title: 'Etapa 2: Configurações do MetaMask', 
            description: 'Agora selecione a "Goerli Test Network". E pronto, você já estará conectado devidamente. Caso ela não apareça, vá até configurações -> avançado e habilite a opção.',
            description2:'',
            img: '',
            imgLong: 'tutorial-metamask-5'
        },
        {
            id: 9, 
            title: 'Etapa 3: Entrar na plataforma', 
            description: 'Você está indo muito bem, parabéns pelo progresso!',
            description2:'Já estamos prontos para sincronizar na plataforma. Se a barra superior indicar que a conexão está disponível, pode clicar no botão sincronizar.',
            img: '',
            imgLong: 'tutorial-metamask-6'
        },
    ];

    return(
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] fixed inset-0'/>
            <Dialog.Content className='absolute flex flex-col items-center justify-between p-3 w-[450px] h-[600px] bg-green-800 rounded-md m-auto inset-0 border-8 border-[#783E19]'>
                <img
                    src={require('../../assets/logo-branco.png')}
                    className='w-[120px] object-contain'
                />

                <div className='flex flex-col items-center'>
                    <div className='flex flex-col bg-folha-papiro bg-contain bg-no-repeat lg:w-[350px] lg:h-[500px] z-0'>
                        
                        <div className='flex flex-col items-center w-full h-full' key={tutorial1[step - 1]?.id}>
                            <div className='flex flex-col w-full h-full items-center justify-between py-16 px-6'>
                                    <div>
                                        <h1 className='font-bold text-center text-green-700'>{tutorial1[step - 1]?.title}</h1>
                                        <h2 className='text-center mt-3'>{tutorial1[step - 1]?.description}</h2>
                                        <h3 className='text-center mt-3'>{tutorial1[step - 1]?.description2}</h3>
                                    </div>
                                    {tutorial1[step - 1]?.img !== '' && (
                                        <img
                                            src={require(`../../assets/${tutorial1[step - 1]?.img}.png`)}
                                            className='w-[90px] object-contain'
                                        />
                                    )}
                                    {tutorial1[step - 1]?.imgLong !== '' && (
                                        <img
                                            src={require(`../../assets/${tutorial1[step - 1]?.imgLong}.png`)}
                                            className='w-full max-h-[250px] object-contain'
                                        />
                                    )}
                            </div>
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
                            if(step < tutorial1.length)setStep(step + 1)
                        }}
                    >
                        Prosseguir
                    </button>
                </div>
            </Dialog.Content>
        </Dialog.Portal>
    )
}