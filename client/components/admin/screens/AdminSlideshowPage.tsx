import * as React from 'react';
import {withTracker} from 'react-meteor-data-with-tracker';
import {Meteor} from 'meteor/meteor';
import {RouteComponentProps} from 'react-router';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import {format} from 'shared/utils/dates';
import routerUrls from '../../../constants/routerUrls';
import DeleteAppDialog from '../../user/screens/DeleteAppDialog';
import {publishNames} from 'shared/constants/publishNames';
import './AdminSlideshowPage.scss';
import {ISlideshow, Slideshow, SlideshowLocationText} from 'shared/collections/Slideshows';
import appConsts from 'client/constants/appConsts';

interface IUser extends Meteor.User {
	name?: string;
	surname?: string;
	phone?: string;
	status?: string;
}

interface IAdminScreensPageProps {
	loading: boolean;
	search?: string;
	slideshows: ISlideshow[];
}

class AdminSlideshowPage extends React.PureComponent<IAdminScreensPageProps & RouteComponentProps> {
	getUserTitle = (userId: string) => {
		const user: IUser = Meteor.users.findOne({_id: userId});

		return user ? `${user.name} ${user.surname}` : userId;
	};

	getBody = () => {
		const {slideshows, loading} = this.props;

		if (loading) {
			return <CircularProgress />;
		}

		if (slideshows.length < 1) {
			return <Typography variant="h6">Нет экранов.</Typography>;
		}

		return (
			<Table size="small">
				<TableHead>
					<TableRow>
						<TableCell>#</TableCell>
						<TableCell>ID</TableCell>
						<TableCell>Пользователь</TableCell>
						<TableCell>Адрес</TableCell>
						<TableCell>Фото</TableCell>
						<TableCell>Вид помещения</TableCell>
						<TableCell>Дата создания</TableCell>
						<TableCell style={{width: 195}}>Действия</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{slideshows.map((slideshow, index) => (
						<TableRow key={slideshow._id}>
							<TableCell>{index + 1}</TableCell>
							<TableCell>{slideshow.numId}</TableCell>
							<TableCell>
								<a
									href={routerUrls.adminUsersEdit.replace(
										':id',
										slideshow.userId,
									)}
								>
									{this.getUserTitle(slideshow.userId)}
								</a>
							</TableCell>
							<TableCell>{slideshow.address}</TableCell>
							<TableCell>
								<div className="small-photo">
									<img
										src={
											slideshow.previewImage
												? `${appConsts.uploadUrl}/${slideshow.previewImage}`
												: `${appConsts.imgUrl}/not_slideshow_img.png`
										}
									/>
								</div>
							</TableCell>
							<TableCell>{SlideshowLocationText[slideshow.location]}</TableCell>
							<TableCell>{format(slideshow.createdAt, 'd MMM yyyy')}</TableCell>
							<TableCell>
								<a href={`http://prtv.su/${slideshow.numId}`}>
									http://prtv.su/{slideshow.numId}
								</a>

								<DeleteAppDialog slideshowId={slideshow._id} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		);
	};

	handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.props.history.replace({
			pathname: this.props.match.path,
			search: `?search=${e.target.value}`,
		});
	};

	render() {
		return (
			<div>
				<Grid container justify="space-between">
					<Grid item>
						<Typography className="pageTitle" variant="h5">
							Экраны
						</Typography>
						<TextField
							label="Поиск"
							variant="outlined"
							onChange={this.handleFontSizeChange}
							defaultValue={this.props.search}
						/>
					</Grid>
				</Grid>

				<Card className="tableCard">{this.getBody()}</Card>
			</div>
		);
	}
}

export default withTracker<IAdminScreensPageProps, RouteComponentProps>((props) => {
	const query = new URLSearchParams(props.location.search);
	const search = query.get('search');
	const slideshowSub = Meteor.subscribe(publishNames.slideshow.listForAdmin, {search});
	const loading = !slideshowSub.ready();

	return {
		search,
		loading,
		slideshows: Slideshow.find({}, {sort: {createdAt: 1}}).fetch(),
	};
})(AdminSlideshowPage);
