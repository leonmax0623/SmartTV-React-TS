import React, {useState} from 'react';
import {Meteor} from 'meteor/meteor';
import Modal from 'client/components/common/ui/Modal';
import {Formik, FormikActions} from 'formik';
import {
	AppBar,
	Box,
	DialogActions,
	DialogContent,
	Grid,
	Paper,
	Typography,
} from '@material-ui/core';
import Input from 'client/components/common/ui/Input';
import Button from '@material-ui/core/Button';
import {IPaidServicePackage, IPaidServiceOffer} from 'shared/collections/PaidServices';
import {methodNames} from 'shared/constants/methodNames';
import SelectPackageDialog from 'client/components/admin/services/packages/SelectPackageDialog';
import {IResponseError, IResponseSuccess} from 'shared/models/Response';

interface IAddPackageToOfferData {
	price: number;
	paidServicePackage?: IPaidServicePackage;
}
interface IAddPackageToOfferProps {
	isOpen: boolean;
	offerPackage?: IAddPackageToOfferData;
	offer: IPaidServiceOffer;
	mode?: string;
	onCancel: () => void;
	onSave: () => void;
}

const AddPackageToOffer: React.FC<IAddPackageToOfferProps> = ({
	isOpen,
	onCancel,
	mode,
	offer,
	offerPackage,
}) => {
	const isEdit = mode === 'edit';
	const initialFormValues = {
		price: offerPackage?.price || 0,
	};
	const [error, setError] = useState('');
	const handleClose = (): void => {
		if (onCancel) onCancel();
		setSelectedPackage(null);
	};
	const validateForm = ({price}: {price: number}): object => {
		const errors: {price?: string} = {};
		if (!price) {
			errors.price = 'Введите цену';
		}
		return errors;
	};
	const onSubmit = ({price}: {price: number}, actions: FormikActions<{price: number}>) => {
		if (!selectedPackage) {
			setError('Выберите пакет');
			actions.setFormikState({isSubmitting: false});
			return;
		}

		Meteor.call(
			methodNames.paidServices.addPackageToOffer,
			{
				price,
				offerId: offer._id,
				packageId: selectedPackage._id,
			},
			(errorData: Error | Meteor.Error, response: IResponseError | IResponseSuccess) => {
				actions.setFormikState({isSubmitting: false});
				if (errorData) {
					setError('Произошла ошибка на сервере. Попробуйте повторить поздее');
					return;
				}
				const {error} = response;
				if (error) {
					if (error.message) {
						setError(error.message);
						return;
					}
					if (error.title) {
						actions.setErrors({title: error.title});
						return;
					}
				}
				handleClose();
			},
		);
	};

	const [selectPackageDialogOpened, setSelectPackageDialogOpened] = useState(false);
	const [selectedPackage, setSelectedPackage] = useState<IPaidServicePackage | null>(null);
	const onOpenSelectPackageDialog = (): void => {
		setSelectPackageDialogOpened(true);
	};
	const onCloseSelectPackageDialog = (): void => {
		setSelectPackageDialogOpened(false);
	};
	const onSelectPackages = (item: IPaidServicePackage): void => {
		setSelectedPackage(item);
		setError('');
	};

	return (
		<Modal
			title={isEdit ? `Изменение пакета` : 'Добавление пакета'}
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
							<Box mb={2}>
								<AppBar position="static" color="default">
									<Box p={1.5} fontSize={15}>
										Пакеты
									</Box>
								</AppBar>
								<Paper>
									<Box p={1.5}>
										{selectedPackage ? <Box>{selectedPackage.title}</Box> : ''}
										<Box mt={2} display="flex" justifyContent="flex-end">
											<Button
												color="primary"
												variant="contained"
												disabled={isSubmitting}
												onClick={onOpenSelectPackageDialog}
											>
												Добавить пакет
											</Button>
										</Box>
										{error ? (
											<Box pt={3} color="red">
												{error}
											</Box>
										) : (
											''
										)}
									</Box>
								</Paper>
							</Box>
							<Typography gutterBottom>
								Стоимость пакета для текущего оффера
							</Typography>
							<Input
								name="price"
								label=""
								type="number"
								placeholder="Стоимость пакета для текущего оффера"
							/>
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
			<SelectPackageDialog
				isOpen={selectPackageDialogOpened}
				onClose={onCloseSelectPackageDialog}
				onSelect={onSelectPackages}
			/>
		</Modal>
	);
};

export default AddPackageToOffer;
