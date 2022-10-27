import * as React from 'react';
import {connect} from 'react-redux';

import {updateSlideElement} from 'client/actions/slideShowEditor';
import EditorCheckbox from '../formFields/EditorCheckbox';
import {ISlideElement, SlideElementSocialDisplayEnum} from 'shared/collections/SlideElements';
import EditorTextInput from '../formFields/EditorTextInput';

interface IPostsElementFieldProps {
	element: ISlideElement;
	updateSlideElement: typeof updateSlideElement;
}

class ShowPostsField extends React.Component<IPostsElementFieldProps> {
	handleIntervalChange = (value?: number) => {
		this.props.updateSlideElement(this.props.element, {
			postShowTime: Number(value),
		});
	};

	handleChangeShowOne = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {checked} = e.target;
		const {element} = this.props;

		this.props.updateSlideElement(element, {postShowByOne: checked});
	};

	render() {
		const {
			element: {postShowByOne, postShowTime = 5, socialDisplay},
		} = this.props;

		return (
			<>
				{(!socialDisplay || socialDisplay === SlideElementSocialDisplayEnum.MEDIA_TOP) && (
					<EditorCheckbox
						label="По одному посту"
						tooltip="Выводить одновременно только одно сообщение, а не ленту сообщений"
						value="constElement"
						checked={postShowByOne}
						onChange={this.handleChangeShowOne}
					/>
				)}

				{postShowByOne && (
					<EditorTextInput
						label="Время на показ поста"
						value={postShowTime}
						type="number"
						onChange={this.handleIntervalChange}
					/>
				)}
			</>
		);
	}
}

export default connect(null, {
	updateSlideElement,
})(ShowPostsField);
