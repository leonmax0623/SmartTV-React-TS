import * as React from 'react';
import cn from 'classnames';
import Tabs, {TabsProps} from '@material-ui/core/Tabs';
import {TabProps} from '@material-ui/core/Tab';

import css from './EditorActionTabs.pcss';

interface IEditorActionTabsProps extends TabsProps {
	label?: string;
	together?: boolean;
	children: React.ReactNode;
}

const EditorActionTabs: React.FunctionComponent<IEditorActionTabsProps> = ({
	label,
	children,
	together,
	...props
}) => (
	<div className={cn(css.actions, {[css.together]: together})}>
		<label className={css.label}>{label}</label>

		<Tabs
			className={css.tabs}
			{...props}
			classes={{flexContainer: css.tabsFlexContainer, indicator: css.tabsIndicator}}
		>
			{React.Children.map(children, (child: React.ReactElement<TabProps>) =>
				React.cloneElement(child, {
					className: cn(child.props.className, css.tab),
					classes: {selected: css.selected},
				}),
			)}
		</Tabs>
	</div>
);

export default EditorActionTabs;
