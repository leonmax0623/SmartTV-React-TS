import * as React from 'react';
import cn from 'classnames';

import css from './Delimiter.pcss';

interface IDelimiter {
	noMarge?: boolean;
}

const Delimiter: React.FunctionComponent<IDelimiter> = (props) => (
	<div className={cn(css.delimiter, {[css.noMarge]: props.noMarge})} />
);

export default Delimiter;
