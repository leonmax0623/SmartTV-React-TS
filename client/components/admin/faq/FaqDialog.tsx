import React, {useState} from 'react';
import Modal from 'client/components/common/ui/Modal';
import {Formik, FormikActions} from 'formik';
import {Box, DialogActions, DialogContent, Grid} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Input from 'client/components/common/ui/Input';
import Button from '@material-ui/core/Button';
import {Meteor} from 'meteor/meteor';
import {IFaq} from 'shared/collections/Faq';
import {methodNames} from 'shared/constants/methodNames';
import {IResponseError, IResponseSuccess} from 'shared/models/Response';

interface IFaqDialogProps {
	isOpen: boolean;
	onClose: () => void;
	faq: IFaq;
}
const FaqDialog: React.FC<IFaqDialogProps> = ({isOpen, onClose, faq}) => {
	const [error, setError] = useState('');
	const initialFormValues = {
		title: faq.title,
	};
	const validateForm = ({title}: {title: string}) => {
		const errors: {title?: string} = {};
		if (!title) {
			errors.title = 'Поле не может быть пустым';
		}

		return errors;
	};
	const handleClose = () => {
		if (onClose) {
			onClose();
		}
	};
	const onSubmitHandler = ({title}: {title: string}, actions: FormikActions<{title: string}>) => {
		Meteor.call(
			methodNames.faq.edit,
			{title},
			(errorData: Error | Meteor.Error, response: IResponseError | IResponseSuccess) => {
				actions.setSubmitting(false);
				if (errorData) {
					actions.setErrors({title: errorData.message});
					return;
				}

				const err = response.error;
				if (err) {
					const titleError = err?.fields?.title;
					if (titleError) {
						actions.setErrors({title: titleError});
					} else if (err?.message) {
						actions.setErrors(err.message);
					}

					return;
				}
				if (onClose) {
					onClose();
				}
			},
		);
	};

	return (
		<Modal title="Изменение раздела" onClose={handleClose} isOpen={isOpen}>
			<Formik
				onSubmit={onSubmitHandler}
				initialValues={initialFormValues}
				validate={validateForm}
			>
				{({handleSubmit, isSubmitting, status}) => (
					<form onSubmit={handleSubmit}>
						<DialogContent>
							<Typography gutterBottom>Заголовок</Typography>
							<Input
								name="title"
								label=""
								placeholder="Введите заголовок"
								inputProps={{autoFocus: true}}
							/>

							{error ? (
								<Box pt={3} color="red">
									{error}
								</Box>
							) : (
								''
							)}
						</DialogContent>

						<DialogActions>
							<Grid container style={{justifyContent: 'flex-end'}}>
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
										Сохранить
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
export default FaqDialog;
