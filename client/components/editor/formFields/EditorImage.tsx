import React from 'react';

import BaseFileUpload, {UploaderFileType} from 'client/components/common/ui/BaseFileUpload';
import EditorFieldLabel from 'client/components/editor/formFields/EditorFieldLabel';
import css from './EditorImage.pcss';

interface IEditorImageProps {
	label: string;
	value?: string;
	onChange: (fileName: string) => void;
}

class EditorImage extends React.PureComponent<IEditorImageProps> {
	render() {
		const {label, value} = this.props;

		return (
			<div className={css.image}>
				<EditorFieldLabel>{label}</EditorFieldLabel>

				<BaseFileUpload
					onChange={this.props.onChange}
					type={UploaderFileType.Image}
					value={value}
				/>
			</div>
		);
	}
}

export default EditorImage;
