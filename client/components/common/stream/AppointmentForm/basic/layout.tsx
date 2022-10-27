import * as React from 'react';
import * as PropTypes from 'prop-types';
import {withTracker} from 'react-meteor-data-with-tracker';
import {createStyles, withStyles} from '@material-ui/core/styles';
import classNames from 'clsx';
import {Grid, Box, MenuItem, Select as BaseSelect} from '@material-ui/core';
import {TITLE} from '@devexpress/dx-scheduler-core';
import {LAYOUT_MEDIA_QUERY} from '../../constants';
import {InputBase} from '@material-ui/core';
import {Meteor} from 'meteor/meteor';
import {publishNames} from 'shared/constants/publishNames';
import {Slideshow} from 'shared/collections/Slideshows';
import ClockIcon from 'client/components/common/icons/ClockIcon';

const InputLarge = withStyles(
	createStyles({
		root: {
			borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
		},
		input: {
			height: 'auto',
			margin: 0,
			padding: 0,
			fontSize: '24px',
			lineHeight: 1.5,
			'&:focus': {
				backgroundColor: 'transparent',
			},
		},
	}),
)(InputBase);

const styles = ({spacing, typography}) => ({
	root: {
		minWidth: '505px',
		paddingTop: spacing(3),
		paddingBottom: spacing(3),
		paddingLeft: spacing(4),
		paddingRight: spacing(4),
		boxSizing: 'border-box',
	},
	main: {
		display: 'flex',
		alignItems: 'center',
	},
	side: {
		marginRight: 24,
	},
	content: {
		flex: '1 1 auto',
	},
	fullSize: {
		paddingBottom: spacing(3),
	},
	labelWithMargins: {
		marginBottom: spacing(0.5),
		marginTop: spacing(0.5),
	},
	dateEditor: {
		width: 'auto',
		display: 'flex',
		paddingTop: '0px!important',
		marginTop: '0',
		paddingBottom: '0px!important',
		marginBottom: 0,
	},
	dividerLabel: {
		...typography.body2,
		width: '10%',
		textAlign: 'center',
		paddingTop: spacing(2),
	},
});

const LayoutBase = ({
	children,
	locale,
	classes,
	className,
	getMessage,
	readOnly,
	onFieldChange,
	appointmentData,
	fullSize,
	resources,
	appointmentResources,
	slideshowList,
	loading,
	textEditorComponent: TextEditor,
	dateEditorComponent: DateEditor,
	selectComponent: Select,
	labelComponent: Label,
	booleanEditorComponent: BooleanEditor,
	resourceEditorComponent: ResourceEditor,
	...restProps
}) => {
	const onChangeSlideshow = React.useCallback(
		(slide) => {
			return onFieldChange({slideshowNumId: slide.target.value});
		},
		[onFieldChange],
	);
	const changeStartDate = React.useCallback((startDate) => onFieldChange({startDate}), [
		onFieldChange,
	]);
	const changeEndDate = React.useCallback((endDate) => onFieldChange({endDate}), [onFieldChange]);
	const changeResources = React.useCallback((resource) => onFieldChange(resource), [
		onFieldChange,
	]);

	const {rRule, startDate, slideId} = appointmentData;

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div
			className={classNames(
				{
					[classes.root]: true,
					[classes.fullSize]: fullSize,
					[classes.halfSize]: !fullSize,
				},
				className,
			)}
			{...restProps}
		>
			<Grid container direction="column" className={classes.dateEditors}>
				<Grid item xs={12}>
					<Box mb={5}>
						<BaseSelect
							fullWidth
							required={true}
							displayEmpty={true}
							placeholder="Слайдшоу"
							labelId="slideshow-id"
							variant="outlined"
							input={<InputLarge />}
							value={appointmentData.slideshowNumId || ''}
							onChange={onChangeSlideshow}
							style={{
								width: '100%',
							}}
							MenuProps={{disableScrollLock: true}}
						>
							<MenuItem value="" disabled>
								Выберите слайдшоу
							</MenuItem>
							{slideshowList.map((slide) => {
								return (
									<MenuItem value={slide.numId} key={slide._id}>
										{slide.name}
									</MenuItem>
								);
							})}
						</BaseSelect>
					</Box>
				</Grid>
			</Grid>
			<div className={classes.main}>
				<div className={classes.side}>
					<ClockIcon
						viewBox="0 0 18 18"
						fill="none"
						style={{
							width: '18px',
							height: '18px',
						}}
						pathProps={{
							fill: 'black',
							fillOpacity: '0.54',
							fillRule: 'evenodd',
							clipRule: 'evenodd',
						}}
					/>
				</div>
				<div>
					<Grid xs={12}>
						<Grid item xs={12}>
							<Box mb={0.5} color="rgba(0, 0, 0, 0.6)" fontSize={16} lineHeight={1.5}>
								{getMessage('startDate')}
							</Box>
							<DateEditor
								className={classes.dateEditor}
								readOnly={readOnly}
								value={appointmentData.startDate}
								onValueChange={changeStartDate}
								locale={locale}
								disableToolbar
							/>
						</Grid>
						<Grid item xs={12}>
							<Box
								mb={0.5}
								color="rgba(0, 0, 0, 0.6)"
								fontSize={16}
								lineHeight={1.5}
								mt={2}
							>
								{getMessage('endDate')}
							</Box>
							<DateEditor
								className={classes.dateEditor}
								readOnly={readOnly}
								value={appointmentData.endDate}
								onValueChange={changeEndDate}
								locale={locale}
								disableToolbar
							/>
						</Grid>
					</Grid>
				</div>
			</div>
			{resources.map((resource) => (
				<React.Fragment key={resource.fieldName}>
					<Label
						text={resource.title}
						type={TITLE}
						className={classes.labelWithMargins}
					/>
					<ResourceEditor
						readOnly={readOnly}
						resource={resource}
						appointmentResources={appointmentResources}
						onResourceChange={changeResources}
					/>
				</React.Fragment>
			))}

			{children}
		</div>
	);
};

LayoutBase.propTypes = {
	textEditorComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
	dateEditorComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
	selectComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
	labelComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
	booleanEditorComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
	resourceEditorComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
	locale: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
	children: PropTypes.node,
	className: PropTypes.string,
	classes: PropTypes.object.isRequired,
	getMessage: PropTypes.func.isRequired,
	onFieldChange: PropTypes.func,
	appointmentData: PropTypes.shape({
		title: PropTypes.string,
		startDate: PropTypes.instanceOf(Date),
		endDate: PropTypes.instanceOf(Date),
		rRule: PropTypes.string,
		notes: PropTypes.string,
		additionalInformation: PropTypes.string,
		allDay: PropTypes.bool,
	}).isRequired,
	resources: PropTypes.array,
	appointmentResources: PropTypes.array,
	readOnly: PropTypes.bool,
	fullSize: PropTypes.bool.isRequired,
};

LayoutBase.defaultProps = {
	onFieldChange: () => undefined,
	resources: [],
	appointmentResources: [],
	className: undefined,
	readOnly: false,
	children: null,
};

const Layout = withStyles(styles)(LayoutBase, {name: 'BasicLayout'});

export default withTracker((props) => {
	const mySlideShowListSubscriber = Meteor.subscribe(publishNames.slideshow.myList).ready();
	const slideshowList = Slideshow.find({}, {sort: {createdAt: -1}}).fetch() || [];
	const loading = !mySlideShowListSubscriber;

	return {
		...props,
		loading,
		slideshowList,
	};
})(Layout);
