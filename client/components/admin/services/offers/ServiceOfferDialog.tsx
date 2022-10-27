import React, {useState} from 'react';
import {Meteor} from 'meteor/meteor';
import {withTracker} from 'react-meteor-data-with-tracker';
import {Formik, FormikActions, Field, FieldProps} from 'formik';
import {
	DialogContent,
	DialogActions,
	Typography,
	Button,
	Box,
	Paper,
	IconButton,
	AppBar,
	Checkbox,
} from '@material-ui/core';

import Input from 'client/components/common/ui/Input';
import Modal from 'client/components/common/ui/Modal';
import {methodNames} from 'shared/constants/methodNames';
import {IMethodReturn} from 'shared/models/Methods';
import {
	IPaidServiceOffer,
	IPaidServicePackage,
	IPaidServicePackagePaidServiceOffer,
	IPaidServicePackagePaidServiceOfferFull,
	PaidServicePackage,
	PaidServicePackagePaidServiceOffer,
} from 'shared/collections/PaidServices';
import AddPackageToOffer from 'client/components/admin/services/offers/AddPackageToOffer';
import {publishNames} from 'shared/constants/publishNames';
import DeleteIcon from '@material-ui/icons/Delete';
import {IResponseError, IResponseSuccess} from 'shared/models/Response';
interface IAddServicePriceDialogData {
	loading: boolean;
	offerPackages: IPaidServicePackagePaidServiceOfferFull[];
}
interface IAddServicePriceDialogProps {
	offer?: IPaidServiceOffer;
	mode?: string;
	serviceId: string;
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

interface IServiceOfferForm {
	title: string;
	months: number;
	price: number;
	discount: number;
	defaultSelected: boolean;
}

const FormikCheckbox = (props: FieldProps, label: string) => {
	return <Checkbox {...props.field} checked={props.form.values[props.field.name]} />;
};

const ServiceOfferDialog: React.FC<IAddServicePriceDialogProps & IAddServicePriceDialogData> = ({
	offer,
	mode,
	serviceId,
	isOpen,
	onClose,
	onSuccess,
	offerPackages,
}) => {
	const isEdit = mode === 'edit';
	const [error, setError] = useState('');
	const [addPackageDialogOpened, setAddPackageDialogOpened] = useState(false);
	const onOpenAddPackageDialog = (): void => {
		setAddPackageDialogOpened(true);
	};
	const onCloseAddPackageDialog = (): void => {
		setAddPackageDialogOpened(false);
	};
	const onAddPackages = (): void => {
		//console.log('onSelectPackages: selectedItemIds', selectedItemIds);
	};
	const formInitialValues =
		isEdit && offer
			? {
					...offer,
			  }
			: {
					title: '',
					months: 0,
					serviceId: '',
					defaultSelected: false,
					price: 0,
					discount: 0,
			  };
	const onSubmitHandler = (
		{title, months, price, discount, defaultSelected}: IServiceOfferForm,
		actions: FormikActions<IServiceOfferForm>,
	) => {
		const methodName = isEdit
			? methodNames.paidServices.updateOffer
			: methodNames.paidServices.addOffer;

		setError('');

		Meteor.call(
			methodName,
			{
				title,
				months,
				serviceId,
				defaultSelected,
				price: price || 0,
				discount: discount || 0,
				_id: offer?._id,
			},
			(
				error: Error | Meteor.Error,
				{status, message}: IMethodReturn = {status: false, message: ''},
			) => {
				if (error) {
					setError(error.message);
					actions.setFormikState({isSubmitting: false});
					return;
				}

				if (!status) {
					actions.setErrors({title: message});
					actions.setFormikState({isSubmitting: false});

					return;
				}

				onSuccess();
			},
		);
	};
	const onRemovePackage = (offerPackageId: string): void => {
		if (!offerPackageId) return;

		Meteor.call(
			methodNames.paidServices.removePackageFromOffer,
			offerPackageId,
			(errorData: Error | Meteor.Error, response: IResponseError | IResponseSuccess) => {
				const {error} = response;
				if (error) {
					setError(error.message);
					return;
				}
			},
		);
	};

	const handleClose = (): void => {
		if (onClose) onClose();
		setError('');
	};
	const validateForm = ({
		title,
		months,
		price,
		discount,
		defaultSelected,
	}: {
		title: string;
		months: number;
		price: number;
		discount: number;
		defaultSelected: number;
	}) => {
		const errors: {title?: string; months?: string; price?: string; discount?: string} = {};
		const incorrectValue = 'Неверное значение';

		if (!title) {
			errors.title = 'Поле не может быть пустым';
		}
		if (!months || months <= 0) {
			errors.months = incorrectValue;
		}
		if (price < 0) {
			errors.price = incorrectValue;
		}
		if (discount < 0) {
			errors.discount = incorrectValue;
		}

		return errors;
	};

	return (
		<Modal title="Добавление оффера" onClose={handleClose} isOpen={isOpen}>
			<Formik
				onSubmit={onSubmitHandler}
				initialValues={formInitialValues}
				validate={validateForm}
			>
				{({handleSubmit, isSubmitting}) => (
					<form onSubmit={handleSubmit}>
						<DialogContent>
							<Typography gutterBottom>Заголовок срока</Typography>
							<Input
								name="title"
								label=""
								placeholder="Заголовок срока"
								inputProps={{autoFocus: true}}
							/>

							<Typography gutterBottom>Количество месяцев</Typography>
							<Input
								name="months"
								label=""
								type="number"
								placeholder="Количество месяцев"
							/>

							<Typography gutterBottom>Цена за указанный месяц</Typography>
							<Input
								name="price"
								label=""
								type="number"
								placeholder="Цена за указанный месяц"
							/>

							<Typography gutterBottom>Процент скидки</Typography>
							<Input
								name="discount"
								label=""
								type="number"
								placeholder="Процент скидки"
							/>

							<div>
								<Field
									type="checkbox"
									name="defaultSelected"
									render={FormikCheckbox}
								/>
								Выбрано по умолчанию?
							</div>

							{isEdit ? (
								<Box mt={2}>
									<AppBar position="static" color="default">
										<Box p={1.5} fontSize={15}>
											Пакеты
										</Box>
									</AppBar>
									<Paper>
										<Box p={1.5}>
											{offerPackages.map((offerPackage) => {
												if (
													!offerPackage ||
													!offerPackage.paidServicePackage
												)
													return;
												return (
													<Box
														key={offerPackage._id}
														pt={1}
														pb={1}
														display="flex"
														alignItems="center"
														justifyContent="space-between"
													>
														<Box>
															{offerPackage.paidServicePackage.title}
														</Box>
														<IconButton
															size="small"
															onClick={() =>
																onRemovePackage(offerPackage._id)
															}
														>
															<DeleteIcon />
														</IconButton>
													</Box>
												);
											})}

											<Box mt={2} display="flex" justifyContent="flex-end">
												<Button
													color="primary"
													variant="contained"
													disabled={isSubmitting}
													onClick={onOpenAddPackageDialog}
												>
													Добавить пакет
												</Button>
											</Box>
										</Box>
									</Paper>
								</Box>
							) : (
								''
							)}

							{error ? (
								<Box p={2} color="red">
									{error}
								</Box>
							) : (
								''
							)}
						</DialogContent>

						<DialogActions>
							<Button onClick={handleClose}>Отменить</Button>

							<Button
								variant="contained"
								color="primary"
								type="submit"
								disabled={isSubmitting}
							>
								{isEdit ? 'Сохранить' : 'Добавить'}
							</Button>
						</DialogActions>
					</form>
				)}
			</Formik>
			<AddPackageToOffer
				isOpen={addPackageDialogOpened}
				offer={offer}
				onCancel={onCloseAddPackageDialog}
				onSave={onAddPackages}
			/>
		</Modal>
	);
};

// @ts-ignore
export default withTracker<IAddServicePriceDialogProps>((props) => {
	const offerPackagesSubscriber = Meteor.subscribe(publishNames.paidServices.offerPackages);
	const paidPackagesSubscriber = Meteor.subscribe(publishNames.paidServices.packages);
	const loading = !offerPackagesSubscriber || !paidPackagesSubscriber;
	const offerPackages: IPaidServicePackagePaidServiceOfferFull[] = [];
	const paidServiceOfferId = props.offer?._id;
	if (paidServiceOfferId) {
		const foundOfferPackages =
			PaidServicePackagePaidServiceOffer.find({
				paidServiceOfferId,
			}).fetch() || [];

		foundOfferPackages.forEach((foundOfferPackage: IPaidServicePackagePaidServiceOffer) => {
			const paidServicePackage: IPaidServicePackage = PaidServicePackage.findOne({
				_id: foundOfferPackage.paidServicePackageId,
			});

			offerPackages.push({
				...foundOfferPackage,
				paidServicePackage,
			});
		});
	}

	return {
		loading,
		offerPackages,
		...props,
	};
})(ServiceOfferDialog);
