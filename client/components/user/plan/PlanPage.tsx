import React, {useEffect, useState} from 'react';
import {withTracker} from 'react-meteor-data-with-tracker';
import {Link, useHistory} from 'react-router-dom';
import {Box, Container, Typography} from '@material-ui/core';
import ButtonCustom from 'client/components/common/ui/ButtonCustom';
import CurrentUserPlan from './CurrentUserPlan';
import PlansList from './PlansList';
import css from './PlanPage.pcss';
import CollapsableRow from 'client/components/common/ui/CollapsableRow';
import {Meteor} from 'meteor/meteor';
import {publishNames} from 'shared/constants/publishNames';
import {Cart, ICart} from 'shared/collections/Cart';
import routerUrls from 'client/constants/routerUrls';
import ContentLoader from 'react-content-loader';
import {FaqKeysEnum, IFaq} from 'shared/collections/Faq';
import {methodNames} from 'shared/constants/methodNames';
import {supportEmail} from 'shared/constants/contacts';

interface IPlanPageData {
	loading: boolean;
	userCart: ICart;
}

const UserPlanPageLoading: React.FC = () => {
	return (
		<Container
			className={css.planPageContainer}
			maxWidth={false}
			style={{paddingBottom: '96px'}}
		>
			<ContentLoader viewBox="0 0 720 804" height={804} width="100%">
				<rect x="0" y="0" rx="12" ry="12" width="25%" height="276" />
				<rect x="27%" y="0" rx="12" ry="12" width="73%" height="276" />
				<rect x="0" y="330" rx="12" ry="12" width="100%" height="48" />
				<rect x="0" y="386" rx="12" ry="12" width="100%" height="32" />
				<rect x="0" y="464" rx="12" ry="12" width="100%" height="40" />
				<rect x="0" y="528" rx="12" ry="12" width="25%" height="276" />
				<rect x="27%" y="528" rx="12" ry="12" width="73%" height="276" />
			</ContentLoader>
		</Container>
	);
};
const UserPlanPage: React.FC<IPlanPageData> = ({loading, userCart}) => {
	if (loading) {
		return <UserPlanPageLoading />;
	}

	const history = useHistory();
	const goToCheckout = () => {
		history.push(routerUrls.checkout);
	};

	const [faqData, setFaqData] = useState(null);
	const [faqLoading, setFaqLoading] = useState(false);
	useEffect(() => {
		setFaqLoading(true);
		new Promise((resolve, reject) => {
			Meteor.call(
				methodNames.faq.getListByKey,
				{key: FaqKeysEnum.PAID_SERVICES},
				(error: Error | Meteor.Error, response: IFaq) => {
					if (error) reject(error);
					else resolve(response);
				},
			);
		})
			.then((response) => {
				setFaqData(response);
			})
			.finally(() => {
				setFaqLoading(false);
			});
	}, []);

	return (
		<Container
			className={css.planPageContainer}
			maxWidth={false}
			style={{paddingBottom: '96px'}}
		>
			<Box mt={7} mb={10}>
				<CurrentUserPlan onGoCheckout={goToCheckout} />
			</Box>
			<Box textAlign="center" mb={5}>
				<Box mb={1}>
					<svg
						width="44"
						height="40"
						viewBox="0 0 44 40"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M40 7.79995H24.82L30.7 1.91995C31.1 1.51995 31.1 0.899951 30.7 0.499951C30.3 0.0999512 29.68 0.0999512 29.28 0.499951L22 7.77995L14.72 0.499951C14.32 0.0999512 13.7 0.0999512 13.3 0.499951C12.9 0.899951 12.9 1.51995 13.3 1.91995L19.18 7.79995H4C1.8 7.79995 0 9.57995 0 11.8V35.7999C0 38 1.8 39.7999 4 39.7999H40C42.2 39.7999 44 38 44 35.7999V11.8C44 9.57995 42.2 7.79995 40 7.79995ZM19 30.0999L26.96 25.5399C28.3 24.7799 28.3 22.8399 26.96 22.0599L19 17.4999C17.66 16.7399 16 17.7199 16 19.2399V28.3399C16 29.8799 17.66 30.8599 19 30.0999ZM6 35.7999H38C39.1 35.7999 40 34.9 40 33.7999V13.8C40 12.7 39.1 11.8 38 11.8H6C4.9 11.8 4 12.7 4 13.8V33.7999C4 34.9 4.9 35.7999 6 35.7999Z"
							fill="#3F51B5"
						/>
					</svg>
				</Box>
				<Box mb={1} className={css.planPage__title}>
					Выберите подходящий тарифный план
				</Box>
				<Box fontSize={12} color="grey.700" lineHeight={1.3}>
					Перейти на новый тариф вы можете сразу или по окончанию текущего.
					<br /> Если вы смените тариф, пока предыдущий не закончился, мы сделаем
					перерасчёт, с учётом неизрасходованных дней.
				</Box>
			</Box>

			<PlansList onGoCheckout={goToCheckout} userCart={userCart} />

			{faqLoading ? (
				<ContentLoader viewBox="0 0 720 330" height={330} width="100%">
					<rect x="0" y="0" rx="12" ry="12" width="100%" height="330" />
				</ContentLoader>
			) : (
				''
			)}
			{faqData?.items?.length ? (
				<Box borderRadius={12} border={1} borderColor="grey.300" mb={10}>
					<Box fontSize={24} lineHeight={1.5} pt={3} pr={3} pl={3}>
						{faqData.title}
					</Box>
					{faqData.items.map((item, index) => (
						<div key={item.id}>
							<CollapsableRow title={item.title}>{item.content}</CollapsableRow>
							{faqData.items.length - 1 === index ? (
								''
							) : (
								<Box
									ml={3}
									mr={3}
									borderBottom="1px solid rgba(0, 0, 0, 0.12)"
								></Box>
							)}
						</div>
					))}
				</Box>
			) : (
				''
			)}

			<Box borderRadius={12} border={1} borderColor="grey.300" mb={3} p={3}>
				<Box textAlign="center" mb={3}>
					<svg
						width="34"
						height="40"
						viewBox="0 0 34 40"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M17 0C7.62 0 0 7.62 0 17C0 26.38 7.62 34 17 34H18V40C27.72 35.32 34 26 34 17C34 7.62 26.38 0 17 0ZM15 29V25H19V29H15ZM19.74 19.54C19.76 19.5 19.78 19.46 19.8 19.44C20.3443 18.6417 21.1026 17.9769 21.8713 17.3029C23.6447 15.748 25.4739 14.1443 24.86 10.74C24.28 7.36 21.58 4.58 18.2 4.08C14.08 3.48 10.44 6.02 9.34 9.66C9 10.82 9.88 12 11.08 12H11.48C12.3 12 12.96 11.42 13.24 10.7C13.88 8.92 15.76 7.7 17.84 8.14C19.76 8.54 21.16 10.44 20.98 12.4C20.8445 13.9271 19.7536 14.7717 18.543 15.7089C17.7875 16.2938 16.9855 16.9147 16.34 17.76L16.32 17.74C16.2853 17.7747 16.2573 17.8227 16.2283 17.8725C16.2071 17.9089 16.1853 17.9462 16.16 17.98C16.13 18.03 16.095 18.08 16.06 18.13C16.025 18.18 15.99 18.23 15.96 18.28C15.78 18.56 15.64 18.84 15.52 19.16C15.51 19.2 15.49 19.23 15.47 19.26C15.45 19.29 15.43 19.32 15.42 19.36C15.4 19.38 15.4 19.4 15.4 19.42C15.16 20.14 15 21 15 22.02H19.02C19.02 21.52 19.08 21.08 19.22 20.66C19.26 20.52 19.32 20.38 19.38 20.24C19.4 20.16 19.42 20.08 19.46 20.02C19.54 19.86 19.64 19.7 19.74 19.54Z"
							fill="#3F51B5"
						/>
					</svg>
				</Box>
				<Box
					fontSize={24}
					lineHeight={1.5}
					pt={0.5}
					pr={3}
					pl={3}
					mb={1}
					textAlign="center"
				>
					Остались вопросы? Напишите нам!
				</Box>
				<Box
					fontSize={16}
					lineHeight={1.5}
					mb={3}
					color="rgba(0, 0, 0, 0.6)"
					textAlign="center"
				>
					Мы готовы помочь вам с выбором тарифа или ответим на возникшие вопросы
				</Box>
				<Box textAlign="center">
					<ButtonCustom href={`mailto:${supportEmail}`}>Написать</ButtonCustom>
				</Box>
				{/*<form>
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<Box mb={2}>
								<TextField fullWidth placeholder="Имя" />
							</Box>
							<Box mb={2}>
								<TextField fullWidth placeholder="Телефон" />
							</Box>
							<Box>
								<TextField fullWidth placeholder="Email" />
							</Box>
						</Grid>
						<Grid item xs={6}>
							<TextField multiline fullWidth placeholder="Сообщение" rows={3} />
						</Grid>
					</Grid>
					<Box mt={3} justifyContent="space-between" alignItems="center" display="flex">
						<Box fontSize={12} lineHeight={1.3} mr={3} color="rgba(0, 0, 0, 0.6)">
							<Box>Отправляя форму, я принимаю</Box>
							<a href="#">условия обработки персональных данных</a> и{' '}
							<a href="#">политики конфиденциальности</a>
						</Box>
						<Box>
							<ButtonCustom size="medium">Отправить</ButtonCustom>
						</Box>
					</Box>
				</form>*/}
			</Box>
			<Typography align="center">
				Полный перечень платных услуг компании доступен{' '}
				<Link to={routerUrls.prices}>по ссылке</Link>.
			</Typography>
		</Container>
	);
};

// @ts-ignore
export default withTracker(function(props) {
	const cartListSubscriber = Meteor.subscribe(publishNames.cart.list).ready();
	const loading = !cartListSubscriber;
	const userCart = Cart.findOne();

	return {
		...props,
		loading,
		userCart,
	};
})(UserPlanPage);
