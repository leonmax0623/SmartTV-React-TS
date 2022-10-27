import * as React from 'react';

import css from './DisplayElementWrapper.pcss';
import {ISlideElement} from 'shared/collections/SlideElements';
import ElementFactory from 'client/components/editor/ElementFactory';
import {getInitialStyles} from 'client/utils/slides';

interface IDisplayElementWrapperProps {
	element: ISlideElement;
	videoBlockTransition?: (arg0: {duration?: number; ended?: boolean}) => void;
	inCurrentSlide: boolean;
	forceEditorMode: boolean;
	isPreview?: boolean;
}

class DisplayElementWrapper extends React.PureComponent<IDisplayElementWrapperProps> {
	render() {
		const {
			element,
			inCurrentSlide,
			videoBlockTransition,
			forceEditorMode,
			isPreview,
		} = this.props;

		const elementStyles = getInitialStyles(element);
		Object.keys(elementStyles).forEach((styleName) => {
			if (styleName.indexOf('-') > -1) {
				const camelCasedStyleName = styleName
					.split('-')
					.map((sp, ind) => (ind ? `${sp[0].toUpperCase()}${sp.slice(1)}` : sp))
					.join('');
				elementStyles[camelCasedStyleName] = elementStyles[styleName];
			}
		});
		let stylesArr = [css.container, css.transition];
		if (element.transitionType !== 'NONE') {
			elementStyles.animationDuration = element.transitionDuration + 'ms';
			elementStyles.animationDelay = element.transitionDelay + 'ms';
			elementStyles.animationIterationCount = element.transitionCount || 'infinite';

			let elemStylesArr = element.transitionType?.split(' ');
			elemStylesArr.forEach((el) => {
				stylesArr.push(css[el]);
			});
		}
		return (
			<div className={stylesArr.join(' ')} style={elementStyles}>
				<ElementFactory
					element={element}
					videoBlockTransition={videoBlockTransition}
					inCurrentSlide={inCurrentSlide}
					editorMode={forceEditorMode || false}
					isPreview={!!isPreview}
				/>
			</div>
		);
	}
}

export default DisplayElementWrapper;
