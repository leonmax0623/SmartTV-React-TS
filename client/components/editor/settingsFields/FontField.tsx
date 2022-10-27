import * as React from 'react';
import {connect} from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';

import {updateSlideElement} from 'client/actions/slideShowEditor';
import {ISlideElement, ISlideElementAdditionalFonts} from 'shared/collections/SlideElements';
import EditorSelect from 'client/components/editor/formFields/EditorSelect';
import {SlideshowFontFamily, SlideshowFontFamilyText} from 'shared/collections/Slideshows';
import {googleFonts} from 'shared/models/GoogleFonts';

interface IFontFieldProps {
	element: ISlideElement & ISlideElementAdditionalFonts;
	updateSlideElement: typeof updateSlideElement;
}

class FontField extends React.Component<IFontFieldProps> {
	handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {
			fontFamily: event.target.value,
		});
	};

	render() {
		const {fontFamily, additionalFonts = []} = this.props.element;

		const googleSelectedFont = additionalFonts
			.concat(googleFonts)
			.find((family) => family === fontFamily);

		return (
			<EditorSelect
				label="Шрифт"
				onChange={this.handleChange}
				value={fontFamily}
				style={{
					fontFamily:
						googleSelectedFont || (fontFamily && SlideshowFontFamilyText[fontFamily]),
				}}
			>
				{additionalFonts.map((family) => (
					<MenuItem value={family} key={family} style={{fontFamily: family}}>
						{family}
					</MenuItem>
				))}

				{SlideshowFontFamily.getValues().map((value, index) => (
					<MenuItem
						value={SlideshowFontFamilyText[value]}
						key={index}
						style={{fontFamily: SlideshowFontFamilyText[value]}}
					>
						{SlideshowFontFamilyText[value]}
					</MenuItem>
				))}

				{googleFonts.map((family) => (
					<MenuItem value={family} key={family} style={{fontFamily: family}}>
						{family}
					</MenuItem>
				))}
			</EditorSelect>
		);
	}
}

export default connect(null, {
	updateSlideElement,
})(FontField);
