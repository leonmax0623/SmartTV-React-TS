import React from 'react';
import Modal from 'client/components/common/ui/Modal';

interface ICheckoutResultModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const CheckoutResultModal: React.FC<ICheckoutResultModalProps> = ({isOpen, onClose, children}) => {
	return (
		<Modal onClose={onClose} isOpen={isOpen}>
			{children}
		</Modal>
	);
};

export default CheckoutResultModal;
