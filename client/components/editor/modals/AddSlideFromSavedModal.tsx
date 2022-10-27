import * as React from 'react';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import MenuItem from '@material-ui/core/MenuItem';
import Modal from 'client/components/common/ui/Modal';
import Select from 'client/components/editor/sidebarPanelUI/Select';
import {Formik, Form, FormikActions} from 'formik';
import Button from '@material-ui/core/Button';
import {DialogContent} from '@material-ui/core';
import {Meteor} from 'meteor/meteor';
import {connect} from 'react-redux';

import {withTracker} from 'react-meteor-data-with-tracker';
import {publishNames} from 'shared/constants/publishNames';
import {SlideMockup, ISlideMockup} from 'shared/collections/SlideMockups';
import {addSlide} from 'client/actions/slideShowEditor';

interface IAddSlideFromSavedModalProps {
	isOpen: boolean;
	addSlide: (slideMockup?: string) => Promise<void>;
	onClose: () => void;
}
interface IAddSlideFromSavedModalData {
	slideMockups: ISlideMockup[];
}

interface ISlideSaveFormValues {
	slideMockup: string;
}

class AddSlideFromSavedModal extends React.Component<
	IAddSlideFromSavedModalProps & IAddSlideFromSavedModalData
> {
	handleSubmit = (values: ISlideSaveFormValues, actions: FormikActions<ISlideSaveFormValues>) => {
		const {onClose} = this.props;

		this.props.addSlide(values.slideMockup).then(() => {
			actions.setSubmitting(false);
			onClose();
		});
	};

	render() {
		const {isOpen, onClose, slideMockups} = this.props;

		return (
			<Formik onSubmit={this.handleSubmit} initialValues={{}}>
				<Modal title="Добавление из сохранённых" isOpen={isOpen} onClose={onClose}>
					<Form>
						<DialogContent>
							<Select name="slideMockup" label="Выберете макет">
								{slideMockups.map((mockup) => (
									<MenuItem key={mockup._id} value={mockup._id}>
										{mockup.name} {mockup.isDefault && '(системный)'}
									</MenuItem>
								))}
							</Select>
						</DialogContent>

						<DialogActions>
							<Button variant="contained" onClick={onClose}>
								Отменить
							</Button>

							<Button color="primary" variant="contained" type="submit">
								Создать слайд
							</Button>
						</DialogActions>
					</Form>
				</Modal>
			</Formik>
		);
	}
}

export default connect(null, {
	addSlide,
})(
	withTracker<IAddSlideFromSavedModalData, IAddSlideFromSavedModalProps>(() => {
		const sub = Meteor.subscribe(publishNames.mockups.userMockups);
		const loading = !sub.ready();

		return {
			loading,
			slideMockups: SlideMockup.find({}).fetch(),
		};
	})(AddSlideFromSavedModal),
);
