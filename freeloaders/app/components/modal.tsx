import { ReactNode } from 'react';
import styled from 'styled-components';
import { X } from "@phosphor-icons/react/dist/ssr/X"

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContainer = styled.div`
    background: ${p => p.theme.color.white};
    padding: 2rem;
    border-radius: 8px;
    width: 40vw;
    max-width: 90%;
    position: relative;
    text-align: center;
    font-family: ${p => p.theme.font.content};
`;

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 5px;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color ${p => p.theme.transition.default};
    &:hover { background-color: ${p => p.theme.background.hover.dark}; }
`;

const XStyled = styled(X)`
    size: 1.5rem;
    color: ${p => p.theme.color.default};
`

const ModalTitle = styled.h2`
    font-size: 2.125rem;
    font-weight: ${p => p.theme.weight.bold};
    color: ${p => p.theme.color.accent}; 
    margin-bottom: 1rem;
    font-family: ${p => p.theme.font.heading}; 
`;


interface ModalProps {
    title: string;
    children: ReactNode;
    view: boolean;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = (props) => {
    const { title, children, view, onClose, ...rest } = props;

    return view ? (
        <ModalOverlay onClick={onClose} {...rest}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={onClose}><XStyled /></CloseButton>
                <ModalTitle>{title}</ModalTitle>
                {children}
            </ModalContainer>
        </ModalOverlay>
    ) : <></>
};

export default Modal;
