import * as React from 'react';
import * as cn from 'classnames';

import css from './SlideShowBasePanel.pcss';

interface ISlideShowBasePanelProps {
	isOpen: boolean;
	children: React.ReactNode;
	buttons: React.ReactNode;
	onClose?: () => void;
	width?: number;
}

const SlideShowBasePanel: React.FunctionComponent<ISlideShowBasePanelProps> = ({
	isOpen,
	children,
	onClose,
	buttons,
	width,
}) => (
	<>
		<div style={{width: width || 500}} className={cn(css.panel, {[css.isOpen]: isOpen})}>
			<div className={css.inner}>{children}</div>

			<div className={css.actions}>
				<div className={css.flex}>{buttons}</div>
			</div>
		</div>

		<div
			className={cn(css.bg, {[css.isOpen]: isOpen})}
			onClick={() => {
				if (onClose) {
					onClose();
				}
			}}
		/>
	</>
);

export default SlideShowBasePanel;
