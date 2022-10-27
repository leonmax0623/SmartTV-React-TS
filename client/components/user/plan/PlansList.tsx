import React, {useEffect, useState} from 'react';
import {Meteor} from 'meteor/meteor';
import {withTracker} from 'react-meteor-data-with-tracker';
import {Box, Grid, Switch, Typography} from '@material-ui/core';
import PlanItemPremium from 'client/components/user/plan/PlanItemPremium';
import {
	IPaidService,
	IPaidServicePackage,
	IPaidServicePackagePaidServiceOffer,
	IPaidServicePackagePaidServiceOfferFull,
	IPaidServiceOfferWithPackages,
	PaidService,
	PaidServiceKeysEnum,
	PaidServiceOffer,
	PaidServicePackage,
	PaidServicePackagePaidServiceOffer,
	PaidServiceOrder,
} from 'shared/collections/PaidServices';
import {publishNames} from 'shared/constants/publishNames';
import PlanItemDemo from 'client/components/user/plan/PlanItemDemo';
import PlanPackages from 'client/components/user/plan/PlanPackages';
import {methodNames} from 'shared/constants/methodNames';
import {IResponseError, IResponseSuccess} from 'shared/models/Response';
import {ICart} from 'shared/collections/Cart';
import {calculateCart} from 'shared/cart/calculateCart';
import ContentLoader from 'react-content-loader';

interface IPlansListData {
	loading: boolean;
	demoService: IPaidService;
	premiumService: IPaidService;
	premiumOffersWithPackages: IPaidServiceOfferWithPackages[];
	userCart?: ICart;
	hasActiveOrder: boolean;
}

interface IPlansListProps {
	readonly?: boolean;
	onGoCheckout?: () => void;
}

export interface IPlanListModel {
	changePlanAfter: boolean;
	serviceId: string;
	offerId: string;
	checkedPackagesIds: string[];
}

export interface IPlanPrices {
	discount: number;
	price: number;
	priceDiscount: number;
	priceDiscountMonthly: number;
}

const PlansList: React.FC<IPlansListProps & IPlansListData> = ({
	demoService,
	premiumService,
	premiumOffersWithPackages,
	loading,
	readonly,
	onGoCheckout,
	userCart,
	hasActiveOrder,
}) => {
	if (loading) {
		return (
			<ContentLoader viewBox="0 0 720 276" height={276} width="100%">
				<rect x="0" y="528" rx="12" ry="12" width="25%" height="276" />
				<rect x="27%" y="528" rx="12" ry="12" width="73%" height="276" />
			</ContentLoader>
		);
	}

	const isReadOnly = !!readonly;
	const cartItem = userCart?.item;

	const [error, setError] = useState('');
	const defaultSelectedOffer = (Array.isArray(premiumOffersWithPackages)
		? premiumOffersWithPackages
		: []
	).find((item) => item.defaultSelected);

	const [formData, setFormData] = useState<IPlanListModel>({
		changePlanAfter: Boolean(cartItem?.changePlanAfter),
		serviceId: cartItem?.serviceId || premiumService._id,
		offerId:
			cartItem?.offerId || defaultSelectedOffer?._id || premiumOffersWithPackages?.[0]?._id,
		checkedPackagesIds: cartItem?.packagesIds || [],
	});
	const [currentPackages, setCurrentPackages] = useState<
		IPaidServicePackagePaidServiceOfferFull[] | []
	>([]);
	const pricesDefault = {
		discount: 0,
		price: 0,
		priceDiscount: 0,
		priceDiscountMonthly: 0,
	};
	const [prices, setPrices] = useState<IPlanPrices>(pricesDefault);

	useEffect(() => {
		setFormData({
			...formData,
			checkedPackagesIds: isReadOnly ? cartItem?.packagesIds || [] : [],
		});
		const currentOffer = premiumOffersWithPackages.find(
			({_id}) => _id === formData.offerId,
		) || {
			_id: '',
			title: '',
			price: 0,
			discount: 0,
			months: 0,
			paidServiceId: '',
			packagesList: [],
		};
		setCurrentPackages(currentOffer?.packagesList || []);
		setPrices(
			calculateCart({
				packagesIds: formData.checkedPackagesIds,
				offer: currentOffer,
				packageList: currentOffer?.packagesList || [],
			}),
		);
	}, [formData.offerId]);

	useEffect(() => {
		setError('');
		const currentOffer = premiumOffersWithPackages.find(
			({_id}) => _id === formData.offerId,
		) || {
			_id: '',
			title: '',
			price: 0,
			discount: 0,
			months: 0,
			paidServiceId: '',
			packagesList: [],
		};
		setPrices(
			calculateCart({
				packagesIds: formData.checkedPackagesIds,
				offer: currentOffer,
				packageList: currentOffer?.packagesList || [],
			}),
		);
	}, [formData.checkedPackagesIds]);

	function onChangePlanAfter() {
		setFormData({
			...formData,
			changePlanAfter: !formData.changePlanAfter,
		});
	}
	function onChangePlan(payload: object) {
		setFormData({
			...formData,
			...payload,
		});
	}

	const onPayClick = () => {
		Meteor.call(
			methodNames.cart.updateItem,
			{
				changePlanAfter: formData.changePlanAfter,
				serviceId: formData.serviceId,
				offerId: formData.offerId,
				packagesIds: formData.checkedPackagesIds,
			},
			(error: Error | Meteor.Error, result: IResponseSuccess | IResponseError) => {
				if (error) {
					setError(error.message);
					return;
				}
				if (result.error) {
					setError(result.error.message);
					return;
				}
				if (onGoCheckout) {
					onGoCheckout();
				}
			},
		);
	};
	const onChangeSelectedPackages = (payload: string[]): void => {
		setFormData({
			...formData,
			checkedPackagesIds: payload,
		});
	};

	return (
		<>
			{hasActiveOrder ? (
				<Box textAlign="center" fontSize={16} mb={3}>
					<Typography
						color={!formData.changePlanAfter ? 'primary' : 'inherit'}
						component="span"
					>
						Перейти сейчас
					</Typography>
					<Switch
						color="primary"
						checked={formData.changePlanAfter}
						onChange={onChangePlanAfter}
						disabled={isReadOnly}
					/>
					<Typography
						color={formData.changePlanAfter ? 'primary' : 'inherit'}
						component="span"
					>
						Перейти по истечению тарифа
					</Typography>
				</Box>
			) : (
				''
			)}
			<Grid container spacing={2} alignItems="stretch">
				{/*{demoService ? (
					<Grid key={demoService._id} item xs={3}>
						<PlanItemDemo service={demoService} />
					</Grid>
				) : (
					''
				)}*/}
				{premiumService ? (
					<Grid key={premiumService._id} item xs={12}>
						<PlanItemPremium
							service={premiumService}
							offersWithPackages={premiumOffersWithPackages}
							formData={formData}
							prices={prices}
							onChangePlan={onChangePlan}
							onPay={onPayClick}
							readonly={isReadOnly}
						/>
					</Grid>
				) : (
					''
				)}
			</Grid>

			<PlanPackages
				packagesList={currentPackages}
				checkedPackagesIds={formData.checkedPackagesIds}
				onChange={onChangeSelectedPackages}
				readonly={isReadOnly}
			/>
		</>
	);
};

// @ts-ignore
export default withTracker<IPlansListProps & IPlansListData>((props) => {
	const subServices = Meteor.subscribe(publishNames.paidServices.services).ready();
	const subServiceOffers = Meteor.subscribe(publishNames.paidServices.serviceOffers).ready();
	const subServicePackages = Meteor.subscribe(publishNames.paidServices.packages).ready();
	const subServiceOfferPackages = Meteor.subscribe(
		publishNames.paidServices.offerPackages,
	).ready();
	Meteor.subscribe(publishNames.paidServices.orders).ready();

	const activeOrderCount = PaidServiceOrder.find().count();
	const demoService = PaidService.findOne({key: PaidServiceKeysEnum.DEMO});
	const premiumService = PaidService.findOne({key: PaidServiceKeysEnum.PREMIUM});
	const premiumOffersWithPackages: IPaidServiceOfferWithPackages[] = [];
	if (premiumService?._id) {
		const premiumOffers = PaidServiceOffer.find({paidServiceId: premiumService._id}).fetch();

		premiumOffers.forEach((offer) => {
			const offerPackages: IPaidServicePackagePaidServiceOfferFull[] = [];
			const foundOfferPackages = PaidServicePackagePaidServiceOffer.find({
				paidServiceOfferId: offer._id,
			});

			foundOfferPackages.forEach((foundOfferPackage: IPaidServicePackagePaidServiceOffer) => {
				const paidServicePackage: IPaidServicePackage = PaidServicePackage.findOne({
					_id: foundOfferPackage.paidServicePackageId,
				});

				offerPackages.push({
					...foundOfferPackage,
					paidServicePackage,
				});
			});

			premiumOffersWithPackages.push({
				...offer,
				packagesList: offerPackages,
			});
		});
	}

	const loading =
		!subServices || !subServiceOffers || !subServicePackages || !subServiceOfferPackages;

	return {
		...props,
		loading,
		demoService,
		premiumService,
		premiumOffersWithPackages,
		hasActiveOrder: activeOrderCount > 0,
	};
})(PlansList);
