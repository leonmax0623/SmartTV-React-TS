import React from 'react';
import {IPaidService} from 'shared/collections/PaidServices';
import {Box} from '@material-ui/core';

interface IPlanItemDemoProps {
	service: IPaidService;
}

const PlanItemDemo: React.FC<IPlanItemDemoProps> = ({service}) => {
	return (
		<Box
			display="flex"
			flexDirection="column"
			alignItems="center"
			pt={3}
			pb={4}
			borderRadius={12}
			border={1}
			borderColor="grey.300"
			height="100%"
		>
			<Box fontSize={24} lineHeight={1.5}>
				{service.title}
			</Box>
			<Box
				fontSize={14}
				lineHeight={1.4}
				mb={2}
				mt={2}
				pt={1}
				pr={3}
				pb={1}
				pl={3}
				border={1}
				borderColor="rgb(63, 81, 181, 0.6)"
				borderRadius={4}
			>
				Бесплатно
			</Box>
			<Box fontSize={12} lineHeight={1.3} pb={0.5} textAlign="center">
				{service.description}
			</Box>
		</Box>
	);
};

export default PlanItemDemo;
