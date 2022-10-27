import {Formik, FormikActions} from 'formik';
import {DialogContent, DialogActions} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import React from 'react';
import {Meteor} from 'meteor/meteor';

import Input from 'client/components/common/ui/Input';
import Modal from 'client/components/common/ui/Modal';
import {methodNames} from 'shared/constants/methodNames';
import {IMethodReturn} from 'shared/models/Methods';

interface IAddSlideShowGroupDialog {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

const AddSlideShowGroupDialog: React.FC<IAddSlideShowGroupDialog> = ({
	isOpen,
	onClose,
	onSuccess,
}) => {
	const onSubmitHandler = ({name}: {name: string}, actions: FormikActions<{name: string}>) => {
		Meteor.call(
			methodNames.user.addSlideShowGroup,
			name,
			(error: Error | Meteor.Error, {status, message}: IMethodReturn) => {
				if (error) {
					console.log('Ошибка');

					return;
				}

				if (!status) {
					actions.setErrors({name: message});
					actions.setFormikState({isSubmitting: false});

					return;
				}

				onSuccess();
			},
		);
	};

	return (
		<Modal title="Добавление группы слайдшоу" onClose={onClose} isOpen={isOpen}>
			<Formik onSubmit={onSubmitHandler} initialValues={{name: ''}}>
				{({handleSubmit, isSubmitting}) => (
					<form onSubmit={handleSubmit}>
						<DialogContent>
							<Typography gutterBottom>Укажите название группы</Typography>

							<Input
								name="name"
								label=""
								placeholder="Название группы"
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
								Добавить
							</Button>
						</DialogActions>
					</form>
				)}
			</Formik>
		</Modal>
	);
};

export default AddSlideShowGroupDialog;
