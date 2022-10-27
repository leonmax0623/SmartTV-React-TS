import React, {useState} from 'react';
import {Box, Button, CircularProgress, LinearProgress} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

interface IUploadVideoProps {
	loading: boolean;
	loadingPercent: number;
	onSelect: (file: File) => void;
	error?: string;
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			position: 'relative',
			display: 'flex',
			flexDirection: 'column',
			minWidth: 300,
			//height: 260,
			border: '1px solid rgba(63, 81, 181, 0.24)',
			borderRadius: '4px',
			overflow: 'hidden',
		},
		top: {
			padding: '24px',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			flexGrow: 1,
		},
		bottom: {
			display: 'flex',
			justifyContent: 'center',
			paddingTop: 5,
			paddingBottom: 5,
			flexGrow: 0,
			marginLeft: -1,
			marginRight: -1,
		},
		action: {
			borderColor: '#3F51B5',
			color: '#3F51B5',
			fontWeight: 600,
		},
		inputFile: {
			display: 'none',
		},
	}),
);

const acceptTypes = ['video/mp4', 'video/avi'];
const inputAccept = acceptTypes.join(', ');
const maxFileSizeMb = 300;

const UploadVideo: React.FC<IUploadVideoProps> = ({loading, loadingPercent, onSelect, error}) => {
	const classes = useStyles();
	const [selectedFile, setSelectedFile] = useState();
	const [validateError, setValidateError] = useState('');
	const inputRef = React.useRef(undefined);
	const handleChooseFile = () => {
		inputRef.current.click();
	};
	const validateFile = (file: File) => {
		setValidateError('');
		if (!file) return false;
		if (file.size / (1024 * 1024) > maxFileSizeMb) {
			setValidateError('Размер файла больше положенного');
			return false;
		}
		const isValid = acceptTypes.includes(file.type);
		if (!isValid) {
			setSelectedFile(undefined);
			setValidateError('Неподдерживаемый формат');
		}
		return isValid;
	};
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target?.files?.[0];
		if (!file) {
			setSelectedFile(undefined);
			return;
		}
		if (!validateFile(file)) return;
		setSelectedFile(file);
		onSelect(file);
	};

	return (
		<Box className={classes.root}>
			<Box className={classes.top}>
				{selectedFile ? (
					<Box px={3} py={1.5} textAlign="center">
						{selectedFile.name}
					</Box>
				) : (
					''
				)}
				{validateError || error ? (
					<Box px={3} py={1.5} textAlign="center" color="red">
						{error ? error : validateError}
					</Box>
				) : (
					''
				)}
				<Button
					variant="outlined"
					className={classes.action}
					onClick={handleChooseFile}
					disabled={loading}
				>
					Выбрать видео
				</Button>
				<Box mt={1.5}>
					Вы можете загрузить видео следующих форматов: MP4, AVI и размером не более 300МБ
				</Box>
				<input
					className={classes.inputFile}
					type="file"
					ref={inputRef}
					accept={inputAccept}
					onChange={handleFileChange}
				/>
			</Box>
			{/*<Box className={classes.bottom}></Box>*/}
			<LinearProgress
				variant="determinate"
				value={loadingPercent}
				style={loading ? {opacity: 1} : {opacity: 0}}
			/>
		</Box>
	);
};

export default UploadVideo;
