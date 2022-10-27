import * as React from 'react';
import {connect} from 'react-redux';

import {updateSlideElement} from 'client/actions/slideShowEditor';
import {ISlideElement} from 'shared/collections/SlideElements';
import EditorActionButtonsCommon from '../formFields/EditorActionButtonsCommon';
import EditorDelimiter from '../formFields/EditorDelimiter';
import OpacityField from '../settingsFields/OpacityField';
import PermanentElementField from '../settingsFields/PermanentElementField';
import ElementSettingsWrapper from 'client/components/common/ElementSettingsWrapper';
import RotateAngleField from 'client/components/editor/settingsFields/RotateAngleField';
import EditorTextInput from 'client/components/editor/formFields/EditorTextInput';

interface IZoomElementSettingsProps {
	element: ISlideElement;
	updateSlideElement: typeof updateSlideElement;
}

class ZoomElementSettings extends React.PureComponent<IZoomElementSettingsProps> {
	render() {
		const {element, updateSlideElement} = this.props;

		return (
			<ElementSettingsWrapper elementId={element._id}>
				<EditorTextInput
					label="Номер встречи"
					value={element.zoom_meetingNumber}
					onChange={(zoom_meetingNumber: string) =>
						updateSlideElement(element, {zoom_meetingNumber})
					}
				/>

				<EditorTextInput
					label="Отображаемое имя"
					value={element.zoom_userName}
					onChange={(zoom_userName: string) =>
						updateSlideElement(element, {zoom_userName})
					}
				/>

				<EditorTextInput
					label="Почта"
					value={element.zoom_userEmail}
					onChange={(zoom_userEmail: string) =>
						updateSlideElement(element, {zoom_userEmail})
					}
				/>

				<EditorTextInput
					label="Пароль"
					value={element.zoom_password}
					onChange={(zoom_password: string) =>
						updateSlideElement(element, {zoom_password})
					}
				/>

				<EditorDelimiter />

				<EditorTextInput
					label="SDK Key"
					value={element.zoom_sdkKey}
					onChange={(zoom_sdkKey: string) => updateSlideElement(element, {zoom_sdkKey})}
				/>

				<EditorTextInput
					label="SDK Secret"
					value={element.zoom_sdkSecret}
					onChange={(zoom_sdkSecret: string) =>
						updateSlideElement(element, {zoom_sdkSecret})
					}
				/>

				<EditorDelimiter />

				<OpacityField element={element} />

				<PermanentElementField element={element} />
				<RotateAngleField element={element} />

				<EditorDelimiter />

				<EditorActionButtonsCommon element={element} />
			</ElementSettingsWrapper>
		);
	}
}

export default connect(null, {updateSlideElement})(ZoomElementSettings);
