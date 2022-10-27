import React from 'react';
import {Box, Container} from '@material-ui/core';

const TheFooter: React.FC = () => {
	return (
		<Container style={{maxWidth: '1440px', paddingTop: '15px', paddingBottom: '15px'}}>
			<Box display="flex" justifyContent="center" mt={2}>
				<Box maxWidth="330px">
					<img src="/img/payment/logos.png" alt="" style={{maxWidth: '100%'}} />
				</Box>
			</Box>
		</Container>
	);
};

export default TheFooter;
