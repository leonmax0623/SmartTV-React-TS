import * as React from 'react';
import Grid from '@material-ui/core/Grid/Grid';
import Typography from '@material-ui/core/Typography/Typography';
import Button from '@material-ui/core/Button/Button';
import AddIcon from '@material-ui/icons/Add';

import css from './PageTitle.pcss';

interface IPageTitleProps {
	title: string;
	description?: string;
	buttonTitle?: string;
	onButtonClick?: () => void;
	extButtons?: React.ReactNode;
	CustomIcon?: React.ComponentClass<any>;
}

const PageTitle: React.FunctionComponent<IPageTitleProps> = ({
	onButtonClick,
	title,
	buttonTitle,
	description,
	extButtons,
	CustomIcon,
}) => (
	<Grid container justify="space-between" className={css.pageHeaderWrap}>
		<Grid item>
			<Typography className={css.pageTitle} variant="h5">
				{title}
			</Typography>

			{description && <Typography variant="subtitle2">{description}</Typography>}
		</Grid>

		{onButtonClick && (
			<Grid item>
				<Button variant="outlined" color="primary" onClick={onButtonClick}>
					{!CustomIcon && <AddIcon className={css.buttonIcon} />}
					{CustomIcon && <CustomIcon className={css.buttonIcon} />}
					{buttonTitle}
				</Button>

				{extButtons}
			</Grid>
		)}
	</Grid>
);

export default PageTitle;
