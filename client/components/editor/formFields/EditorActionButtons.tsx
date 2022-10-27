import * as React from 'react';
import cn from 'classnames';
import {ButtonProps} from '@material-ui/core/Button';

import css from './EditorActionButtons.pcss';
import EditorFieldLabel from 'client/components/editor/formFields/EditorFieldLabel';

interface IEditorActionButtonsProps {
	label: string;
	tooltip?: React.ReactNode;
	together?: boolean;
	children: React.ReactNode;
}

const EditorActionButtons: React.FunctionComponent<IEditorActionButtonsProps> = ({
	label,
	tooltip,
	children,
	together,
}) => (
	<div className={cn(css.actions, {[css.together]: together})}>
		<EditorFieldLabel tooltip={tooltip}>{label}</EditorFieldLabel>

		<div className={css.buttons}>
			{React.Children.map(children, (child: React.ReactElement<ButtonProps>) =>
				React.cloneElement(child, {className: cn(child.props.className, css.button)}),
			)}
		</div>
	</div>
);

export default EditorActionButtons;
