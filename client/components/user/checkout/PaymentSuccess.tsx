import React from 'react';
import {Box, Button, Container} from '@material-ui/core';
import routerUrls from 'client/constants/routerUrls';
import {NavLink} from 'react-router-dom';

const PaymentSuccess: React.FC = () => {
	return (
		<Container style={{maxWidth: '768px'}}>
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
							d="M0.5 20C0.5 8.96 9.46 0 20.5 0C31.54 0 40.5 8.96 40.5 20C40.5 31.04 31.54 40 20.5 40C9.46 40 0.5 31.04 0.5 20ZM7.9 21.4L15.08 28.58C15.86 29.36 17.14 29.36 17.9 28.58L33.08 13.4C33.86 12.62 33.86 11.36 33.08 10.58C32.3 9.8 31.04 9.8 30.26 10.58L16.5 24.34L10.72 18.58C9.94 17.8 8.68 17.8 7.9 18.58C7.5255 18.9537 7.31503 19.461 7.31503 19.99C7.31503 20.519 7.5255 21.0263 7.9 21.4Z"
							fill="#3F51B5"
						/>
					</svg>
				</Box>
				<Box fontSize={24} lineHeight={1.5} mb={1} color="rgba(0, 0, 0, 0.87)">
					Тариф оплачен
				</Box>
				<Box p={3} textAlign="center">
					<NavLink to={routerUrls.userPlan}>
						<Button variant="outlined" color="primary">
							Мой тариф
						</Button>
					</NavLink>
				</Box>
			</Box>
		</Container>
	);
};

export default PaymentSuccess;
