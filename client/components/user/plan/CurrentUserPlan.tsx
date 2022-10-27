import React, {useState} from 'react';
import {withTracker} from 'react-meteor-data-with-tracker';
import {Box} from '@material-ui/core';
import ButtonCustom from '../../common/ui/ButtonCustom';
import css from './PlanBox.pcss';
import {Meteor} from 'meteor/meteor';
import {publishNames} from 'shared/constants/publishNames';
import {
	IPaidServiceOrder,
	IPaidServicePackagePaidServiceOffer,
	PaidServiceOrder,
} from 'shared/collections/PaidServices';
import ContentLoader from 'react-content-loader';
import pluralize from 'shared/utils/pluralize';
import moment from 'moment';
import {methodNames} from 'shared/constants/methodNames';
import {IResponseError, IResponseSuccess} from 'shared/models/Response';

interface ICurrentUserPlanProps {
	loading: boolean;
	orders: IPaidServiceOrder;
	onGoCheckout: () => void;
}

const CurrentUserPlan: React.FC<ICurrentUserPlanProps> = ({orders, loading, onGoCheckout}) => {
	const currentPlan = orders?.[0];
	if (!currentPlan) return <></>;
	const [error, setError] = useState('');

	const expirationDate = moment(currentPlan.expiredAt);
	const daysLeftRaw = expirationDate.isValid() ? expirationDate.diff(moment(), 'days') : '';
	const daysLeft = daysLeftRaw ? pluralize('день|дня|дней', daysLeftRaw, {showNumber: true}) : 0;
	const data = {
		daysLeft,
		expirationDate: expirationDate.isValid() ? expirationDate.format('DD.MM.YYYY') : '',
		planTitle: currentPlan.paidService?.title,
		duration: currentPlan.offer.months
			? pluralize('месяц|месяца|месяцев', currentPlan.offer.months, {showNumber: true})
			: '',
		monthlyPrice: currentPlan.priceDiscountMonthly,
		discount: currentPlan.discount,
		totalPrice: currentPlan.priceDiscount,
	};

	const handleRenewSubscription = () => {
		const currentOrderForCart = {
			serviceId: currentPlan.paidService?._id,
			offerId: currentPlan.offer?._id,
			packagesIds: (Array.isArray(currentPlan.packages) ? currentPlan.packages : []).map(
				(item: IPaidServicePackagePaidServiceOffer) => item._id,
			),
			changePlanAfter: currentPlan.changePlanAfter,
			renew: true,
		};
		if (
			!currentOrderForCart.serviceId ||
			!currentOrderForCart.offerId ||
			!currentOrderForCart.packagesIds.length
		)
			return;

		Meteor.call(
			methodNames.cart.updateItem,
			currentOrderForCart,
			(error: Error | Meteor.Error, response: IResponseSuccess | IResponseError) => {
				if (error) {
					setError(error.message);
					return;
				}
				if (response.error) {
					setError(response.error.message);
					return;
				}
				if (onGoCheckout) {
					onGoCheckout();
				}
			},
		);
	};

	if (loading) {
		return (
			<ContentLoader viewBox="0 0 720 276" height={276} width="100%">
				<rect x="0" y="0" rx="12" ry="12" width="25%" height="276" />
				<rect x="27%" y="0" rx="12" ry="12" width="73%" height="276" />
			</ContentLoader>
		);
	}

	return (
		<Box p={3} borderRadius={12} border={1} borderColor="grey.300" className={css.planBox}>
			<div className={css.planBox__inner}>
				<div className={css.planBox__minor}>
					<div>
						<div className={css['planBox__minor-subtitle']}>
							<div className={css.planBox__subtitle}>{data.planTitle}</div>
						</div>
						<div className={css['planBox__minor-title']}>
							<div className={css.planBox__title}>{data.duration}</div>
						</div>
					</div>
					{data.monthlyPrice ? (
						<div className={css['planBox__minor-middle']}>
							<div className={css['planBox__minor-price']}>
								{data.monthlyPrice} ₽ в месяц
							</div>
						</div>
					) : (
						''
					)}
					<div className={css['planBox__minor-bottom']}>
						{data.discount ? (
							<div className={css['planBox__minor-benefit']}>
								Экономия {data.discount}%
							</div>
						) : (
							''
						)}
						<div className={css.planBox__subtitle}>Итого {data.totalPrice} ₽</div>
					</div>
				</div>
				<div className={css.planBox__major}>
					<div className={css['planBox__major-title']}>
						<div className={css.planBox__title}>Мой тариф</div>
					</div>
					<div className={css['planBox__major-props']}>
						<div className={css.planBox__props}>
							<div className={css.planBox__prop}>
								<div className={css['planBox__prop-key']}>Осталось дней</div>
								<div className={css['planBox__prop-value']}>{data.daysLeft}</div>
							</div>
							<div className={css.planBox__prop}>
								<div className={css['planBox__prop-key']}>Оплачено до</div>
								<div className={css['planBox__prop-value']}>
									{data.expirationDate}
								</div>
							</div>
						</div>
					</div>
					<ButtonCustom size="medium" onClick={handleRenewSubscription}>
						Продлить
					</ButtonCustom>
				</div>
			</div>
			{error && (
				<Box mt={2} color="red">
					{error}
				</Box>
			)}
		</Box>
	);
};

export default withTracker(() => {
	const userOrdersSubscriber = Meteor.subscribe(publishNames.paidServices.orders).ready();
	const orders = PaidServiceOrder.find().fetch();

	return {
		orders,
		loading: !userOrdersSubscriber,
	};
})(CurrentUserPlan);
