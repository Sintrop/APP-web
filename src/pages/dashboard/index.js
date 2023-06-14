import React, {useEffect, useState, useContext} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import './dashboard.css';
import { MainContext } from '../../contexts/main';
import * as Dialog from '@radix-ui/react-dialog';
import { useNetwork } from '../../hooks/useNetwork';

//Components
import Menu from '../../components/Menu';
import ManageInspections from '../../components/Tabs/ManageInspections';
import { TopBarStatus } from '../../components/TopBarStatus';
import { TopBarMobile } from '../../components/TopBarMobile';
import { ModalTutorial } from '../../components/Tutorial/ModalTutorial';
import { Assistent } from '../../components/Assistent';
import { ModalFeedback } from '../../components/ModalFeedback';

//Tabs
import Register from '../../components/Tabs/Register';
import ISA from '../../components/Tabs/ISA';
import ProducerRanking from '../../components/Tabs/Ranking/Producer';
import MyAccount from '../../components/Tabs/MyAccount';
import ProducerCertificate from '../../components/Tabs/Certificate';
import InvestorCertificate from '../../components/Tabs/Certificate/Investor';
import DevelopersPool from '../../components/Tabs/Pools/Developers';
import ReportsPage from '../../components/Tabs/Reports';
import ProducersPool from '../../components/Tabs/Pools/Producers';
import ResearchesPage from '../../components/Tabs/Researches';
import { UserDetails } from '../../components/Tabs/UserDetails';
import { NetworkImpact } from '../../components/Tabs/NetworkImpact';

//Services
import CheckUserRegister from '../../services/checkUserRegister';
import HistoryInspections from '../../components/Tabs/HistoryInspections';
import ActivistRanking from '../../components/Tabs/Ranking/Activist';
import DevelopersRanking from '../../components/Tabs/Ranking/Developers';
import ContributorsRanking from '../../components/Tabs/Ranking/Contributors';
import InvestorRanking from '../../components/Tabs/Ranking/Investor';
import ResearchersRanking from '../../components/Tabs/Ranking/Researchers';
import AdvisorsRanking from '../../components/Tabs/Ranking/Advisors';
import ModalRegister from '../../components/ModalRegister';

const tutorialRegistro = [
    {
        id: 11, 
        title: 'Etapa 5: Registro no sistema', 
        description: "Agora chegou a hora de realizar a sua primeira transação no Sistema e realizar o cadastro. Qual usuário você vai ser?",
        description2:'Neste momento vamos registrar como PRODUTOR',
        img: '',
        imgLong: 'tutorial-registro-1',
    },
    {
        id: 12, 
        title: 'Etapa 5: Tire uma foto', 
        description: "Esta foto será usada para comprovar sua identidade.",
        description2:'É necessário dá permissão para acessar a câmera!',
        img: '',
        imgLong: 'tutorial-registro-2',
    },
    {
        id: 13, 
        title: 'Etapa 5: Tire uma foto', 
        description: "Esta foto será usada para comprovar sua identidade.",
        description2:'É necessário dá permissão para acessar a câmera!',
        img: '',
        imgLong: 'tutorial-registro-2',
    },
    {
        id: 14, 
        title: 'Etapa 5: Forneça seus dados', 
        description: "Nessa etapa os dados variam para cada tipo de usuário.",
        description2:'Cadastre seus dados e certifique-se de que estão corretos, pois não poderá ser alterado no futuro.',
        img: '',
        imgLong: 'tutorial-registro-3',
    },
    {
        id: 15, 
        title: 'Etapa 5: Área da propriedade (APENAS PARA PRODUTORES)', 
        description: "Autorize a sua localização atual para visualização do mapa.",
        description2:'A localização é essencial, e não podemos prosseguir sem ela!',
        img: '',
        imgLong: 'tutorial-registro-4',
    },
    {
        id: 16, 
        title: 'Etapa 5: Área da propriedade (APENAS PARA PRODUTORES)', 
        description: "Circule toda a área da sua propriedade.",
        description2:'Clique numa das extremidades da propriedade, e vá clicando nos limites da propriedade, até fechar o círculo da sua área. Sem isso não podemos prosseguir! Ao final do processo, clique em registrar',
        img: '',
        imgLong: 'tutorial-registro-5',
    },
    {
        id: 17, 
        title: 'Etapa 5: Finalizar transação', 
        description: "Finalize a transação, clicando no botão “CONFIRMAR” no Metamask. Lembrando que é necessário ter sepolia o suficiente para realizar a transação.",
        description2:'Lembre-se, que toda transação feita na Blockchain, demora alguns segundos e até mesmo minutos, mas o importante é não fechar a aba do navegador.',
        img: '',
        imgLong: 'tutorial-registro-6',
    },
    {
        id: 18, 
        title: 'Etapa 5: Transação bem-sucedida', 
        description: "Sua transação foi bem sucedida, você pode clicar no link para visualizar mais detalhes.",
        description2:'Com isso, significa que você concluiu seu cadastro!',
        img: '',
        imgLong: 'tutorial-registro-7',
    },
    {
        id: 19, 
        title: '', 
        description: "",
        description2:'',
        img: '',
        imgLong: '',
        banner: 'tutorial-registro-8'
    },
];

export default function Dashboard(){
    const {isSupported} = useNetwork();
    const {checkUser, modalRegister, chooseModalRegister, menuOpen, modalTutorial, chooseModalTutorial, modalFeedback, chooseModalFeedBack} = useContext(MainContext);
    const navigate = useNavigate();
    const {walletAddress, tabActive, typeUser} = useParams();
    const [activeTab, setActiveTab] = useState('isa');
    const {user} = CheckUserRegister({walletAddress: walletAddress});
    const [walletSelect, setWalletSelect] = useState('');
    const [menuMobile, setMenuMobile] = useState(false);
    const [assistentOpen, setAssistentOpen] = useState(true);

    useEffect(() => {
        async function checkConnection(){
            if(window.ethereum){
                await window.ethereum.request({
                    method: 'eth_accounts'
                })
                .then((accounts) => {
                    if(accounts.length == 0){
                        navigate('/')
                    }else{
                        if(accounts[0] != walletAddress){
                            navigate('/')
                        }
                    }
                })
                .catch(() => {
                    console.log('error')
                })
            }
        }
        checkConnection();
        getStorageAssistant();
    },[]);

    useEffect(() => {
        async function check() {
            const response = await checkUser(walletAddress);
            setTimeout(() => {
                if(response === '0'){
                    chooseModalRegister()
                }
            }, 1000)
        }
        check();
    }, []);

    async function getStorageAssistant(){
        const res = await localStorage.getItem('assistantOpen')
        if(res === null){
            setAssistentOpen(true);
        }else{
            if(res === '1'){
                setAssistentOpen(true);
            }else{
                setAssistentOpen(false);
            }
        }
    }

    return(
        <div className='flex flex-col lg:flex-row w-[100vw] h-[100vh]'>
            <TopBarStatus/>

            <div className='hidden lg:flex'>
                <Menu 
                    changeTab={(tab) => {
                        setActiveTab(tab)
                        if(tab === 'my-account'){
                            navigate(`/dashboard/${walletAddress}/${tab}/${typeUser}/${walletAddress}`)
                        }else{
                            navigate(`/dashboard/${walletAddress}/${tab}/${typeUser}/n`)
                        }
                    }}
                />
            </div>

            {menuMobile && (
                <div className='flex lg:hidden'>
                <Menu 
                    changeTab={(tab) => {
                        setMenuMobile(false)
                        setActiveTab(tab)
                        if(tab === 'my-account'){
                            navigate(`/dashboard/${walletAddress}/${tab}/${typeUser}/${walletAddress}`)
                        }else{
                            navigate(`/dashboard/${walletAddress}/${tab}/${typeUser}/n`)
                        }
                    }}
                />
                </div>
            )}

            <TopBarMobile
                toggleMenu={() => setMenuMobile(!menuMobile)}
                openMenu={menuMobile}
            />
        <div 
            className={`flex flex-col pb-52 lg:mt-11 w-full ${menuOpen ? 'lg:ml-[320px]' : 'lg:ml-[80px]'} overflow-hidden`} 
        >

            <div className='w-[100%] h-[100%]'>
                {activeTab === 'register' && (
                    <Register 
                        wallet={walletAddress}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}

                {activeTab === 'isa' && (
                    <ISA 
                        user={user} 
                        walletAddress={walletAddress}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}

                {activeTab === 'network-impact' && (
                    <NetworkImpact 
                        user={user} 
                        walletAddress={walletAddress}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}

                {activeTab === 'manage-inspections' && (
                    <ManageInspections 
                        user={user} 
                        walletAddress={walletAddress}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}
                {activeTab === 'inspection-history' && (
                    <HistoryInspections 
                        user={user} 
                        walletAddress={walletAddress}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}
                {activeTab === 'producers' && (
                    <ProducerRanking 
                        user={user} 
                        walletAddress={walletAddress}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}
                {activeTab === 'activists' && (
                    <ActivistRanking 
                        user={user} 
                        walletAddress={walletAddress}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}
                {activeTab === 'developers' && (
                    <DevelopersRanking 
                        user={user} 
                        walletAddress={walletAddress}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}
                {activeTab === 'contributors' && (
                    <ContributorsRanking 
                        user={user} 
                        walletAddress={walletAddress}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}
                {activeTab === 'investors' && (
                    <InvestorRanking 
                        user={user} 
                        walletAddress={walletAddress}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}
                {activeTab === 'researchers' && (
                    <ResearchersRanking
                        user={user} 
                        walletAddress={walletAddress}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}
                {activeTab === 'advisors' && (
                    <AdvisorsRanking
                        user={user} 
                        walletAddress={walletAddress}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}
                {activeTab === 'my-account' && (
                    <MyAccount 
                        wallet={walletAddress} 
                        userType={user}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}
                {activeTab === 'producer-certificate' && (
                    <ProducerCertificate 
                        userType={user} 
                        wallet={walletAddress}
                        setTab={(tab, wallet) => {
                            setActiveTab(tab)
                        }}
                    />
                )}
                {activeTab === 'investor-certificate' && (
                    <InvestorCertificate 
                        userType={user} 
                        wallet={walletAddress}
                        setTab={(tab, wallet) => {
                            setActiveTab(tab)
                        }}
                    />
                )}

                {activeTab === 'developers-pool' && (
                    <DevelopersPool 
                        user={user} 
                        wallet={walletAddress}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}

                {activeTab === 'producers-pool' && (
                    <ProducersPool 
                        user={user} 
                        wallet={walletAddress}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}

                {activeTab === 'delations' && (
                    <ReportsPage 
                        user={user} 
                        wallet={walletAddress}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}

                {activeTab === 'researches' && (
                    <ResearchesPage 
                        user={user} 
                        wallet={walletAddress}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}

                {activeTab === 'user-details' && (
                    <UserDetails 
                        user={user} 
                        wallet={walletAddress}
                        setTab={(tab, wallet) => {
                            setWalletSelect(wallet)
                            setActiveTab(tab)
                        }}
                    />
                )}
            </div>

            <Dialog.Root
                open={modalRegister}
                onOpenChange={(open) => {
                    chooseModalRegister()
                }}  
            >
                <ModalRegister/>
            </Dialog.Root>

            <Dialog.Root
                open={modalFeedback}
                onOpenChange={(open) => {
                    chooseModalFeedBack()
                }}  
            >
                <ModalFeedback/>
            </Dialog.Root>

            <Dialog.Root
                open={modalTutorial}
                onOpenChange={(open) => {
                    chooseModalTutorial()
                }}  
            >
                <ModalTutorial
                    tutorial={tutorialRegistro}
                    typeUser={typeUser}
                />
            </Dialog.Root>


        </div>
            <div
                className="absolute flex items-center bottom-36 right-10 cursor-pointer w-32 bg-[#ff9900] rounded-md p-2 border-2"
                onClick={() => {
                    chooseModalFeedBack()
                }}
            >
                <p className="text-center text-white">Clique aqui para sugerir uma melhoria</p>
            </div>
            {assistentOpen ? (
                <Assistent
                    close={() => {
                        setAssistentOpen(false)
                        localStorage.setItem('assistantOpen', '0')
                    }}
                />
            ) : (
                <div 
                    className="absolute flex items-center z-90 bottom-5 right-10 cursor-pointer"
                    onClick={() => {
                        setAssistentOpen(true)
                        localStorage.setItem('assistantOpen', '1')
                    }}
                >
                    <div className='p-3 bg-green-800 rounded-l-lg border-2 border-r-0 z-10 mr-[-25px] mt-8 pr-8'>
                        <p className='font-bold text-white'>Posso te ajudar?</p>
                    </div>
                    <img
                        src={require('../../assets/assistente.png')}
                        className='w-24 object-contain z-20'
                    />
                </div>
            )}
        </div>
    )
}