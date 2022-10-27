import React, {useState} from 'react';
import {Box, Container, Button, Backdrop, CircularProgress} from '@material-ui/core';
import PlansList from 'client/components/user/plan/PlansList';
import CircleTabs from 'client/components/common/ui/CircleTabs';
import PaymentMethods from 'client/components/user/checkout/PaymentMethods';
import ButtonCustom from 'client/components/common/ui/ButtonCustom';
import CheckoutResultModal from 'client/components/user/checkout/CheckoutResultModal';
import css from 'client/components/user/plan/PlanPage.pcss';
import {withTracker} from 'react-meteor-data-with-tracker';
import {Meteor} from 'meteor/meteor';
import {publishNames} from 'shared/constants/publishNames';
import {Cart, ICart} from 'shared/collections/Cart';
import {Redirect} from 'react-router-dom';
import routerUrls from 'client/constants/routerUrls';
import ContentLoader from 'react-content-loader';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import {methodNames} from 'shared/constants/methodNames';
import {IResponseError} from 'shared/models/Response';
import {IPaidServicePayment} from 'shared/collections/PaidServices';

interface ICheckoutPageProps {
	userCart: ICart;
	loading: boolean;
}

enum PaymentMethodsEnum {
	ONLINE_PHYSICAL = 'onlinePhysical',
}

const CheckoutLoading: React.FC = () => {
	return (
		<Container
			className={css.planPageContainer}
			maxWidth={false}
			style={{paddingBottom: '130px'}}
		>
			<ContentLoader viewBox="0 0 720 660" height={660} width="100%">
				<rect x="0" y="20" rx="12" ry="12" width="100%" height="40" />
				<rect x="0" y="84" rx="12" ry="12" width="25%" height="276" />
				<rect x="27%" y="84" rx="12" ry="12" width="73%" height="276" />
				<rect x="0" y="384" rx="12" ry="12" width="100%" height="376" />
			</ContentLoader>
		</Container>
	);
};
const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		backdrop: {
			position: 'fixed',
			zIndex: theme.zIndex.drawer + 1,
			color: '#fff',
		},
	}),
);

const Checkout: React.FC<ICheckoutPageProps> = ({loading, userCart}) => {
	if (loading) {
		return <CheckoutLoading />;
	}

	if (!userCart?.item) {
		return <Redirect to={routerUrls.userPlan} />;
	}

	const classes = useStyles();
	const [errorModalOpened, setErrorModalOpened] = useState(false);
	const [internalLoading, setInternalLoading] = useState(false);

	const [lastPaymentMethod, setLastPaymentMethod] = useState('');

	const handleOnPayPhysical = (): void => {
		setInternalLoading(true);
		setLastPaymentMethod(PaymentMethodsEnum.ONLINE_PHYSICAL);
		Meteor.call(
			methodNames.paidServices.createOrder,
			null,
			(error: Error | Meteor.Error, response: IPaidServicePayment | IResponseError) => {
				if (error || response.error) {
					setInternalLoading(false);
					setErrorModalOpened(true);
					return;
				}

				const invoiceUrl = response?.invoiceUrl;
				if (!invoiceUrl) {
					setErrorModalOpened(true);
					setInternalLoading(false);
					return;
				}

				window.location.href = invoiceUrl;
			},
		);
	};
	/*const handleOnPayLegal = (): void => {
		console.log('handleOnPayLegal');
	};*/

	const handleRetryPayment = () => {
		setErrorModalOpened(false);
		if (lastPaymentMethod === PaymentMethodsEnum.ONLINE_PHYSICAL) {
			handleOnPayPhysical();
		}
	};

	return (
		<Container className={css.planPageContainer} maxWidth={false}>
			<Box mb={3} pt={5}>
				<PlansList userCart={userCart} readonly={true} />
			</Box>

			{/*style={{paddingBottom: '130px'}}*/}
			<Box pb={10}>
				<CircleTabs
					value="tab/physical"
					tabs={[
						{
							id: 'tab/physical',
							title: 'Физ. лицо',
							content: (
								<Box mt={3}>
									<PaymentMethods onPay={handleOnPayPhysical} />
								</Box>
							),
						},
						/*{
							id: 'tab/entity',
							title: 'Юр. лицо',
							content: (
								<Box mt={3}>
									<Box mb={3}>
										<PaymentEntityForm />
									</Box>
									<PaymentMethods onPay={handleOnPayLegal} />
								</Box>
							),
						},*/
					]}
				/>
			</Box>

			<CheckoutResultModal
				isOpen={errorModalOpened}
				onClose={() => setErrorModalOpened(false)}
			>
				<Box p={3} borderBottom="1px solid rgba(0, 0, 0, 0.12)" textAlign="center">
					<Box mb={1.5}>
						<svg
							width="41"
							height="40"
							viewBox="0 0 41 40"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M0.5 20C0.5 8.94 9.44 0 20.5 0C31.56 0 40.5 8.94 40.5 20C40.5 31.06 31.56 40 20.5 40C9.44 40 0.5 31.06 0.5 20ZM26.28 28.6C27.06 29.38 28.32 29.38 29.1 28.6C29.86 27.82 29.86 26.54 29.1 25.78L23.32 20L29.1 14.22C29.88 13.44 29.88 12.18 29.1 11.4C28.32 10.62 27.06 10.62 26.28 11.4L20.5 17.18L14.72 11.4C13.94 10.62 12.68 10.62 11.9 11.4C11.5255 11.7737 11.315 12.281 11.315 12.81C11.315 13.339 11.5255 13.8463 11.9 14.22L17.68 20L11.9 25.78C11.5255 26.1537 11.315 26.661 11.315 27.19C11.315 27.719 11.5255 28.2263 11.9 28.6C12.68 29.38 13.94 29.38 14.72 28.6L20.5 22.82L26.28 28.6Z"
								fill="#B00020"
							/>
						</svg>
					</Box>
					<Box fontSize={24} lineHeight={1.5} mb={1} color="rgba(0, 0, 0, 0.87)">
						Ошибка оплаты
					</Box>
					<Box fontSize={16} lineHeight={1.5} color="rgba(0, 0, 0, 0.6)">
						Операция отменена банком, попробуйте ещё раз через несколько минут
					</Box>
				</Box>
				<Box p={3} textAlign="center" color="rgba(0, 0, 0, 0.6)">
					<Button
						variant="text"
						color="inherit"
						onClick={() => setErrorModalOpened(false)}
						style={{
							marginRight: '10px',
						}}
					>
						Закрыть
					</Button>
					<ButtonCustom onClick={handleRetryPayment}>Попробовать ещё раз</ButtonCustom>
				</Box>
			</CheckoutResultModal>
			<Backdrop className={classes.backdrop} open={internalLoading}>
				<CircularProgress color="inherit" />
			</Backdrop>
		</Container>
	);
};

export default withTracker<ICheckoutPageProps>(function(props) {
	const cartSubscribeList = Meteor.subscribe(publishNames.cart.list).ready();
	const loading = !cartSubscribeList;
	const userCart = Cart.findOne();

	return {
		...props,
		loading,
		userCart,
	};
})(Checkout);
