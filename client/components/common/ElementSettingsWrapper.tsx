import * as React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {connect} from 'react-redux';
import {RootState} from 'client/store/root-reducer';

// @ts-ignore
import css from './ElementSettingWrapper.pcss';
import {ISlideElement} from 'shared/collections/SlideElements';

// tslint:disable-next-line:no-empty-interface
interface IElementSettingsWrapperProps {
	elementId?: string;
	selectedElement?: ISlideElement;
	children: React.ReactNode;
}

class ElementSettingsWrapper extends React.PureComponent<IElementSettingsWrapperProps> {
	scrollbar: HTMLElement;

	componentDidUpdate(prevProps: Readonly<IElementSettingsWrapperProps>) {
		const {elementId, selectedElement} = this.props;

		if (!elementId) {
			return;
		}

		if (
			(selectedElement && !prevProps.selectedElement) ||
			(!selectedElement && prevProps.selectedElement) ||
			(selectedElement &&
				prevProps.selectedElement &&
				elementId === selectedElement._id &&
				selectedElement._id !== prevProps.selectedElement._id)
		) {
			this.scrollbar.scrollTop = 0;
		}
	}

	render() {
		const {selectedElement, dispatch, elementId, ...rest} = this.props;
		return (
			<PerfectScrollbar
				containerRef={(element) => (this.scrollbar = element)}
				{...rest}
				className={css.elementSettingWrapper}
			/>
		);
	}
}

export default connect((state: RootState) => ({
	selectedElement: state.slideShowEditor.selectedElement,
}))(ElementSettingsWrapper);
