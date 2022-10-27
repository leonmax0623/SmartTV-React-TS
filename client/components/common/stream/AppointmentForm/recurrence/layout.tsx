import * as React from 'react';
import * as PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {
	END_REPEAT_RADIO_GROUP,
	getRecurrenceOptions,
	REPEAT_TYPES,
	getFrequencyString,
	getAvailableRecurrenceOptions,
	handleChangeFrequency,
} from '@devexpress/dx-scheduler-core';
import classNames from 'clsx';
import {LAYOUT_MEDIA_QUERY} from '../../constants';
import {Box} from '@material-ui/core';
import RepeatIcon from 'client/components/common/icons/RepeatIcon';
import {useState} from 'react';

const styles = ({spacing}) => ({
	wrapper: {
		display: 'flex',
		alignItems: 'center',
		borderTop: '1px solid rgba(0, 0, 0, 0.12)',
		padding: '16px 24px',
	},
	side: {
		marginRight: 24,
	},
	root: {
		padding: 0,
		overflow: 'hidden',
		width: 0,
		boxSizing: 'border-box',
		maxWidth: 0,
		opacity: 0,
		[`${LAYOUT_MEDIA_QUERY}`]: {
			minWidth: '100%',
			maxHeight: 0,
		},
	},
	visible: {
		maxWidth: '453px',

		width: 'auto',
		opacity: 1,
	},
	invisible: {
		maxHeight: 0,
	},
});

const LayoutBase = ({
	radioGroupComponent: RadioGroup,
	textEditorComponent,
	labelComponent: Label,
	dateEditorComponent,
	selectComponent: Select,
	weeklyRecurrenceSelectorComponent,
	children,
	classes,
	className,
	getMessage,
	readOnly,
	onFieldChange,
	appointmentData,
	formatDate,
	locale,
	visible,
	firstDayOfWeek,
	...restProps
}) => {
	/*if (!appointmentData.rRule) {
		return null;
	}*/
	const recurrenceOptions = getRecurrenceOptions(appointmentData.rRule) || {};
	const frequency = getFrequencyString(recurrenceOptions.freq);
	const [repeatTypeCode, setRepeatTypeCode] = useState(visible ? frequency : REPEAT_TYPES.NEVER);

	const {rRule, startDate} = appointmentData;
	const changeFrequency = React.useCallback(
		(repeatType) => {
			setRepeatTypeCode(repeatType);
			return handleChangeFrequency(repeatType, rRule, startDate, onFieldChange);
		},
		[rRule, startDate, onFieldChange],
	);

	const selectOptions = React.useMemo(
		() => [
			{
				text: getMessage('never'),
				id: REPEAT_TYPES.NEVER,
			},
			...getAvailableRecurrenceOptions(getMessage),
		],
		[getMessage],
	);
	return (
		<div className={classes.wrapper}>
			<div className={classes.side}>
				<RepeatIcon
					viewBox="0 0 16 16"
					fill="none"
					style={{
						width: '16',
						height: '16',
					}}
					pathProps={{
						fillRule: 'evenodd',
						clipRule: 'evenodd',
						fill: 'black',
						fillOpacity: '0.54',
					}}
				/>
			</div>
			<div>
				<Box display="flex" alignItems="center">
					<Select
						onValueChange={changeFrequency}
						availableOptions={selectOptions}
						value={repeatTypeCode}
						className={classes.select}
						readOnly={readOnly}
						style={{marginTop: 0}}
					/>
				</Box>
				<div
					className={classNames({
						[classes.root]: true,
						[classes.visible]: visible,
						[classes.invisible]: !visible,
						className,
					})}
					{...restProps}
				>
					<RadioGroup
						className={classes.radioGroup}
						type={END_REPEAT_RADIO_GROUP}
						readOnly={readOnly}
						getMessage={getMessage}
						textEditorComponent={textEditorComponent}
						labelComponent={Label}
						dateEditorComponent={dateEditorComponent}
						appointmentData={appointmentData}
						onFieldChange={onFieldChange}
						selectComponent={Select}
						formatDate={formatDate}
						locale={locale}
						firstDayOfWeek={firstDayOfWeek}
					/>
					{children}
				</div>
			</div>
		</div>
	);
};

LayoutBase.propTypes = {
	locale: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
	labelComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
	radioGroupComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
	textEditorComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
	dateEditorComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
	selectComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
	weeklyRecurrenceSelectorComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
		.isRequired,
	onFieldChange: PropTypes.func,
	children: PropTypes.node,
	className: PropTypes.string,
	classes: PropTypes.object.isRequired,
	getMessage: PropTypes.func.isRequired,
	readOnly: PropTypes.bool,
	appointmentData: PropTypes.shape({
		title: PropTypes.string,
		startDate: PropTypes.instanceOf(Date),
		endDate: PropTypes.instanceOf(Date),
		rRule: PropTypes.string,
		notes: PropTypes.string,
		additionalInformation: PropTypes.string,
		allDay: PropTypes.bool,
	}).isRequired,
	formatDate: PropTypes.func.isRequired,
	visible: PropTypes.bool.isRequired,
	firstDayOfWeek: PropTypes.number.isRequired,
};

LayoutBase.defaultProps = {
	locale: 'en-US',
	onFieldChange: () => undefined,
	className: undefined,
	readOnly: false,
	children: null,
};

export const Layout = withStyles(styles)(LayoutBase, {name: 'RecurrenceLayout'});
