import React, {useState} from "react";
import * as Dialog from '@radix-ui/react-dialog';
import { ModalFeedback } from "./ModalFeedback";
import { ToastContainer, toast } from "react-toastify";

export function Feedback(){
    const [modal, setModal] = useState(false);

    return(
        <div>

            <Dialog.Root open={modal} onOpenChange={(open) => setModal(open)}>
                <Dialog.Trigger className="absolute left-5 bottom-5 h-10 bg-red-500 font-bold text-white rounded-md px-5">
                    Feedback
                </Dialog.Trigger>
                <ModalFeedback
                    close={() => setModal(false)}
                    success={() => toast.success('Feedback enviado com sucesso!')}
                />
            </Dialog.Root>

            <ToastContainer/>
        </div>
    )
}