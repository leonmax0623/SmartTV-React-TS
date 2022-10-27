import * as React from 'react';
import * as PropTypes from 'prop-types';
import MomentUtils from '@date-io/moment';
import {withStyles, makeStyles} from '@material-ui/core/styles';
import classNames from 'clsx';
import {TextField, InputBase, Box} from '@material-ui/core';
import {MuiPickersUtilsProvider, DatePicker, KeyboardTimePicker} from '@material-ui/pickers';
import {TextInputNaked} from 'client/components/common/stream/AppointmentForm/common/text-input-naked';

const styles = ({spacing}) => ({
	dateEditor: {
		paddingBottom: spacing(1.5),
	},
});

const TextInputContentWidth = (props) => {
	return (
		<div>
			<span
				role="textbox"
				onClick={props.onClick}
				style={{fontSize: '16px', lineHeight: '1.5'}}
			>
				{props.value}
			</span>
			<TextField style={{height: '0px', overflow: 'hidden', opacity: 0}} {...props} />
		</div>
	);
};

const DateEditorBase = React.memo(
	({classes, onValueChange, value, readOnly, className, locale, excludeTime, ...restProps}) => {
		const memoizedChangeHandler = React.useCallback(
			(nextDate) => {
				return nextDate && onValueChange(nextDate.toDate());
			},
			[onValueChange],
		);
		const timeChange = React.useCallback(
			(time) => {
				if (!time) return;

				const hours = time.get('h');
				const minutes = time.get('m');
				const date = new Date(value);
				date.setHours(hours);
				date.setMinutes(minutes);
				return onValueChange(date);
			},
			[onValueChange],
		);
		const dateFormat = excludeTime ? 'dddd, DD MMMM' : 'dddd, DD MMMM';

		return (
			<MuiPickersUtilsProvider utils={MomentUtils} locale={locale}>
				<Box display="flex" alignItems="center">
					<DatePicker
						variant="inline"
						disabled={readOnly}
						className={classNames(classes.dateEditor, className)}
						margin="normal"
						value={value}
						onChange={memoizedChangeHandler}
						format={dateFormat}
						inputVariant="outlined"
						TextFieldComponent={TextInputContentWidth}
						{...restProps}
					/>
					{!excludeTime && (
						<Box style={{flexGrow: 0}} ml={3}>
							<KeyboardTimePicker
								ampm={false}
								value={value}
								TextFieldComponent={TextInputNaked}
								onChange={timeChange}
								disabled={readOnly}
								invalidDateMessage="Неправильное время"
							/>
						</Box>
					)}
				</Box>
			</MuiPickersUtilsProvider>
		);
	},
);

DateEditorBase.propTypes = {
	classes: PropTypes.object.isRequired,
	value: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.instanceOf(Date)]),
	className: PropTypes.string,
	readOnly: PropTypes.bool,
	onValueChange: PropTypes.func.isRequired,
	locale: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
	excludeTime: PropTypes.bool,
};

DateEditorBase.defaultProps = {
	locale: 'en-US',
	value: undefined,
	className: undefined,
	readOnly: false,
	excludeTime: false,
};

export const DateEditor = withStyles(styles)(DateEditorBase, {name: 'DateEditor'});
