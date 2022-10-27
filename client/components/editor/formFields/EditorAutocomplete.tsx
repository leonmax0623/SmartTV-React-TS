import React from 'react';
import TextField, {TextFieldProps} from '@material-ui/core/TextField';
import Autosuggest from 'react-autosuggest';
import {Paper, Popper, withStyles} from '@material-ui/core';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import MenuItem from '@material-ui/core/MenuItem';
import deburr from 'lodash/deburr';

import EditorFieldLabel from 'client/components/editor/formFields/EditorFieldLabel';
import css from './EditorTextInput.pcss';

interface IEditorAutocompleteProps {
	options: IEditorAutocompleteOption[] | [];
	value: string;
	classes: any;
	onSuggChange: (value: string) => void;
	onSuggClear: () => void;
	onSuggSelect: (option: IEditorAutocompleteOption) => void;
}

export interface IEditorAutocompleteOption {
	label: React.ReactNode;
	tooltip?: React.ReactNode;
	value: string;
}

interface IEditorAutocompleteState {
	anchorEl: null | HTMLElement;
}

const styles = {
	suggestion: {
		display: 'block',
	},
	suggestionsList: {
		margin: 0,
		padding: 0,
		listStyleType: 'none',
		maxHeight: 400,
		overflow: 'auto',
	},
};

class EditorAutocomplete extends React.PureComponent<
	TextFieldProps & IEditorAutocompleteProps,
	IEditorAutocompleteState
> {
	autosuggestRef: any | null;

	state = {anchorEl: null};

	renderSuggestion = (
		suggestion: IEditorAutocompleteOption,
		{query, isHighlighted}: Autosuggest.RenderSuggestionParams,
	) => {
		const matches = match(suggestion.label, query);
		const parts = parse(suggestion.label, matches);

		return (
			<MenuItem
				selected={isHighlighted}
				component="div"
				onClick={this.handleSelect(suggestion)}
			>
				<div>
					{parts.map((part) => (
						<span key={part.text} style={{fontWeight: part.highlight ? 500 : 400}}>
							{part.text}
						</span>
					))}
				</div>
			</MenuItem>
		);
	};

	getSuggestions = (value: string) => {
		const inputValue = deburr(value.trim()).toLowerCase();
		const inputLength = inputValue.length;
		let count = 0;

		return inputLength === 0
			? []
			: this.props.options.filter((suggestion) => {
					const keep =
						count < 5 &&
						suggestion.value.slice(0, inputLength).toLowerCase() === inputValue;

					if (keep) {
						count += 1;
					}

					return keep;
			  });
	};

	getSuggestionValue = (suggestion: IEditorAutocompleteOption) => suggestion.value;

	// tslint:disable-next-line:no-empty
	handleSuggestionsFetchRequested = ({value}: any) => {};

	handleSuggestionsClearRequested = () => {
		this.props.onSuggClear();
	};

	handleChange = () => (event: React.ChangeEvent<{}>, {newValue}: Autosuggest.ChangeEvent) => {
		this.props.onSuggChange(newValue);
	};

	handleSelect = (option: IEditorAutocompleteOption) => (e: any) => {
		e.stopPropagation();

		if (this.autosuggestRef) {
			this.autosuggestRef.onSuggestionsClearRequested();
			this.autosuggestRef.justSelectedSuggestion = false;
		}

		this.props.onSuggSelect(option);
	};

	render() {
		const {label, tooltip, options: aOptions, classes} = this.props;
		const {anchorEl} = this.state;

		return (
			<div className={css.inputOuter}>
				<EditorFieldLabel tooltip={tooltip}>{label}</EditorFieldLabel>

				<Autosuggest
					ref={(el) => (this.autosuggestRef = el)}
					suggestions={aOptions}
					onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
					onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
					getSuggestionValue={this.getSuggestionValue}
					renderSuggestion={this.renderSuggestion}
					renderInputComponent={(inputProps: any) => {
						const {...other} = inputProps;
						return (
							<TextField
								{...other}
								label={undefined}
								className={css.container}
								classes={{root: css.controlRoot}}
								InputProps={{
									classes: {root: css.root, input: css.input},
									disableUnderline: true,
								}}
								margin="none"
								variant="filled"
								fullWidth
							/>
						);
					}}
					theme={{
						suggestionsList: classes.suggestionsList,
						suggestion: classes.suggestion,
					}}
					inputProps={{
						value: this.props.value,
						onChange: this.handleChange(),
						inputRef: (node: HTMLInputElement | null) => {
							this.setState({anchorEl: node});
						},
						InputLabelProps: {
							shrink: true,
						},
					}}
					renderSuggestionsContainer={(options) => (
						<Popper
							anchorEl={anchorEl}
							open={Boolean(options.children)}
							style={{
								zIndex: 9999,
							}}
						>
							<Paper
								square
								{...options.containerProps}
								style={{
									marginLeft: anchorEl
										? anchorEl.getBoundingClientRect().left - 6
										: undefined,
								}}
							>
								{options.children}
							</Paper>
						</Popper>
					)}
				/>
			</div>
		);
	}
}

export default withStyles(styles)(EditorAutocomplete);
