import React, {useState} from 'react';
import {Box, Collapse, SvgIcon} from '@material-ui/core';
import {mdiChevronDown} from '@mdi/js';

interface IAccordionItem {
	title?: string;
}

const CollapsableRow: React.FC<IAccordionItem> = ({children, title}) => {
	const [collapse, setCollapse] = useState(false);
	const chevronStyles = {
		transform: `rotate(${collapse ? 180 : 0}deg)`,
		transition: 'all 300ms',
	};
	function onChangeCollapse() {
		setCollapse(!collapse);
	}

	return (
		<Box>
			<Box
				display="flex"
				alignItems="center"
				pt={2}
				pr={3}
				pb={2}
				pl={3}
				onClick={onChangeCollapse}
				style={{cursor: 'pointer'}}
			>
				<Box flexGrow={1} fontSize={16} lineHeight={1.5} color="rgba(0, 0, 0, 0.87)">
					{title}
				</Box>
				<Box flexGrow={0} color="rgba(0, 0, 0, 0.54)">
					<SvgIcon style={chevronStyles}>
						<path d={mdiChevronDown} />
					</SvgIcon>
				</Box>
			</Box>
			<Collapse in={collapse}>
				<Box fontSize={16} lineHeight={1.5} pr={3} pl={3} pb={3}>
					{children}
				</Box>
			</Collapse>
		</Box>
	);
};

export default CollapsableRow;
