import React from 'react';
import classNames from 'classnames';
import {Tooltip} from '@material-ui/core';

import css from './UploadButton.pcss';
import BaseFileUpload, {UploaderFileType} from 'client/components/common/ui/BaseFileUpload';

interface IUploadProps {
	label?: string;
	title?: string;
	tooltip?: React.ReactNode;
	name: string;
	value?: string;
	onChange: (name: string, fileName: string) => void;
	fullWidth?: boolean;
	height?: number;
}

const UploadButton: React.FC<IUploadProps> = (props) => {
	const handleFileChange = (fileName: string) => {
		props.onChange(props.name, fileName);
	};

	const {label, title, value, fullWidth, height, tooltip} = props;
	return (
		<div className={classNames(css.upload, {[css.fullWidth]: fullWidth})}>
			{label && <label>{label}</label>}

			<Tooltip arrow title={label} open={tooltip ? undefined : false}>
				<div>
					<BaseFileUpload
						onChange={handleFileChange}
						type={UploaderFileType.Image}
						value={value}
						height={height}
						title={title}
					/>
				</div>
			</Tooltip>
		</div>
	);
};

export default UploadButton;
