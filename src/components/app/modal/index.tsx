import { ReactNode } from 'react';
import { Modal as ModalComponent, ModalProps } from 'flowbite-react';

interface ModalTypes extends ModalProps {
    isVisible: boolean,
    position?: 'center' | 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right',
    children: ReactNode,
    size?: 'sm' | 'md' | 'lg' | 'xlg',
};

export const Modal = ({ isVisible, position, children, size, ...props }: ModalTypes) => {
    return (
        <ModalComponent show={isVisible} position={position || 'center'} size={size || 'lg'} {...props}>
            {children}
        </ModalComponent>
    );
};