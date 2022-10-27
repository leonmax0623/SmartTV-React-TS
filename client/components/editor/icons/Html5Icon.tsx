import * as React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import {mdiLanguageHtml5} from '@mdi/js';

export default React.memo((props) => (
	<SvgIcon {...props}>
		<path d={mdiLanguageHtml5} />
	</SvgIcon>
));
