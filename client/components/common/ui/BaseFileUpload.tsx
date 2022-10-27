import React from 'react';
import ImageIcon from '@material-ui/icons/Image';
import ClearIcon from '@material-ui/icons/Replay';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from 'axios';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@mdi/react';
import {mdiUpload, mdiGoogleDrive, mdiVectorPolyline, mdiImage} from '@mdi/js';

import {getBackgroundImageUrl} from 'client/utils/slides';
import GooglePicker from 'client/components/common/ui/GooglePicker';
// @ts-ignore
import css from './BaseFileUpload.pcss';
import appConsts from 'client/constants/appConsts';
import bytesToSizeString from 'client/utils/bytesToSizeString';
import ElementVectorCollectionModal from 'client/components/editor/modals/ElementVectorCollectionModal';

interface IEditorImageProps {
	type: UploaderFileType;
	value?: string;
	title?: string;
	onChange: (fileName: string) => void;
	height?: number;
}

interface IEditorImageState {
	uploadProgress: number;
	uploading: boolean;
	anchorEl?: HTMLElement;
	openCollection: boolean;
}

interface IFileUploadProgress {
	total: number;
	loaded: number;
}

export enum UploaderFileType {
	Image = 'img',
	Any = 'any',
}

class BaseFileUpload extends React.PureComponent<IEditorImageProps, IEditorImageState> {
	static defaultProps: Partial<IEditorImageProps> = {
		type: UploaderFileType.Any,
	};

	state: IEditorImageState = {uploadProgress: 0, uploading: false, openCollection: false};

	handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) {
			return;
		}

		const files = Array.from(e.target.files);

		if (files.some((file) => file.size > appConsts.maxImgSize)) {
			alert(
				`Размер файла превышает максимально допустимый (${bytesToSizeString(
					appConsts.maxImgSize,
				)})`,
			);
			return;
		}

		const formData = new FormData();

		files.forEach((file, i) => {
			formData.append(String(i), file);
		});

		this.setState({uploading: true, uploadProgress: 0});

		axios
			.post(appConsts.uploadUrl, formData, {
				onUploadProgress: (obj: IFileUploadProgress) => {
					this.setState({uploadProgress: (obj.loaded / obj.total) * 100});
				},
			})
			.then((images) => {
				this.setState({uploading: false});
				this.props.onChange(images.data.files[0].name);
			})
			.catch(() => {});
	};

	handleClear = (e: React.MouseEvent) => {
		e.preventDefault();

		this.props.onChange('');
	};

	handleGooglePickerChange = (docs: any) => {
		this.props.onChange(`https://drive.google.com/uc?id=${docs[0].id}`);
	};

	handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		this.setState({anchorEl: event.currentTarget});
	};

	handleClose = () => {
		this.setState({anchorEl: undefined});
	};

	openCollectionModal = () => {
		this.setState({openCollection: true});
	};

	closeCollectionModal = () => {
		this.setState({openCollection: false});

		this.handleClose();
	};

	handleChoseElement = (path) => {
		this.props.onChange(path);
		this.closeCollectionModal();
	};

	render() {
		const {value, title, type, height} = this.props;
		const {uploadProgress, uploading, anchorEl, openCollection} = this.state;

		return (
			<label>
				<div
					className={css.zone}
					style={{
						height,
						backgroundImage: uploading ? '' : getBackgroundImageUrl(value),
					}}
				>
					{title && !value && <div className={css.title}>{title}</div>}

					{!uploading && (
						<>
							{value && (
								<div className={css.clear} onClick={this.handleClear}>
									<ClearIcon />
								</div>
							)}

							{!value && (
								<div className={css.icon}>
									<ImageIcon />
								</div>
							)}

							{/*<GooglePicker
								scope={['https://www.googleapis.com/auth/drive.readonly']}
								onChange={this.handleGooglePickerChange}
								navHidden={true}
								authImmediate={false}
								mimeTypes={['image/png', 'image/jpeg', 'image/jpg']}
								viewId={'DOCS'}
							>
								<Button component="span" className={css.button}>
									{!value ? 'Выбрать' : 'Изменить'}
								</Button>
							</GooglePicker>*/}

							<Button
								component="span"
								className={css.button}
								onClick={this.handleClick}
							>
								{!value ? 'Выбрать' : 'Изменить'}
							</Button>

							<Menu
								id="simple-menu"
								anchorEl={anchorEl}
								keepMounted
								open={Boolean(anchorEl)}
								onClose={this.handleClose}
							>
								<label>
									<MenuItem onClick={this.handleClose}>
										<ListItemIcon>
											<Icon size={1} path={mdiUpload} />
										</ListItemIcon>
										<ListItemText primary="На компьютере" />
									</MenuItem>

									<input
										className={css.input}
										accept={type === UploaderFileType.Image ? 'image/*' : '*'}
										onChange={this.handleFileChange}
										type="file"
									/>
								</label>

								<label>
									<MenuItem onClick={this.openCollectionModal}>
										<ListItemIcon>
											<Icon size={1} path={mdiImage} />
										</ListItemIcon>
										<ListItemText primary="Из коллекции" />
									</MenuItem>
								</label>

								<GooglePicker
									scope={['https://www.googleapis.com/auth/drive.readonly']}
									onChange={this.handleGooglePickerChange}
									navHidden={true}
									authImmediate={false}
									mimeTypes={['image/png', 'image/jpeg', 'image/jpg']}
									viewId={'DOCS'}
								>
									<MenuItem onClick={this.handleClose}>
										<ListItemIcon>
											<Icon size={1} path={mdiGoogleDrive} />
										</ListItemIcon>
										<ListItemText primary="Google" />
									</MenuItem>
								</GooglePicker>
							</Menu>
						</>
					)}

					{uploading && (
						<>
							<div className={css.loading}>Загрузка {uploadProgress.toFixed(0)}%</div>

							<LinearProgress
								className={css.progress}
								variant="determinate"
								value={uploadProgress}
							/>
						</>
					)}
				</div>

				{/*<input
					className={css.input}
					accept={type === UploaderFileType.Image ? 'image/*' : '*'}
					onChange={this.handleFileChange}
					type="file"
				/>*/}
				<ElementVectorCollectionModal
					isOpen={openCollection || false}
					onClose={this.closeCollectionModal}
					onSubmit={this.handleChoseElement}
				/>
			</label>
		);
	}
}

export default BaseFileUpload;
