import React, {useState} from 'react';
import {withTracker} from 'react-meteor-data-with-tracker';
import {connect} from 'react-redux';
import {RouteComponentProps} from 'react-router-dom';
import {push} from 'connected-react-router';
import {
	Container,
	Typography,
	Box,
	AppBar,
	Table,
	TableRow,
	TableCell,
	TableHead,
	TableBody,
	Button,
	IconButton,
	Paper,
} from '@material-ui/core';
import ServiceOfferDialog from 'client/components/admin/services/offers/ServiceOfferDialog';
import {
	IPaidService,
	PaidServiceKeysEnum,
	PaidService,
	IPaidServiceOffer,
	PaidServiceOffer,
} from 'shared/collections/PaidServices';
import {publishNames} from 'shared/constants/publishNames';
import {Meteor} from 'meteor/meteor';
import CircularProgress from '@material-ui/core/CircularProgress';
import DeleteIcon from '@material-ui/icons/Delete';
import {methodNames} from 'shared/constants/methodNames';
import {IMethodReturn} from 'shared/models/Methods';
import ServiceDialog from 'client/components/admin/services/ServiceDialog';
import EditIcon from '@material-ui/icons/Edit';
import ServicePackagesList from 'client/components/admin/services/packages/ServicePackagesList';
import AdminPaidServiceFaq from 'client/components/admin/services/faq/AdminPaidServiceFaq';

interface IAdminServicesPageData {
	loading: boolean;
	premiumService: IPaidService;
	demoService: IPaidService;
	premiumServiceOffers: IPaidServiceOffer[];
}

const AdminServices: React.FC<IAdminServicesPageData> = (props) => {
	const {loading, premiumService, demoService, premiumServiceOffers} = props;

	if (loading) {
		return (
			<Box>
				<Typography variant="h6" gutterBottom>
					Загружаем список услуг...
				</Typography>

				<CircularProgress />
			</Box>
		);
	}

	const [selectedService, setSelectedService] = useState(premiumService?._id || '');
	const [selectedServiceData, setSelectedServiceData] = useState(premiumService);

	const [serviceDialogOpened, setServiceDialogOpened] = useState(false);
	const onCloseServiceDialog = () => {
		setServiceDialogOpened(false);
	};
	const onOpenServiceDialog = (mode: string = '', serviceId: string) => {
		if (!serviceId) return;
		setSelectedService(serviceId);
		setServiceDialogOpened(true);
		setSelectedServiceData(demoService._id === serviceId ? demoService : premiumService);
	};

	const [serviceOfferDialogOpened, setServiceOfferDialogOpened] = useState(false);
	const [serviceOfferDialogMode, setServiceOfferDialogMode] = useState('');
	const [selectedOffer, setSelectedOffer] = useState('');

	const getSelectedOffer = () => {
		return premiumServiceOffers.find((offer) => offer && offer._id === selectedOffer);
	};
	const onOpenServiceOfferDialog = (mode: string = '', offerId?: string) => {
		if (offerId) {
			setSelectedOffer(offerId);
		}
		setServiceOfferDialogOpened(true);
		setServiceOfferDialogMode(mode);
	};
	const onCloseServiceOfferDialog = () => {
		setServiceOfferDialogOpened(false);
		setServiceOfferDialogMode('');
		setSelectedOffer('');
	};

	const onRemoveServiceOffer = (serviceId: string) => {
		if (!serviceId) return;

		if (!confirm('Удалить оффер?')) return;

		Meteor.call(
			methodNames.paidServices.deleteOffer,
			serviceId,
			(
				error: Error | Meteor.Error,
				{status, message}: IMethodReturn = {status: false, message: ''},
			) => {
				if (error) {
					console.log('Ошибка');

					return;
				}
			},
		);
	};

	return (
		<Container maxWidth="xl">
			<Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
				<Box mr={3}>
					<Typography className="pageTitle" variant="h5">
						Платные услуги
					</Typography>
				</Box>
			</Box>
			{demoService ? (
				<Box mb={2}>
					<AppBar position="static" color="default">
						<Box display="flex" justifyContent="space-between" alignItems="center">
							<Box p={1.5} fontSize={15} fontWeight={700}>
								{demoService.title}
							</Box>
							<Box>
								<IconButton
									onClick={() => {
										onOpenServiceDialog('edit', demoService._id);
									}}
								>
									<EditIcon />
								</IconButton>
							</Box>
						</Box>
					</AppBar>
				</Box>
			) : (
				''
			)}
			{premiumService ? (
				<Box mb={2}>
					<AppBar position="static" color="default">
						<Box display="flex" justifyContent="space-between" alignItems="center">
							<Box p={1.5} fontSize={15} fontWeight={700}>
								{premiumService.title}
							</Box>
							<Box>
								<IconButton
									onClick={() => {
										onOpenServiceDialog('edit', premiumService._id);
									}}
								>
									<EditIcon />
								</IconButton>
							</Box>
						</Box>
					</AppBar>
					{premiumServiceOffers && premiumServiceOffers.length ? (
						<Paper>
							<Box display="flex" justifyContent="flex-end" pt={1} pb={1} pr={1}>
								<Button
									variant="outlined"
									color="primary"
									size="large"
									disabled={!selectedService}
									onClick={() => onOpenServiceOfferDialog()}
								>
									Добавить оффер
								</Button>
							</Box>
							<Table size="small">
								<TableHead>
									<TableRow style={{fontWeight: 700}}>
										<TableCell>Название</TableCell>
										<TableCell>Цена</TableCell>
										<TableCell>Процент скидки</TableCell>
										<TableCell></TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{premiumServiceOffers.map((offer) => {
										return (
											<TableRow key={offer._id}>
												<TableCell>{offer.title}</TableCell>
												<TableCell>{offer.price} ₽</TableCell>
												<TableCell>{offer.discount} %</TableCell>
												<TableCell>
													<IconButton
														onClick={() =>
															onOpenServiceOfferDialog(
																'edit',
																offer._id,
															)
														}
													>
														<EditIcon />
													</IconButton>
													<IconButton
														onClick={() =>
															onRemoveServiceOffer(offer._id)
														}
													>
														<DeleteIcon />
													</IconButton>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</Paper>
					) : (
						<Paper>
							<Box textAlign="center" p={3}>
								<Box fontSize={14} lineHeight={1.5} mb={1}>
									В выбранной услуге нет офферов
								</Box>

								<Button
									variant="outlined"
									color="primary"
									size="large"
									onClick={() => onOpenServiceOfferDialog()}
								>
									Добавить оффер
								</Button>
							</Box>
						</Paper>
					)}
				</Box>
			) : (
				''
			)}
			<ServicePackagesList />
			<Box mt={3}>
				<AdminPaidServiceFaq />
			</Box>
			<ServiceDialog
				service={selectedServiceData}
				mode="edit"
				isOpen={serviceDialogOpened}
				onClose={onCloseServiceDialog}
				onSuccess={onCloseServiceDialog}
			/>
			<ServiceOfferDialog
				offer={getSelectedOffer()}
				mode={serviceOfferDialogMode}
				serviceId={premiumService._id}
				isOpen={serviceOfferDialogOpened}
				onClose={onCloseServiceOfferDialog}
				onSuccess={onCloseServiceOfferDialog}
			/>
		</Container>
	);
};

// @ts-ignore
export default withTracker<IAdminServicesPageData, RouteComponentProps>(() => {
	const subServices = Meteor.subscribe(publishNames.paidServices.services).ready();
	const subServiceOffers = Meteor.subscribe(publishNames.paidServices.serviceOffers).ready();
	const demoService = PaidService.findOne({key: PaidServiceKeysEnum.DEMO});
	const premiumService = PaidService.findOne({key: PaidServiceKeysEnum.PREMIUM});
	const premiumServiceOffers = PaidServiceOffer.find().fetch();

	const loading = !subServices || !subServiceOffers;

	return {
		loading,
		demoService,
		premiumService,
		premiumServiceOffers,
	};
})(
	connect(null, {
		push,
	})(AdminServices),
);
