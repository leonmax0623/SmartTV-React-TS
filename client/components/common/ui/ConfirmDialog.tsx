import React from 'react';
import Modal from 'client/components/common/ui/Modal';
import {DialogContent, DialogActions} from '@material-ui/core';
import Button from '@material-ui/core/Button';

interface IConfirmDialogProps {
	isOpen: boolean;
	cancel?: React.ReactChild;
	ok?: React.ReactChild;
	onCancel?: () => void;
	onConfirm?: () => void;
	title?: string;
}

const ConfirmDialog: React.FC<IConfirmDialogProps> = ({
	isOpen,
	title,
	children,
	cancel,
	ok,
	onCancel,
	onConfirm,
}) => {
	const handleCancel = () => {
		if (onCancel) onCancel();
	};
	const handleConfirm = () => {
		if (onConfirm) onConfirm();
	};

	return (
		<Modal title={title} isOpen={isOpen} onClose={handleCancel}>
			{!!children && <DialogContent>{children}</DialogContent>}

			{(!!cancel || !!ok) && (
				<DialogActions>
					{!!cancel && cancel}

					{!!ok && ok}
				</DialogActions>
			)}
			{!cancel && !ok && (
				<DialogActions>
					<Button onClick={handleCancel}>Нет</Button>

					<Button
						variant="contained"
						color="primary"
						type="submit"
						onClick={handleConfirm}
					>
						Да
					</Button>
				</DialogActions>
			)}
		</Modal>
	);
};

export default ConfirmDialog;
