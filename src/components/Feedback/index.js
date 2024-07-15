import React, {useState} from "react";
import * as Dialog from '@radix-ui/react-dialog';
import { ModalFeedback } from "./ModalFeedback";
import { ToastContainer, toast } from "react-toastify";
import { MdOutlineFeedback } from "react-icons/md";

export function Feedback(){
    const [modal, setModal] = useState(false);

    return(
        <div>
            <Dialog.Root open={modal} onOpenChange={(open) => setModal(open)}>
                <Dialog.Trigger
                    className="flex items-center gap-5 justify-end px-2 h-10 w-[140px] bg-red-500 absolute bottom-10 left-[-95px] hover:left-0 duration-500 rounded-r-md text-white font-bold"
                >
                    Feedback
                    <MdOutlineFeedback color='white' size={20}/>
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