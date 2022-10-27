import * as React from 'react';
import Typography from '@material-ui/core/Typography';

import InstagramIcon from '../../widgets/icons/InstagramIcons';
import {SocialElementsEnum} from 'shared/collections/SlideElements';
import {IFeedStyles} from 'client/types/elements';
import css from './SocialTemplates.pcss';

interface ISlideShowEditorSocialPanelProps {
	getElement: (el: string) => void;
	styles: IFeedStyles;
}

export default class InstagrammTemplate extends React.PureComponent<
	ISlideShowEditorSocialPanelProps
> {
	render() {
		const {
			getElement,
			styles: {headerStyle, textStyle},
		} = this.props;

		return (
			<>
				<Typography
					variant="h6"
					style={headerStyle}
					className={css.pointer}
					onClick={getElement(SocialElementsEnum.HEADER)}
				>
					<InstagramIcon /> Instagram
				</Typography>

				<div>
					<div
						onClick={getElement(SocialElementsEnum.TEXT)}
						className={css.pointer}
						style={textStyle}
					>
						Описание новости
					</div>
				</div>
			</>
		);
	}
}
