import React, {useState} from 'react';
import {Box} from '@material-ui/core';
import ButtonCustom from 'client/components/common/ui/ButtonCustom';
import {PaidServicePaymentKeysEnum} from 'shared/collections/PaidServices';
import routerUrls from 'client/constants/routerUrls';

interface IPaymentMethodsProps {
	onPay: (method: string) => void;
}

const PaymentMethods: React.FC<IPaymentMethodsProps> = ({onPay}) => {
	const [activeMethod, setActiveMethod] = useState();

	function onChangeMethod(methodId: string) {
		setActiveMethod(methodId);
	}

	const methods = [
		{
			id: PaidServicePaymentKeysEnum.CARD_ONLINE,
			title: 'Банковская карта',
			svgIcon: (active: boolean = false) => (
				<svg
					width="20"
					height="16"
					viewBox="0 0 20 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M18 0H2C0.89 0 0.01 0.89 0.01 2L0 14C0 15.11 0.89 16 2 16H18C19.11 16 20 15.11 20 14V2C20 0.89 19.11 0 18 0ZM17 14H3C2.45 14 2 13.55 2 13V8H18V13C18 13.55 17.55 14 17 14ZM2 4H18V2H2V4Z"
						fill={active ? '#3F51B5' : 'black'}
						fillOpacity={active ? '1' : '0.38'}
					/>
				</svg>
			),
		},
		/*{
			id: PaidServicePaymentKeysEnum.INVOICE,
			title: 'По счету',
			svgIcon: (active: boolean = false) => (
				<svg
					width="19"
					height="22"
					viewBox="0 0 19 22"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M13 0H2C0.9 0 0 0.9 0 2V15C0 15.55 0.45 16 1 16C1.55 16 2 15.55 2 15V3C2 2.45 2.45 2 3 2H13C13.55 2 14 1.55 14 1C14 0.45 13.55 0 13 0ZM13.59 4.59L18.42 9.42C18.79 9.79 19 10.3 19 10.83V20C19 21.1 18.1 22 17 22H5.99C4.89 22 4 21.1 4 20L4.01 6C4.01 4.9 4.9 4 6 4H12.17C12.7 4 13.21 4.21 13.59 4.59ZM17.5 11H13C12.45 11 12 10.55 12 10V5.5L17.5 11Z"
						fill={active ? '#3F51B5' : 'black'}
						fillOpacity={active ? '1' : '0.38'}
					/>
				</svg>
			),
		},*/
	];
	const action =
		activeMethod === PaidServicePaymentKeysEnum.CARD_ONLINE ? (
			<ButtonCustom
				onClick={() => onPay(PaidServicePaymentKeysEnum.CARD_ONLINE)}
				size="medium"
			>
				Оплатить
			</ButtonCustom>
		) : activeMethod === PaidServicePaymentKeysEnum.INVOICE ? (
			<ButtonCustom onClick={() => onPay(PaidServicePaymentKeysEnum.INVOICE)} size="medium">
				Скачать счёт на оплату
			</ButtonCustom>
		) : (
			''
		);

	return (
		<Box>
			<Box borderRadius={12} border={1} borderColor="grey.300" mb={5} p={3}>
				<Box fontSize={24} lineHeight={1.5} mb={3}>
					Метод оплаты
				</Box>
				<Box display="flex" mr={-2}>
					{methods.map((method) => {
						const isMethodActive: boolean = method.id === activeMethod;

						return (
							<Box
								key={method.id}
								display="flex"
								alignItems="center"
								justifyContent="center"
								border={
									isMethodActive
										? '1px solid #3F51B5'
										: '1px solid rgba(0, 0, 0, 0.12)'
								}
								borderRadius={8}
								p={2}
								style={{
									textTransform: 'uppercase',
									cursor: 'pointer',
								}}
								color={isMethodActive ? '#3F51B5' : 'rgba(0, 0, 0, 0.6)'}
								fontWeight={500}
								fontSize={14}
								lineHeight={1.6}
								flexBasis="100%"
								mr={2}
								onClick={() => onChangeMethod(method.id)}
							>
								<Box display="flex" mr={3}>
									{method.svgIcon(isMethodActive)}
								</Box>
								<Box>{method.title}</Box>
							</Box>
						);
					})}
				</Box>
			</Box>
			<Box mb={5} textAlign="center">
				{action}
			</Box>
			<Box fontSize={12} lineHeight={1.3} color="rgba(0, 0, 0, 0.6)" textAlign="center">
				<Box>
					Переходя на оплачиваемый план, вы соглашаетесь с{' '}
					<a href={routerUrls.termsOfUse} target="_blank">
						Офертой
					</a>
					.
				</Box>
				<Box>
					Правила обработки данных в этом сервисе описаны в{' '}
					<a href={routerUrls.privacyPolicy} target="_blank">
						Политике конфиденциальности
					</a>
					.
				</Box>
				<Box display="flex" justifyContent="center" mt={2}>
					<Box maxWidth="406px">
						<img src="/img/payment/logos.png" alt="" style={{maxWidth: '100%'}} />
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default PaymentMethods;
