import * as React from 'react';
import {connect} from 'react-redux';
import ElementButton from './sidebarUI/ElementButton';
import {addElementToSlide} from 'client/actions/slideShowEditor';
import {SlideElementTypeEnum} from 'shared/collections/SlideElements';
import {RootState} from 'client/store/root-reducer';
import ElementSettingsWrapper from '../common/ElementSettingsWrapper';
import {renderElementIcon, renderElementName} from 'client/utils/elements';

interface IElementsMenuProps {
	selectedSlideId: string;
	addElementToSlide: (slideId: string, elementType: SlideElementTypeEnum) => void;
}

class ElementsMenu extends React.Component<IElementsMenuProps> {
	createTextElementHandleGeneral = (elementType: SlideElementTypeEnum) => {
		const {selectedSlideId} = this.props;

		this.props.addElementToSlide(selectedSlideId, elementType);
	};

	generateButtonBasedOnType = (elementType: SlideElementTypeEnum) => (
		<ElementButton
			text={renderElementName(elementType)}
			onClick={this.createTextElementHandleGeneral.bind(this, elementType)}
			icon={renderElementIcon(elementType, '#fff')}
		/>
	);

	render() {
		return (
			<ElementSettingsWrapper>
				{this.generateButtonBasedOnType(SlideElementTypeEnum.TEXT)}
				{this.generateButtonBasedOnType(SlideElementTypeEnum.TICKER)}
				{this.generateButtonBasedOnType(SlideElementTypeEnum.HTML)}
				{this.generateButtonBasedOnType(SlideElementTypeEnum.IMAGE)}
				{this.generateButtonBasedOnType(SlideElementTypeEnum.ZOOM)}
				{this.generateButtonBasedOnType(SlideElementTypeEnum.YOUTUBE)}
				{this.generateButtonBasedOnType(SlideElementTypeEnum.CLOCK)}
				{this.generateButtonBasedOnType(SlideElementTypeEnum.WEATHER)}
				{this.generateButtonBasedOnType(SlideElementTypeEnum.AIR_QUALITY)}
				{this.generateButtonBasedOnType(SlideElementTypeEnum.CURRENCY_RATE)}
				{this.generateButtonBasedOnType(SlideElementTypeEnum.TRANSPORT_SCHEDULE)}
				{this.generateButtonBasedOnType(SlideElementTypeEnum.TRAFFIC_JAM)}
				{this.generateButtonBasedOnType(SlideElementTypeEnum.VKONTAKTE)}
				{this.generateButtonBasedOnType(SlideElementTypeEnum.TELEGRAM)}
				{this.generateButtonBasedOnType(SlideElementTypeEnum.FACEBOOK)}
				{this.generateButtonBasedOnType(SlideElementTypeEnum.INSTAGRAM)}
				{this.generateButtonBasedOnType(SlideElementTypeEnum.TWITTER)}
				{this.generateButtonBasedOnType(SlideElementTypeEnum.ODNOKLASSNIKI)}
				{this.generateButtonBasedOnType(SlideElementTypeEnum.RSS)}
			</ElementSettingsWrapper>
		);
	}
}

export default connect(
	(state: RootState) => ({
		selectedSlideId: state.slideShowEditor.selectedSlideId,
	}),
	{addElementToSlide},
)(ElementsMenu);
