import * as React from 'react';
import {Editor} from '@tinymce/tinymce-react';
import {connect} from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {TextField, MenuItem, colors} from '@material-ui/core';
import {ExpandMore as ArrowDropDown} from '@material-ui/icons';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import {ISlideElement, ISlideElementAdditionalFonts} from 'shared/collections/SlideElements';
import {
	SlideshowBackgroundImageDisplayEnum,
	SlideshowFontFamilyText,
} from 'shared/collections/Slideshows';
import {updateSlideElement} from 'client/actions/slideShowEditor';
import {RootState} from 'client/store/root-reducer';
import {getBackgroundImageSize, getBackgroundImageUrl} from 'client/utils/slides';
import {googleFonts} from 'shared/models/GoogleFonts';
// @ts-ignore
import css from './TextWidgetEditor.pcss';
import {RenderInputParams} from '@material-ui/lab/Autocomplete/Autocomplete';
import letterSpacingMenuButton from 'client/utils/tinyMCEPlugins/letterSpacingMenuButton';

interface ITextWidgetEditorProps {
	selectedElement?: ISlideElement;
	element: ISlideElement & ISlideElementAdditionalFonts;
	updateSlideElement: typeof updateSlideElement;
	isRichTextEditorEnabled?: boolean;
	scale?: number;
	text: string;
	setText: (text: string) => void;
	onEditorFocus?: () => void;
	onEditorBlur?: () => void;
}

interface ITextWidgetEditorState {
	text?: string;
	fontSize: number;
	isOpenFontSize: boolean;
}

class TextWidgetEditor extends React.PureComponent<ITextWidgetEditorProps, ITextWidgetEditorState> {
	state = {text: '', fontSize: 24, isOpenFontSize: false};

	editorOuter: React.RefObject<HTMLDivElement> = React.createRef();
	fontSizeInput: React.RefObject<HTMLInputElement> = React.createRef();
	editor: any;
	// tslint:disable-next-line:no-magic-numbers
	fontSizes = [14, 16, 18, 20, 22, 24, 26, 28, 30, 40, 50, 60, 70, 90, 100, 110, 120, 130, 140];

	fontWhiteList: string[] = [
		...(this.props.element?.additionalFonts ? this.props.element?.additionalFonts : []),
		...Object.values(SlideshowFontFamilyText),
		...googleFonts,
	];

	textSaveTimer: NodeJS.Timeout;
	textSaveTimerTimeout = 5000;

	editorInit = {
		setup: (editor: any) => {
			this.editor = editor;

			editor.ui.registry.addMenuButton('letterSpacing', letterSpacingMenuButton(editor));

			editor.on('mouseup', this.handleEditorMouseKeyUp);
			editor.on('keyup', this.handleEditorMouseKeyUp);
			editor.on('focus', this.handleEditorFocus);
			editor.on('init', function() {
				editor.selection.select(editor.getBody(), true);
				editor.selection.collapse(false);
				editor.focus();
			});
		},
		menubar: false,
		plugins: ['table', 'lists', 'advlist'],
		toolbar: [
			'undo redo | bold italic underline strikethrough | fontselect | forecolor backcolor | table | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lineheight letterSpacing | removeformat',
		],
		font_formats: this.fontWhiteList.map((font) => `${font}="${font}"`).join(';'),
		branding: false,
		statusbar: false,
		inline: true,
	};

	componentDidMount() {
		const {text} = this.props.element;

		this.setState({text});
	}

	componentDidUpdate(prevProps: Readonly<ITextWidgetEditorProps>) {
		const {text} = this.props.element;

		if (text !== prevProps.element.text) {
			this.setState({text});
		}
		if (this.props.isRichTextEditorEnabled !== prevProps.isRichTextEditorEnabled) {
			setTimeout(() => this.editor.editorManager.activeEditor.focus(), 500);
		}
	}

	componentWillUnmount() {
		// убиваем таймер
		if (this.textSaveTimer) {
			clearTimeout(this.textSaveTimer);
		}
		// и сразу же сохраняем
		this.props.updateSlideElement(this.props.element, {text: this.props.text});
	}

	handleEditorMouseKeyUp = () => {
		const fontSize = window
			.getComputedStyle(this.editor.editorManager.activeEditor.selection.getStart(), null)
			.getPropertyValue('font-size');

		if (!fontSize) {
			return;
		}

		this.setState({
			fontSize: Number(fontSize.replace(/\D/g, '')),
		});
	};

	handleEditorFocus = () => {
		setTimeout(() => {
			const toolbar = this.editor.editorContainer.querySelector('.tox-toolbar');
			const matchedElement = toolbar?.querySelector('.tox-toolbar__group:nth-child(3)');

			if (toolbar && matchedElement && this.editorOuter.current) {
				matchedElement.append(this.fontSizeInput.current);

				this.editor.editorContainer.style.opacity = '1';

				this.editor.formatter.register('fontSizeChange', {
					inline: 'span',
					styles: {fontSize: '%value'},
				});

				const height = toolbar.offsetHeight;
				const {top, left} = this.editorOuter.current.getBoundingClientRect();

				const toxEditorHeader = this.editor.editorContainer.querySelector(
					'.tox-editor-header',
				);

				if (toxEditorHeader) {
					toxEditorHeader.style.position = 'static';
					toxEditorHeader.style.visibility = 'visible';
					toxEditorHeader.style.opacity = '1';
				}

				if (top - height <= 0) {
					this.editor.editorContainer.style.cssText = `${
						this.editor.editorContainer.style.cssText
					}; left: ${left}px; top: ${top +
						this.editorOuter.current.clientHeight * (this.props.scale || 0)}px;`;
				} else {
					this.editor.editorContainer.style.cssText = `${
						this.editor.editorContainer.style.cssText
					}; left: ${left}px; top: ${top - height}px;`;
				}
			}
		}, 500);
	};

	handleTextChange = (text: string) => {
		console.log('handleTextChange', text);
		this.setState({text});
		/*
      Обновляем text для быстрой передачи в компонент TextWidget
      (без задержки на вызов метода)
		*/
		this.props.setText(text);
		/*
      Отменяем вызов updateSlideElement каждый раз,
      пока мы вызываем handleTextChange не реже интервала textSaveTimerTimeout
      Таким образом мы сохраняем text в базу, только если выполняются ОБА условия:
       - Мы изменили text
       - Мы бездействовали больше интервала textSaveTimerTimeout
    */
		if (this.textSaveTimer) {
			clearTimeout(this.textSaveTimer);
		}
		console.log('addTimeout');
		this.textSaveTimer = setTimeout(() => {
			console.log('setTimeout', this.state.text);
			this.props.updateSlideElement(this.props.element, {text: this.state.text});
		}, this.textSaveTimerTimeout);
	};

	handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({fontSize: Number(e.target.value)});
	};

	handleApplyFontSize = (e: any) => {
		this.editor.formatter.apply('fontSizeChange', {
			value: `${Number(e.target.innerText)}px`,
		});
	};

	handleFontSizeKeyDown = (e: React.KeyboardEvent<{}>) => {
		if (e.key !== 'Enter' || !this.state.fontSize) {
			return;
		}

		e.preventDefault();

		this.editor.formatter.apply('fontSizeChange', {
			value: `${this.state.fontSize}px`,
		});
	};

	handleFontSizeArrowClick = () => {
		const {isOpenFontSize} = this.state;

		if (!isOpenFontSize) {
			setTimeout(() => this.editor.editorManager.activeEditor.focus());
		}

		this.setState({
			isOpenFontSize: !isOpenFontSize,
		});
	};

	handleCloseFontSize = () => this.setState({isOpenFontSize: false});

	renderFontSizeOption = (option: number) => (
		<MenuItem onClick={this.handleApplyFontSize}>{option}</MenuItem>
	);

	renderFontSizeInput = (params: RenderInputParams) => (
		<TextField
			{...params}
			type="number"
			variant="outlined"
			fullWidth
			onChange={this.handleFontSizeChange}
			onKeyDown={this.handleFontSizeKeyDown}
		/>
	);

	render() {
		const {element, selectedElement} = this.props;
		let {isRichTextEditorEnabled} = this.props;
		const {text, fontSize, isOpenFontSize} = this.state;

		if (!selectedElement || element._id !== selectedElement._id) {
			isRichTextEditorEnabled = false;
		}

		return (
			<div
				className={css.textWidget}
				ref={this.editorOuter}
				style={{
					height: '100%',
					overflow: 'hidden',
					lineHeight: element.lineHeight,
					textAlign: element.textAlign,
					letterSpacing: `${element.letterSpacing}em`,
					opacity: element.opacity,
					color: element.textColor,
					backgroundColor: element.backgroundColor,
					backgroundImage: getBackgroundImageUrl(element.backgroundImage),
					backgroundRepeat:
						element.backgroundImageDisplay !== SlideshowBackgroundImageDisplayEnum.TILE
							? 'no-repeat'
							: 'repeat',
					backgroundSize: getBackgroundImageSize(element.backgroundImageDisplay),
					padding: element.padding,
				}}
			>
				<div style={{display: 'none'}}>
					<div ref={this.fontSizeInput} className={css.fontSizeContainer}>
						<ClickAwayListener onClickAway={this.handleCloseFontSize}>
							<Autocomplete
								options={this.fontSizes}
								getOptionLabel={(option) => option.toString()}
								renderInput={this.renderFontSizeInput}
								renderOption={this.renderFontSizeOption}
								value={fontSize}
								open={isOpenFontSize}
								popupIcon={
									<ArrowDropDown
										onClick={this.handleFontSizeArrowClick}
										style={{color: colors.grey[500]}}
									/>
								}
								onChange={this.handleApplyFontSize}
								disableClearable
								disabledItemsFocusable
								selectOnFocus={false}
								openOnFocus={false}
								getOptionSelected={(option) => !option}
								filterOptions={(options) => options}
								size="small"
								openText="Выбрать"
								closeText="Закрыть"
								classes={{
									root: css.fontSizeAutocomplete,
									inputRoot: css.fontSizeInputRoot,
									popupIndicator: css.fontSizePopupIndicator,
									option: css.fontSizeOption,
								}}
							/>
						</ClickAwayListener>
					</div>
				</div>

				<Editor
					init={this.editorInit}
					disabled={!isRichTextEditorEnabled}
					value={text}
					apiKey="359ivggbikgqtpt69fj5pybyk2ntf72qnxu99s9s599nfyqb"
					onEditorChange={this.handleTextChange}
					onFocus={() => this.props.onEditorFocus?.()}
					onBlur={() => this.props.onEditorBlur?.()}
				/>
			</div>
		);
	}
}

export default connect(
	(state: RootState) => ({
		selectedElement: state.slideShowEditor.selectedElement,
		isRichTextEditorEnabled: state.slideShowEditor.isRichTextEditorEnabled,
	}),
	{updateSlideElement},
)(TextWidgetEditor);
