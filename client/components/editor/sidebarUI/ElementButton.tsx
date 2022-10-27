import * as React from 'react';

import css from './ElementButton.pcss';

interface IElementButtonProps {
	text: string;
	icon: React.ReactNode;
	onClick?: React.MouseEventHandler;
}

const ElementButton: React.FunctionComponent<IElementButtonProps> = ({text, onClick, icon}) => (
	<button className={css.button} onClick={onClick}>
		<p>{icon}</p>

		<p>{text}</p>
	</button>
);

ElementButton.defaultProps = {
	onClick: () => {},
};

export default ElementButton;
