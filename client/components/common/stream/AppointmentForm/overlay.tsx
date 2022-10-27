import * as React from 'react';
import * as PropTypes from 'prop-types';
import {Drawer} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import {TRANSITIONS_TIME, LAYOUT_MEDIA_QUERY} from '../constants';

const styles = ({spacing}) => ({
	paper: {
		overflow: 'hidden',
		outline: 'none',
		borderRadius: '12px',
		boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1), 0px 8px 16px rgba(0, 0, 0, 0.2)',
	},
});

const OverlayBase = ({
	children,
	visible,
	classes,
	className,
	fullSize,
	target,
	onHide,
	...restProps
}) => {
	return (
		<Drawer
			className={className}
			classes={classes}
			open={visible}
			disableScrollLock={true}
			transitionDuration={TRANSITIONS_TIME}
			onBackdropClick={onHide}
			{...restProps}
		>
			{children}
		</Drawer>
	);
};

OverlayBase.propTypes = {
	children: PropTypes.node.isRequired,
	classes: PropTypes.object.isRequired,
	fullSize: PropTypes.bool.isRequired,
	onHide: PropTypes.func.isRequired,
	visible: PropTypes.bool,
	className: PropTypes.string,
	target: PropTypes.object,
};

OverlayBase.defaultProps = {
	className: undefined,
	visible: false,
	target: null,
};

export const Overlay = withStyles(styles)(OverlayBase, {name: 'Overlay'});
