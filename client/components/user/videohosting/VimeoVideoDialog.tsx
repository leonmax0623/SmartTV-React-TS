import React from 'react';
import Vimeo from '@u-wave/react-vimeo';
import {Dialog} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

interface IVimeoVideoDialogProps {
	video: string;
	onClose: () => void;
	isOpened: boolean;
	title: string;
}
const VimeoVideoDialog: React.FC<IVimeoVideoDialogProps> = ({video, title, onClose, isOpened}) => {
	const handleClose = () => {
		if (onClose) {
			onClose();
		}
	};

	return (
		<Dialog
			title={title}
			open={isOpened}
			onClose={handleClose}
			maxWidth={'md'}
			fullWidth={true}
		>
			<IconButton
				aria-label="Close"
				onClick={onClose}
				style={{
					position: 'absolute',
					top: '10px',
					right: '10px',
					backgroundColor: '#3F51B5',
				}}
			>
				<CloseIcon style={{color: '#FFFFFF'}} />
			</IconButton>
			<Vimeo
				video={video}
				controls={true}
				autoplay={true}
				height={'540px'}
				style={{width: '100%'}}
			/>
		</Dialog>
	);
};

export default VimeoVideoDialog;
