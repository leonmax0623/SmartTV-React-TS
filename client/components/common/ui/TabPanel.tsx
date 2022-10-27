import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import * as React from 'react';

interface ITabPanelProps {
	children?: React.ReactNode;
	index: any;
	value: any;
}

const TabPanel = (props: ITabPanelProps) => {
	const {children, value, index, ...other} = props;

	return (
		<Typography
			component="div"
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			<Box>{children}</Box>
		</Typography>
	);
};

export default TabPanel;
