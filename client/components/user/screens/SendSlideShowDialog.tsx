import {Formik, FormikActions} from 'formik';
import {DialogContent, DialogActions, Snackbar} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import React, {useState} from 'react';
import {Meteor} from 'meteor/meteor';
import {Alert} from '@material-ui/lab';

import Input from 'client/components/common/ui/Input';
import Modal from 'client/components/common/ui/Modal';
import {methodNames} from 'shared/constants/methodNames';
import {IMethodReturn} from 'shared/models/Methods';
import {requiredInput} from 'client/components/common/ui/requiredValidator';

interface ISendSlideShowDialog {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
	slideshowId: null | string;
}

const SendSlideShowDialog: React.FC<ISendSlideShowDialog> = ({
	isOpen,
	onClose,
	onSuccess,
	slideshowId,
}) => {
	const [alert, setAlert] = useState('');

	const handleAlertClose = () => setAlert('');

	const onSubmitHandler = (values: {email: string}, actions: FormikActions<{email: string}>) => {
		Meteor.call(
			methodNames.slideshow.sendSlideShow,
			slideshowId,
			values.email,
			(error: Error | Meteor.Error, response?: IMethodReturn) => {
				if (error) {
					console.log('Ошибка: ', error.message);
					actions.setFormikState({isSubmitting: false});

					return;
				}

				if (!response?.status) {
					actions.setErrors({email: response?.message});
					actions.setFormikState({isSubmitting: false});

					return;
				}

				if (response?.message) {
					setAlert(response.message);
				}

				onSuccess();
			},
		);
	};

	return (
		<>
			<Snackbar open={!!alert} autoHideDuration={6000} onClose={handleAlertClose}>
				<Alert onClose={handleAlertClose} severity="success">
					{alert}
				</Alert>
			</Snackbar>

			<Modal title="Передача слайдшоу" onClose={onClose} isOpen={isOpen}>
				<Formik onSubmit={onSubmitHandler} initialValues={{email: ''}}>
					{({handleSubmit, isSubmitting}) => (
						<form onSubmit={handleSubmit}>
							<DialogContent>
								<Typography gutterBottom>
									Укажите адрес электронной почты для передачи слайдшоу
								</Typography>

								<Input
									name="email"
									type="email"
									label=""
									placeholder="Email"
									inputProps={{autoFocus: true}}
									validate={requiredInput()}
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
									ПЕРЕДАТЬ
								</Button>
							</DialogActions>
						</form>
					)}
				</Formik>
			</Modal>
		</>
	);
};

export default SendSlideShowDialog;
