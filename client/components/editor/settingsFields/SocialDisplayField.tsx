import * as React from 'react';
import {connect} from 'react-redux';

import {updateSlideElement} from 'client/actions/slideShowEditor';
import {
	ISlideElement,
	SlideElementSocialDisplayEnum,
	SlideElementSocialDisplayEnumDisplay,
} from 'shared/collections/SlideElements';
import EditorSelect from 'client/components/editor/formFields/EditorSelect';

interface ISocialDisplayFieldProps {
	element: ISlideElement;
	updateSlideElement: typeof updateSlideElement;
}

class SocialDisplayField extends React.PureComponent<ISocialDisplayFieldProps> {
	handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const {element} = this.props;
		const socialDisplay = event.target.value as SlideElementSocialDisplayEnum;

		this.props.updateSlideElement(element, {
			socialDisplay,
			postShowByOne: socialDisplay === SlideElementSocialDisplayEnum.MEDIA_LEFT,
		});
	};

	render() {
		const {socialDisplay} = this.props.element;

		return (
			<EditorSelect
				label="Вид"
				options={[
					{
						label: SlideElementSocialDisplayEnumDisplay.MEDIA_TOP,
						value: SlideElementSocialDisplayEnum.MEDIA_TOP,
					},
					{
						label: SlideElementSocialDisplayEnumDisplay.MEDIA_LEFT,
						value: SlideElementSocialDisplayEnum.MEDIA_LEFT,
					},
				]}
				onChange={this.handleChange}
				value={socialDisplay || SlideElementSocialDisplayEnum.MEDIA_TOP}
			/>
		);
	}
}

export default connect(null, {
	updateSlideElement,
})(SocialDisplayField);
