import React, {useState} from 'react';
import {IPaidService, PaidServiceKeysEnum} from 'shared/collections/PaidServices';
import {Formik, FormikActions} from 'formik';
import {Box, DialogActions, DialogContent, Grid} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Input from 'client/components/common/ui/Input';
import Button from '@material-ui/core/Button';
import Modal from 'client/components/common/ui/Modal';
import {methodNames} from 'shared/constants/methodNames';
import {Meteor} from 'meteor/meteor';
import {IMethodReturn} from 'shared/models/Methods';

interface IServiceDialogProps {
	mode?: string;
	isOpen: boolean;
	service?: IPaidService;
	onClose: () => void;
	onSuccess: () => void;
}

const ServiceDialog: React.FC<IServiceDialogProps> = (props) => {
	const {mode, isOpen, onClose, onSuccess} = props;
	let {service} = props;
	const isEditMode = mode === 'edit';
	const [error, setError] = useState('');

	/**
	 * Если окно открыто в режиме редактирования но нет входных данных
	 * Выводим ошибку
	 */
	if (isEditMode && !service) {
		return <Box p={3}>Входные параметры не переданы</Box>;
	}

	if (!service) {
		service = {
			_id: '',
			title: '',
			key: PaidServiceKeysEnum.PREMIUM,
			description: '',
		};
	}

	const onSubmitHandler = (
		{title, description}: {title: string; description: string},
		actions: FormikActions<{name: string; description: string}>,
	) => {
		const data = {
			title,
			description,
			serviceId: '',
		};
		if (isEditMode && service) {
			data.serviceId = service._id;
		}

		Meteor.call(
			methodNames.paidServices.editService,
			data,
			(error: Error | Meteor.Error, response: IMethodReturn) => {
				console.log('response', response);
				if (error) {
					console.log('Ошибка');

					return;
				}

				setError('');

				if (!response.status) {
					actions.setErrors({title: response.message});
					actions.setFormikState({isSubmitting: false});

					return;
				}

				onSuccess();
			},
		);
	};
	const handleClose = () => {
		if (onClose) {
			onClose();
		}
		setError('');
	};

	return (
		<Modal
			title={isEditMode ? `Изменение услуги "${service.title}"` : 'Добавление услуги'}
			onClose={handleClose}
			isOpen={isOpen}
		>
			<Formik
				onSubmit={onSubmitHandler}
				initialValues={{
					title: service.title,
					description: service.description,
				}}
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

							<Typography gutterBottom>Описание</Typography>
							<Input name="description" label="" placeholder="Описание услуги" />

							{error ? (
								<Box pt={3} color="red">
									{error}
								</Box>
							) : (
								''
							)}
						</DialogContent>

						<DialogActions>
							<Grid container style={isEditMode ? {} : {justifyContent: 'flex-end'}}>
								<Grid item>
									<Button style={{marginRight: 10}} onClick={onClose}>
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

export default ServiceDialog;
