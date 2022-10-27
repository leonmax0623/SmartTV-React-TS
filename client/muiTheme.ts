import {createMuiTheme} from '@material-ui/core/styles';

export default createMuiTheme({
	overrides: {
		MuiTooltip: {
			tooltip: {
				borderRadius: 1,
				boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.16)',
				border: 'solid 1px rgba(0, 0, 0, 0.16)',
				backgroundColor: '#424242',
				color: '#fff',
				fontSize: '11px',
				padding: '4px 8px',
				lineHeight: 1,
				margin: '2px !important',
			},
		},
		MuiInput: {
			root: {
				height: 43,
				marginTop: '0 !important',
				'&$disabled': {
					'&:before': {
						display: 'none',
					},
				},
			},
			input: {
				padding: '0 16px',
				height: 43,
				fontSize: '1.2em',
				transition: '.2s ease-in-out',
				borderRadius: 2,
				border: 'solid 1px #ddd',
				backgroundColor: '#ffffff',

				'&:focus': {
					borderColor: '#1baee1',
				},
			},
			underline: {
				'&:before': {
					borderBottom: 'none',
				},
				'&:after': {
					borderBottom: 'none',
				},
				'&:hover:before': {
					borderBottom: 'none !important',
				},
			},
		},
		MuiOutlinedInput: {
			root: {
				height: 43,
				borderRadius: 2,

				'&:hover:before': {
					border: 'none',
				},

				'&$focused': {
					borderColor: '#1baee1',
					boxShadow: 'none',
					outline: 'none',
				},
			},
			input: {
				padding: '0 16px',
				height: 43,
				fontSize: '1.2em',
				transition: '.2s ease-in-out',
			},
		},
		MuiSelect: {
			root: {
				margin: '10px 0',
			},
			selectMenu: {
				height: 43,
				lineHeight: '43px',
			},
		},
		MuiFormControl: {
			root: {
				margin: '0 !important',
			},
		},
		MuiButton: {
			root: {
				minHeight: 32,
				paddingTop: 0,
				paddingBottom: 0,

				'&$disabled': {
					backgroundColor: '#f2f2f2 !important',
					borderColor: '#f2f2f2 !important',
					color: 'white !important',
				},
			},
			contained: {
				color: '#9e9e9e',
				backgroundColor: '#fff',
				border: 'none',
				borderRadius: 2,
				boxShadow: 'none',
				fontSize: 13,
				transition: '.2s ease-in-out',
				textTransform: 'none',

				'&:hover': {
					color: '#fff',
					backgroundColor: '#40cb90',
				},

				'&:active': {
					color: '#fff',
					backgroundColor: '#40cb90',
					boxShadow: 'none',
				},
			},
			sizeLarge: {
				height: 43,
				fontSize: '1.2em',
				fontWeight: 'bold',
			},
			containedPrimary: {
				backgroundColor: '#40cb90',

				'&:hover': {
					color: '#fff',
					backgroundColor: '#44e4a5',
				},

				'&:active': {
					color: '#fff',
					backgroundColor: '#44e4a5',
					boxShadow: 'none',
				},
			},
		},
		MuiFormLabel: {
			root: {
				marginBottom: 5,

				'&$focused': {
					color: 'rgba(0, 0, 0, 0.54) !important',
				},
			},
		},
		MuiTypography: {
			h6: {
				fontSize: 18,
			},
		},
		MuiDialog: {
			paper: {
				overflowY: 'unset',
				width: 496,
				borderRadius: 4,
				boxShadow: 'none',
			},
		},
		MuiDialogTitle: {
			root: {
				padding: '20px 20px 0',
			},
		},
		MuiDialogContent: {
			root: {
				overflowY: 'unset',
				padding: '20px 20px',
			},
		},
		MuiDialogActions: {
			root: {
				margin: 0,
				padding: '20px 20px',
			},
		},
		MuiCheckbox: {
			root: {
				color: '#ccc',
				fontSize: '34px',
			},
			colorSecondary: {
				color: '#ccc',
			},
		},
		MuiRadio: {
			root: {
				color: '#ccc',
				fontSize: '34px !important',

				'&$checked': {
					color: '#000 !important',
				},
			},
		},
		MuiBackdrop: {
			root: {
				position: 'absolute',
			},
		},
		MuiTab: {
			textColorInherit: {
				opacity: 'unset',
			},
		},
	},
});
