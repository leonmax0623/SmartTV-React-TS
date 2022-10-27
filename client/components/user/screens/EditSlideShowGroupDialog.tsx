import {Formik, FormikActions} from 'formik';
import {DialogContent, DialogActions, Grid} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import React, {useState} from 'react';
import {Meteor} from 'meteor/meteor';

import Input from 'client/components/common/ui/Input';
import Modal from 'client/components/common/ui/Modal';
import {methodNames} from 'shared/constants/methodNames';
import {IMethodReturn} from 'shared/models/Methods';
import FormHelperText from '@material-ui/core/FormHelperText/FormHelperText';
import {IGroup} from 'shared/collections/Groups';

interface IEditSlideShowGroupDialog {
	isOpen: boolean;
	group?: IGroup;
	onClose: () => void;
	onSuccess: () => void;
	onDelete: () => void;
}

const EditSlideShowGroupDialog: React.FC<IEditSlideShowGroupDialog> = ({
	isOpen,
	onClose,
	onSuccess,
	onDelete,
	group,
}) => {
	const [error, setError] = useState('');

	if (!group) {
		return null;
	}

	const onSubmitHandler = ({name}: {name: string}, actions: FormikActions<{name: string}>) => {
		Meteor.call(
			methodNames.user.editSlideShowGroup,
			group._id,
			name,
			(error: Error | Meteor.Error, {status, message}: IMethodReturn) => {
				if (error) {
					console.log('Ошибка');

					return;
				}

				setError('');

				if (!status) {
					actions.setErrors({name: message});
					actions.setFormikState({isSubmitting: false});

					return;
				}

				onSuccess();
			},
		);
	};

	const handleDelete = (actions: FormikActions<{name: string}>) => () => {
		actions.setFormikState({isSubmitting: true});

		Meteor.call(
			methodNames.user.deleteSlideShowGroup,
			group._id,
			(error: Error | Meteor.Error, {status, message}: IMethodReturn) => {
				if (error) {
					console.log('Ошибка');

					return;
				}

				if (!status) {
					setError(message);
					actions.setFormikState({isSubmitting: false});

					return;
				}

				onDelete();
			},
		);
	};

	const handleClose = () => {
		setError('');
		onClose();
	};

	return (
		<Modal title={`Изменение группы "${group.name}"`} onClose={handleClose} isOpen={isOpen}>
			<Formik onSubmit={onSubmitHandler} initialValues={{name: group.name}}>
				{({handleSubmit, isSubmitting, status, ...actions}) => (
					<form onSubmit={handleSubmit}>
						<DialogContent>
							<Typography gutterBottom>Укажите название группы</Typography>

							<Input name="name" label="" placeholder="Название группы" />

							{!isSubmitting && error && (
								<FormHelperText error>{error}</FormHelperText>
							)}
						</DialogContent>

						<DialogActions>
							<Grid container>
								<Grid item sm>
									<Button onClick={handleDelete(actions)}>Удалить</Button>
								</Grid>

								<Grid item>
									<Button style={{marginRight: 10}} onClick={handleClose}>
										Отменить
									</Button>

									<Button
										variant="contained"
										color="primary"
										type="submit"
										disabled={isSubmitting}
									>
										Изменить
									</Button>
								</Grid>
							</Grid>
						</DialogActions>
					</form>
				)}
			</Formik>
		</Modal>
	);
};

export default EditSlideShowGroupDialog;
