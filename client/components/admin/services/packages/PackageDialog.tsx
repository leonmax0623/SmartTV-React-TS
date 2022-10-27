import React, {useState} from 'react';
import {IPaidServicePackage} from 'shared/collections/PaidServices';
import Modal from 'client/components/common/ui/Modal';
import {Formik, FormikActions} from 'formik';
import {Box, DialogActions, DialogContent, Grid} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Input from 'client/components/common/ui/Input';
import Button from '@material-ui/core/Button';
import {methodNames} from 'shared/constants/methodNames';
import {Meteor} from 'meteor/meteor';
import {IResponseError, IResponseSuccess} from 'shared/models/Response';

interface IPackageDialogProps {
	isOpen: boolean;
	paidServicePackage?: IPaidServicePackage;
	onClose: () => void;
}

const PackageDialog: React.FC<IPackageDialogProps> = ({paidServicePackage, isOpen, onClose}) => {
	const initialFormValues = {
		title: paidServicePackage?.title || '',
	};
	const validateForm = ({title}: {title: string}) => {
		const errors: {title?: string} = {};
		if (!title) {
			errors.title = 'Поле не может быть пустым';
		}

		return errors;
	};
	const [error, setError] = useState('');
	const handleClose = (): void => {
		if (onClose) {
			onClose();
		}
	};
	const onSubmit = ({title}: {title: string}, actions: FormikActions<{title: string}>) => {
		setError('');
		Meteor.call(
			methodNames.paidServices.editPackage,
			{
				title,
				_id: paidServicePackage?._id,
			},
			(errorData: Error | Meteor.Error, response: IResponseError | IResponseSuccess) => {
				if (errorData) {
					setError('Произошла ошибка на сервере. Попробуйте повторить поздее');
				}

				if (response.error) {
					const errorObj = response?.error?.fields;
					if (response.error.message) {
						setError(response.error.message);
					}
					Object.keys(errorObj).forEach((fieldKey) => {
						actions.setErrors({[fieldKey]: errorObj[fieldKey]});
					});
					actions.setFormikState({isSubmitting: false});
					return;
				}

				handleClose();
			},
		);
	};

	return (
		<Modal
			title={`Изменение пакета "${paidServicePackage?.title}"`}
			onClose={handleClose}
			isOpen={isOpen}
		>
			<Formik
				onSubmit={onSubmit}
				initialValues={{...initialFormValues}}
				validate={validateForm}
			>
				{({handleSubmit, isSubmitting, status, ...actions}) => (
					<form onSubmit={handleSubmit}>
						<DialogContent>
							<Typography gutterBottom>Название</Typography>
							<Input
								name="title"
								label=""
								placeholder="Название услуги"
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

export default PackageDialog;
