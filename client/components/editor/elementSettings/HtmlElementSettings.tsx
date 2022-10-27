import * as React from 'react';
import {connect} from 'react-redux';
import {Button} from '@material-ui/core';

import {updateSlideElement} from 'client/actions/slideShowEditor';
import EditorTextarea from '../formFields/EditorTextarea';
import EditorActionButtonsCommon from '../formFields/EditorActionButtonsCommon';
import {ISlideElement} from 'shared/collections/SlideElements';
import {RootState} from 'client/store/root-reducer';
import EditorDelimiter from '../formFields/EditorDelimiter';
import BgColorField from '../settingsFields/BgColorField';
import BgImageField from '../settingsFields/BgImageField';
import OpacityField from '../settingsFields/OpacityField';
import PermanentElementField from '../settingsFields/PermanentElementField';
import ElementSettingsWrapper from 'client/components/common/ElementSettingsWrapper';
import EditorSelect from 'client/components/editor/formFields/EditorSelect';
import routerUrls from 'client/constants/routerUrls';
import RotateAngleField from 'client/components/editor/settingsFields/RotateAngleField';

interface IHtmlElementSettingsProps {
	slideshowId: string;
	element: ISlideElement;
	updateSlideElement: typeof updateSlideElement;
}

class HtmlElementSettings extends React.PureComponent<IHtmlElementSettingsProps> {
	handleHtmlChange = (value: string) => {
		const {element} = this.props;

		this.props.updateSlideElement(element, {html: value});
	};

	handleHtmlUpdateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const {element} = this.props;
		const {value} = event.target;

		this.props.updateSlideElement(element, {htmlUpdate: Number(value)});
	};

	render() {
		const {element} = this.props;

		return (
			<ElementSettingsWrapper elementId={element._id}>
				<EditorTextarea
					label="Код HTML"
					value={element.html}
					onChange={this.handleHtmlChange}
					helpText={
						<Button
							variant="contained"
							color="primary"
							fullWidth
							size="small"
							href={routerUrls.extInformers}
							target="_blank"
						>
							Информеры
						</Button>
					}
				/>

				<EditorSelect
					label="Обновлять"
					tooltip="Принудительное обновление"
					options={[
						{label: 'Никогда', value: 0},
						{label: 'Раз в час', value: 1},
						{label: 'Раз в три часа', value: 3},
						{label: 'Раз в шесть часов', value: 6},
						{label: 'Раз в двенадцать часов', value: 12},
						{label: 'Раз в сутки', value: 24},
					]}
					onChange={this.handleHtmlUpdateChange}
					value={element.htmlUpdate || 0}
				/>

				<BgColorField element={element} />
				<BgImageField element={element} />
				<RotateAngleField element={element} />
				<OpacityField element={element} />
				<PermanentElementField element={element} />

				<EditorDelimiter />

				<EditorActionButtonsCommon element={element} />
			</ElementSettingsWrapper>
		);
	}
}

export default connect(
	(state: RootState) => ({
		slideshowId: state.slideShowEditor.slideshowId,
	}),
	{updateSlideElement},
)(HtmlElementSettings);
