import React, {useState} from 'react';
import {Formik, FormikActions} from 'formik';
import {Box, DialogActions, DialogContent, Grid} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Input from 'client/components/common/ui/Input';
import Button from '@material-ui/core/Button';
import Modal from 'client/components/common/ui/Modal';
import {Meteor} from 'meteor/meteor';
import {methodNames} from 'shared/constants/methodNames';
import {IResponseError, IResponseSuccess} from 'shared/models/Response';
import {IFaqItem} from 'shared/collections/Faq';

interface IFaqItemDialogProps {
	isOpen: boolean;
	onClose: () => void;
	faqItem?: IFaqItem;
	parentKey: string;
}
const FaqItemDialog: React.FC<IFaqItemDialogProps> = ({isOpen, onClose, faqItem, parentKey}) => {
	const isEdit = !!faqItem;
	const [error, setError] = useState('');
	const initialFormValues = {
		title: faqItem?.title || '',
		content: faqItem?.content || '',
	};
	const validateForm = ({title, content}: {title: string; content: string}) => {
		const errors: {title?: string; content?: string} = {};
		if (!title) {
			errors.title = 'Поле не может быть пустым';
		}
		if (!content) {
			errors.content = 'Поле не может быть пустым';
		}

		return errors;
	};
	const handleClose = () => {
		if (onClose) {
			onClose();
		}
	};
	const onSubmitHandler = (
		{title, content}: {title: string; content: string},
		actions: FormikActions<{title: string; content: string}>,
	) => {
		Meteor.call(
			methodNames.faq.addItem,
			{
				update: isEdit,
				key: parentKey,
				item: {
					title,
					content,
					id: faqItem?.id,
				},
			},
			(errorData: Error | Meteor.Error, response: IResponseError | IResponseSuccess) => {
				actions.setSubmitting(false);
				if (errorData) {
					actions.setErrors({title: errorData.message});
					return;
				}

				const err = response?.error;
				if (err) {
					const titleError = err?.fields?.title;
					const contentError = err?.fields?.title;
					if (titleError) {
						actions.setErrors({title: titleError});
					} else if (contentError) {
						actions.setErrors({content: contentError});
					}
					if (err?.message) {
						actions.setErrors(err.message);
					}

					return;
				}
				if (onClose) {
					onClose();
				}
			},
		);
	};

	return (
		<Modal title="Изменение раздела" onClose={handleClose} isOpen={isOpen}>
			<Formik
				onSubmit={onSubmitHandler}
				initialValues={initialFormValues}
				validate={validateForm}
			>
				{({handleSubmit, isSubmitting, status}) => (
					<form onSubmit={handleSubmit}>
						<DialogContent>
							<Typography gutterBottom>Заголовок</Typography>
							<Input
								name="title"
								label=""
								placeholder="Введите заголовок"
								inputProps={{autoFocus: true}}
							/>
							<Typography gutterBottom>Контент</Typography>
							<Input name="content" placeholder="Введите контент" />

							{error ? (
								<Box pt={3} color="red">
									{error}
								</Box>
							) : (
								''
							)}
						</DialogContent>

						<DialogActions>
							<Grid container style={{justifyContent: 'flex-end'}}>
								<Grid item>
									<Button style={{marginRight: 10}} onClick={handleClose}>
										Отменить
									</Button>

									<Button
										variant="contained"
										color="primary"
										type="submit"
										disabled={isSubmitting}
									>
										Сохранить
									</Button>
								</Grid>
							</Grid>
						</DialogActions>
					</form>
				)}
			</Formik>
		</Modal>
	);
};

export default FaqItemDialog;
