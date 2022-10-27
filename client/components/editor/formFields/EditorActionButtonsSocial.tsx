import * as React from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import Button from '@material-ui/core/Button';
import {connect} from 'react-redux';

import EditorActionButtons from './EditorActionButtons';
import {toggleEditorSocialPanel} from 'client/actions/slideShowEditor';

interface IEditorActionButtonsSocialProps {
	slideElementId: string;
	toggleEditorSocialPanel: (check: boolean) => void;
}

class EditorActionButtonsSocial extends React.PureComponent<IEditorActionButtonsSocialProps> {
	handleOpenSocialPanel = () => {
		this.props.toggleEditorSocialPanel(true);
	};

	render() {
		return (
			<EditorActionButtons label="Настройки соц.сети">
				<Button onClick={this.handleOpenSocialPanel}>
					<SettingsIcon />
				</Button>
			</EditorActionButtons>
		);
	}
}

export default connect(null, {toggleEditorSocialPanel})(EditorActionButtonsSocial);
