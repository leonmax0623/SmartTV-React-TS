import * as React from 'react';

import css from './EditorDelimiter.pcss';

const EditorDelimiter: React.FunctionComponent = () => (
	<div className={css.delimiter}>
		<div className={css.inner} />
	</div>
);

export default EditorDelimiter;
