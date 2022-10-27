import {Meteor} from 'meteor/meteor';
import React from 'react';
import Modal from 'client/components/common/ui/Modal';
import {Formik, FormikActions} from 'formik';
import {IVideoHosting} from 'shared/collections/VideoHosting';
import {DialogActions, DialogContent, Typography} from '@material-ui/core';
import Input from 'client/components/common/ui/Input';
import Button from '@material-ui/core/Button';
import {methodNames} from 'shared/constants/methodNames';

interface IVideoRenameDialog {
	isOpened: boolean;
	onClose: () => void;
	video: IVideoHosting | null;
}

const VideoRenameDialog: React.FC<IVideoRenameDialog> = ({isOpened, onClose, video}) => {
	if (!video?._id) {
		return <></>;
	}
	const formInitialValues = {
		name: video.name || '',
	};
	const handleClose = () => {
		if (onClose) {
			onClose();
		}
	};

	const onSubmit = ({name}: {name: string}, actions: FormikActions<{name: string}>) => {
		Meteor.call(
			methodNames.videoHosting.renameVideo,
			{name, _id: video._id},
			(error: Error | Meteor.Error) => {
				actions.setFormikState({isSubmitting: false});
				if (error) {
					actions.setErrors({name: error.message});
					return;
				}
				handleClose();
			},
		);
	};

	return (
		<Modal title="Переименовать видео" isOpen={isOpened} onClose={handleClose}>
			<Formik onSubmit={onSubmit} initialValues={formInitialValues}>
				{({handleSubmit, isSubmitting}) => (
					<form onSubmit={handleSubmit}>
						<DialogContent>
							<Typography gutterBottom>Название видео</Typography>
							<Input
								name="name"
								label=""
								placeholder="Название видео"
								inputProps={{autoFocus: true}}
							/>
						</DialogContent>
						<DialogActions>
							<Button onClick={onClose}>Отменить</Button>

							<Button
								variant="contained"
								color="primary"
								type="submit"
								disabled={isSubmitting}
							>
								Сохранить
							</Button>
						</DialogActions>
					</form>
				)}
			</Formik>
		</Modal>
	);
};

export default VideoRenameDialog;
