import * as React from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'clsx';
import {withStyles} from '@material-ui/core/styles';

const styles = {
	root: {
		height: '100%',
		margin: '0 auto',
		overflowY: 'auto',
	},
};

const LayoutBase = ({
	basicLayoutComponent: BasicLayout,
	commandLayoutComponent: CommandLayout,
	recurrenceLayoutComponent: RecurrenceLayout,
	isRecurrence,
	children,
	classes,
	className,
	...restProps
}) => {
	return (
		<div className={classNames(classes.root, className)} {...restProps}>
			<div className={classes.container}>
				<BasicLayout />
				<RecurrenceLayout />
			</div>
			{children}
			<CommandLayout />
		</div>
	);
};

LayoutBase.propTypes = {
	basicLayoutComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
	commandLayoutComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
	recurrenceLayoutComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
	children: PropTypes.node,
	className: PropTypes.string,
	classes: PropTypes.object.isRequired,
	isRecurrence: PropTypes.bool,
};

LayoutBase.defaultProps = {
	className: undefined,
	isRecurrence: false,
	children: null,
};

export const Layout = withStyles(styles)(LayoutBase, {name: 'Layout'});
