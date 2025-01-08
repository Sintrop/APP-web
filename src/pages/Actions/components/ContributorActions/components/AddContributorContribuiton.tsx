import React, {useState} from "react";
import { save } from "../../../../../config/infura";
import { ActivityIndicator } from "../../../../../components/ActivityIndicator/ActivityIndicator";
import { toast } from "react-toastify";
import { ModalWhereExecuteTransaction } from "../../../../../components/ModalWhereExecuteTransaction/ModalWhereExecuteTransaction";

interface Props{
    close: () => void;
}
export function AddContributorContribuiton({close}: Props){
    const [loading, setLoading] = useState(false);
    const [pathPDF, setPathPDF] = useState('');
    const [showModalWhereExecuteTransaction, setShowModalWhereExecuteTransaction] = useState(false);
    const [additionalData, setAdditionalData] = useState({});

    async function getPath(file: Uint8Array) {
        setLoading(true);
        const path = await save(file);
        setPathPDF(path as string);
        setLoading(false);
    }

    function handleSend(){
        if(pathPDF === ''){
            toast.error('anexeArquivo');
            return;
        };
        
        setAdditionalData({contributionHash: pathPDF})
        setShowModalWhereExecuteTransaction(true);
    }

    function handleSuccess(type: string){
        if(type === 'blockchain'){
            close();
        }
    }

    return(
        <div className="mt-10">
            <h3 className='font-bold text-white text-center text-lg'>Relatório de contribuição</h3>

            <div className='w-full'>
                <label className='text-white'>Escolha um arquivo:</label>
                <input  
                    className='text-white w-full overflow-hidden'
                    type='file'
                    onChange={(e) => {
                        if(e.target.files){
                            const file = e?.target?.files[0];
                            const reader = new window.FileReader();
                            reader.readAsArrayBuffer(file);
                            reader.onload = () => {
                                const arrayBuffer = reader.result
                                const file = new Uint8Array(arrayBuffer as ArrayBuffer);
                                getPath(file);
                            };
                        }
                    }}
                    accept='application/pdf'
                />
            </div>
            
            <button
                className='font-bold text-white px-3 py-2 bg-[#2c96ff] rounded-lg w-full mt-5'
                onClick={handleSend}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator size={25}/>
                ) : 'Enviar'}
            </button>

            {showModalWhereExecuteTransaction && (
                <ModalWhereExecuteTransaction
                    close={() => setShowModalWhereExecuteTransaction(false)}
                    success={handleSuccess}
                    additionalData={JSON.stringify(additionalData)}
                    transactionType="addContributorContribution"
                />
            )}
            
        </div>
    );
}
