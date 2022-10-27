import React from 'react';
import {Box, Button, Container} from '@material-ui/core';
import routerUrls from 'client/constants/routerUrls';
import {NavLink} from 'react-router-dom';

const PaymentFail: React.FC = () => {
	return (
		<Container style={{maxWidth: '768px'}}>
			<Box p={3} textAlign="center">
				<Box p={3} textAlign="center">
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
						Операция отменена банком, попробуйте ещё раз через несколько минут
					</Box>
				</Box>
				<Box p={3} textAlign="center">
					<NavLink to={routerUrls.userPlan}>
						<Button variant="outlined" color="primary">
							Попробовать ещё раз
						</Button>
					</NavLink>
				</Box>
			</Box>
		</Container>
	);
};

export default PaymentFail;
