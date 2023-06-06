import React, {useState, useEffect, useContext} from "react";
import { useNavigate } from 'react-router-dom';
import { useNetwork } from "../../hooks/useNetwork";
import { MainContext } from "../../contexts/main";
import {useTranslation} from 'react-i18next';
import { ModalChooseLang } from "../../components/ModalChooseLang";
import * as Dialog from '@radix-ui/react-dialog';

import { TopBarStatus } from "../../components/TopBarStatus";
import {ModalTutorial} from '../../components/Tutorial/ModalTutorial';

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

function Login(){
    const {t} = useTranslation();
    const {isSupported} = useNetwork();
    const {Sync, modalChooseLang, toggleModalChooseLang, modalTutorial, chooseModalTutorial} = useContext(MainContext);
    const navigate = useNavigate();

    async function handleSync(){
        const response = await Sync();
        if(response.status === 'connected'){
            navigate(`/dashboard/${response.wallet}/network-impact/main`)
        }
    }

    return(
        <div className="flex flex-col h-[100vh]">
            <TopBarStatus/>
            <div className="flex flex-col lg:flex-row w-full h-full items-center justify-center bg-[#0A4303] overflow-auto pb-16 pt-[300px] px-2 lg:px-0 lg:pt-0 lg:mt-10 lg:pb-0">
                <div className="w-full lg:w-[1000px] lg:h-[600px] flex flex-col lg:flex-row">
                    <div className='flex flex-col justify-between w-full lg:w-[500px]'>
                        <div className='flex flex-col w-full lg:w-[300px]'>
                            <img
                                src={require('../../assets/logo-branco.png')}
                                className="w-[200px] h-[80px] object-contain"
                            />
                            <h1 className="text-[#BBFFB2] font-bold text-2xl">
                                {t('Decentralized Regenerative Agriculture certification system')}
                            </h1>
                        </div>

                        <div className="flex items-center gap-2 my-5 lg:my-0">
                            <a
                                href="https://www.linkedin.com/company/sintrop-sustainability/"
                                target="_blank"
                            >
                                <img
                                    src={require('../../assets/icon-linkedin.png')}
                                    className="w-[40px] h-[40px] object-contain"
                                />
                            </a>

                            <a
                                href="https://api.whatsapp.com/send/?phone=%2B5548988133635&text&type=phone_number&app_absent=0"
                                target="_blank"
                            >
                                <img
                                    src={require('../../assets/icon-whats.png')}
                                    className="w-[40px] h-[40px] object-contain"
                                />
                            </a>

                            <a
                                href="https://www.instagram.com/sintrop.sustentabilidade/"
                                target="_blank"
                            >
                                <img
                                    src={require('../../assets/icon-insta.png')}
                                    className="w-[40px] h-[40px] object-contain"
                                />
                            </a>
                        </div>
                    </div>
                    <div className='flex flex-col justify-center'>
                        <h1 className='font-bold text-white text-3xl mb-3'>{t('Welcome')}</h1>
                        <p className="font-bold text-[#F4A022] text-xl">{t('Our mission is to regenerate the planet')}!</p>
                        <p className="text-white lg:w-[500px]">{t('It will not be easy at all, but it is extremely important because the future of humanity depends on us')}.</p>

                        <div className="lg:w-[500px] flex justify-center items-center">
                            <img
                                src={require('../../assets/formiga.png')}
                                className="object-contain w-[300px]"
                            />
                        </div>

                        <p className="text-white lg:w-[500px]">{t('Será preciso de muita, mas muita gente nessa luta. Por isso estamos buscando pessoas do bem para fazerem parte do Exército da Regeneração. Para se juntar nessa luta, basta concluir a missão 1')}</p>

                        <div className="lg:w-[500px] flex flex-col lg:flex-row justify-center">
                            <button
                                className="lg:w-[300px] h-10 bg-[#A75722] rounded-xl font-bold text-white mt-6"
                                onClick={chooseModalTutorial}
                            >
                                {t('START MISSION 1')}
                            </button>
                        </div>
                    </div>
                </div>

                <Dialog.Root
                    open={modalChooseLang}
                    onOpenChange={() => toggleModalChooseLang()}
                >
                    <ModalChooseLang/>
                </Dialog.Root>

                <Dialog.Root
                    open={modalTutorial}
                    onOpenChange={chooseModalTutorial}
                >
                    <ModalTutorial
                        tutorial={tutorial1}
                    />
                </Dialog.Root>
            </div>
        </div>
    )
}

export default Login;