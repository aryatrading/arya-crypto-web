import React, { ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog';
import PaymentCard from './PaymentCard';
import { XMarkIcon } from '@heroicons/react/24/outline';


interface IPaymentModal {
    triggerButton: ReactNode
}

const PaymentModal = ({triggerButton}:IPaymentModal) => {
  return (
    <Dialog.Root>
        <Dialog.Trigger asChild>
            {triggerButton}
        </Dialog.Trigger>
        <Dialog.Portal>
            <Dialog.Overlay className="dialog-overlay data-[state=open]:animate-overlayShow bg-white" />
            <Dialog.Content className="fixed left-0 right-0 overflow-y-scroll md:w-[700px] xl:w-[1000px] lg:overflow-auto bottom-0 top-[60px] md:right-0 md:top-[50%] md:left-1/2 md:translate-x-[-50%] md:translate-y-[-50%] md:h-[600px] xl:h-[750px] md:rounded-lg bg-black-1 z-10 flex flex-col data-[state=open]:animate-contentShow focus:outline-none justify-between rounded-lg">
                <PaymentCard/>
                <Dialog.Close asChild>
                    <button
                        className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full"
                        aria-label="Close"
                    >
                        <XMarkIcon className='h-5 w-5' />
                    </button>
                </Dialog.Close>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
  )
}

export default PaymentModal