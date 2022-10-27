import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';

import {ISlideElement, SocialElementsEnum} from 'shared/collections/SlideElements';
import {IFeedStyles} from 'client/types/elements';
import css from './SocialTemplates.pcss';

interface ISlideShowEditorSocialPanelProps {
	getElement: (el: string) => void;
	styles: IFeedStyles;
}

export default class FbTemplate extends React.PureComponent<ISlideShowEditorSocialPanelProps> {
	render() {
		const {
			getElement,
			styles: {headerStyle, textStyle, timerStyle},
		} = this.props;

		return (
			<>
				<Grid className={css.topPanel} container spacing={2} alignItems="center">
					<Grid item>
						<Avatar />
					</Grid>

					<Grid item>
						<Typography
							variant="h6"
							className={css.name}
							style={headerStyle}
							onClick={getElement(SocialElementsEnum.HEADER)}
						>
							Donald J. Trump
						</Typography>
					</Grid>
				</Grid>

				<div className={css.item}>
					<Typography
						variant="body1"
						gutterBottom
						onClick={getElement(SocialElementsEnum.TEXT)}
						style={textStyle}
					>
						Thanks to my national defense spending, we are creating jobs and making sure
						America is safe and secure!
					</Typography>

					<Typography
						component="div"
						variant="caption"
						align="right"
						onClick={getElement(SocialElementsEnum.DATE)}
						style={timerStyle}
					>
						2 июня 2018 г.
					</Typography>
				</div>
			</>
		);
	}
}
