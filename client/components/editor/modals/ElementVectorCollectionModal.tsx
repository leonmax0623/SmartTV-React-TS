import * as React from 'react';
import {connect} from 'react-redux';
import {withTracker} from 'react-meteor-data-with-tracker';

import pick from 'lodash/pick';

import {updateSlideStyles, createSlideshowActions} from 'client/actions/slideShowEditor';
import {Form, Formik, FormikActions} from 'formik';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import Button from '@material-ui/core/Button/Button';

import Paper from '@material-ui/core/Paper';

import Modal from 'client/components/common/ui/Modal';
import {IUpdateElementStyles} from 'shared/models/SlideshowMethodParams';
import {ISlideElement, ISlideElementAnimationNames} from 'shared/collections/SlideElements';
import {Meteor} from 'meteor/meteor';
import {methodNames} from 'shared/constants/methodNames';
import appConsts from 'client/constants/appConsts';
import {
	SlideVectorElement,
	ISlideVectorElement,
	SlideVectorElementTagText,
	SlideVectorElementTag,
} from 'shared/collections/SlideVectorElements';
import {publishNames} from '../../../../shared/constants/publishNames';

interface IElementVectorCollectionProps {
	isOpen: boolean;
	element: ISlideElement;
	onClose: () => void;
	onSubmit: (elementStyles: IUpdateElementStyles) => void;
}

interface IVectorsData {
	vectorsList: ISlideVectorElement[];
	subMyList: boolean;
}

interface IVectorCollectionState {
	elements: [string];
}

class ElementVectorCollectionModal extends React.Component<
	IElementVectorCollectionProps & IVectorsData
> {
	state: IVectorCollectionState = {elements: []};

	handleSaveSettings: (
		values: IUpdateElementStyles,
		{setSubmitting}: FormikActions<IUpdateElementStyles>,
	) => void = (values) => {
		const {onSubmit, onClose} = this.props;
		if (values) {
			onSubmit(values);
		}
		onClose();
	};

	refresher = () => {
		Meteor.callAsync(methodNames.service.readVectorCollectionFolder)
			.then((response) => {
				// console.log(response);
				// this.setState({elements: response});
			})
			.catch((error) => {
				console.log(error);
				throw error;
			});
	};

	toggleTag = (key) => {
		if (this.state.elements.includes(key)) {
			this.setState({elements: this.state.elements.filter((tag) => tag !== key)});
		} else {
			this.setState({elements: [key, ...this.state.elements]});
		}
	};

	render() {
		const {isOpen, onClose, onSubmit, vectorsList, subMyList} = this.props;
		const {elements} = this.state;
		return (
			<Modal
				title={'Коллекция векторных элементов'}
				isOpen={isOpen}
				onClose={onClose}
				fullWidth
			>
				<DialogContent>
					<div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
						<span style={{padding: '9px 7px'}}>Фильтр:</span>
						{SlideVectorElementTag.getValues().map((key) => {
							return (
								<Button
									color={elements.includes(key) ? 'primary' : 'default'}
									variant={'contained'}
									onClick={() => this.toggleTag(key)}
									style={{marginLeft: 5}}
								>
									{SlideVectorElementTagText[key]}
								</Button>
							);
						})}
					</div>
					<div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
						{vectorsList
							.filter((item) => {
								return (
									elements.length === 0 ||
									item.tags.filter((tag) => elements.includes(tag)).length > 0
								);
							})
							.map((svg, i) => {
								return (
									<Paper
										key={'vect' + i}
										square
										variant="outlined"
										style={{
											minWidth: '100px',
											maxWidth: '150px',
											margin: '5px',
											display: 'flex',
											padding: '5px',
										}}
										onClick={() => onSubmit(appConsts.svgUrl + '/' + svg.path)}
									>
										<img
											style={{width: '100%', maxHeight: '200px'}}
											src={appConsts.svgUrl + '/' + svg.path}
											loading="lazy"
										/>
									</Paper>
								);
							})}
					</div>
				</DialogContent>

				<DialogActions>
					{!vectorsList.length && subMyList && (
						<Button variant="contained" onClick={this.refresher}>
							Обновить
						</Button>
					)}
					<Button variant="contained" onClick={onClose}>
						Отменить
					</Button>
				</DialogActions>
			</Modal>
		);
	}
}

export default withTracker(
	(): IVectorsData => {
		const subMyList = Meteor.subscribe(publishNames.slideshow.vectors).ready();
		return {
			vectorsList: SlideVectorElement.find({}, {sort: {name: -1}}).fetch(),
			subMyList,
		};
	},
)(connect(null, {updateSlideStyles})(ElementVectorCollectionModal));
