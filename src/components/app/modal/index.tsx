import { ReactNode } from 'react';
import { Modal as ModalComponent, ModalProps } from 'flowbite-react';

interface ModalTypes extends ModalProps {
    isVisible: boolean,
    position?: 'center' | 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right',
    children: ReactNode,
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl',
};

export const Modal = ({ isVisible, position, children, size, ...props }: ModalTypes) => {
    return (
        <ModalComponent show={isVisible} position={position || 'center'} size={size || 'lg'} {...props} className='bg-[#fff3] h-[100%] z-50'>
            {children}
        </ModalComponent>
    );
};