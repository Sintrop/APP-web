import React, {useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';

export function ModalChooseMethod({finishInspection}){
    const [step, setStep] = useState(1);

    return(
        <Dialog.Portal className='flex justify-center items-center inset-0'>
            <Dialog.Overlay className='bg-[rgba(0,0,0,0.6)] fixed inset-0'/>
            <Dialog.Content className='absolute flex flex-col items-center justify-between p-3 lg:w-[500px] h-[500px] bg-white rounded-md m-auto inset-0'>
                <Dialog.Title>Método de inspeção</Dialog.Title>

                {step === 1 && (
                    <div className="flex flex-col items-center">
                        <h1 className="font-bold text-black text-2xl text-center">Qual método gostaria de usar na inspeção?</h1>

                        <div className="flex mt-10">
                            <div className="flex items-center gap-5 rounded-md border-2 p-2">
                                <img
                                    src={require('../assets/token.png')}
                                    className="w-[100px] h-[100px] object-contain border-2 border-green-700 rounded-full"
                                />

                                <div className="flex flex-col gap-3">
                                    <p className="font-bold text-green-700">Método Phoenix</p>
                                    <button
                                        onClick={() => setStep(2)}
                                        className='px-2 py-1 border-2 rounded-md border-green-700 font-bold text-green-700 '
                                    >
                                        Escolher
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="flex flex-col items-center">
                        <h1 className="font-bold text-black text-2xl text-center">Instruções</h1>

                        <div className="flex flex-col lg:w-[320px] gap-2 mt-5">
                            <p>1º | Baixe nosso app no seu celular;</p>
                            <p>2º | Faça login com sua carteira e senha;</p>
                            <p>3º | Localize a inspeção e salve em seu dispositivo;</p>
                            <p>4º | Vá até a propriedade do produtor, preencha todas as informações e finalize a inspeção no celular;</p>
                            <p>5º | Em um local com internet, salve as informações do seu celular em nosso servidor;</p>
                            <p>6º | Volte aqui na plataforma e finalize a inspeção, clicando no botão abaixo:</p>
                        </div>
                    </div>
                )}

                <div className='flex items-center gap-3'>
                    {step !== 1 && (
                        <Dialog.Close 
                            onClick={() => setStep(1)}
                            className="px-4 py-2 font-bold text-white rounded-md bg-[#ff9900]"
                        >
                            Entendi
                        </Dialog.Close>
                    )}
                    {step === 2 && (
                        <button 
                            className="px-4 py-2 font-bold text-white rounded-md bg-[#ff9900]"
                            onClick={finishInspection}
                        >
                            Finalizar Inspeção
                        </button>
                    )}
                </div>
            </Dialog.Content>
        </Dialog.Portal>
    )
}