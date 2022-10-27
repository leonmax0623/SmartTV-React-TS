import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';

import routerUrls from 'client/constants/routerUrls';
import './HomePage.scss';

class HomePage extends React.PureComponent<RouteComponentProps> {
	render() {
		return (
			<div className="landing">
				<header className="header">
					<div className="parallax">
						<div className="full-bg-img">
							<div className="container">
								<h2 className="title">PRTV</h2>
								<hr className="hr" />
								<h3 className="subtitle">
									Размещайте объявления на экранах телевизоров в подъездах домов и
									офисных зданиях.
								</h3>
								<a
									href={routerUrls.authLogin}
									className="btn btn-rounded btn-primary"
								>
									Вход
								</a>
								<a
									href={routerUrls.authRegistration}
									className="btn btn-rounded btn-info"
								>
									Зарегистрироваться бесплатно
								</a>
							</div>
						</div>
					</div>
				</header>
				<main>
					<div className="container">
						<section id="features" className="features-block">
							<h1 className="features-title">Возможности</h1>

							<p className="section-description">
								Создавайте презентации для телевизоров с огромным числом
								возможностей в пару кликов. Огромный выбор источников данных:
								погода, курсы валют, VK, ОК, Facebook и другие.
							</p>

							<div className="row features">
								<div className="col-md-4 text-center">
									<div className="icon-area">
										<div className="circle-icon">
											<i className="fa fa-gears" />
										</div>
										<br />
										<strong>Персонализация</strong>
										<div className="feature-desc">
											<p>
												Полная настройка презентации: задавайте цвет фона,
												шрифт цвет и размер текста, отступы.
											</p>
										</div>
									</div>
								</div>

								<div className="col-md-4 text-center">
									<div className="icon-area">
										<div className="circle-icon">
											<i className="fa fa-book" />
										</div>
										<br />
										<strong>Легкость в освоении</strong>
										<div className="feature-desc">
											<p>
												Интерфейс создания призентации интуитивно поняте и
												вам не составит труда сделать презентацию любой
												сложности!
											</p>
										</div>
									</div>
								</div>

								<div className="col-md-4 text-center">
									<div className="icon-area">
										<div className="circle-icon">
											<i className="fa fa-users" />
										</div>
										<br />
										<strong>Бесплатная подджержка</strong>
										<div className="feature-desc">
											<p>
												Обращайтесь к нам по любым вопросам, связанных с
												нашим приложением
											</p>
										</div>
									</div>
								</div>
							</div>
						</section>

						{/*
						<hr className="between-sections" />

						<section className="get-block">
							<div className="row">
								<div className="col-md-7 col-sm-12 center-on-small">
									<h3 className="get-subtitle">Many free templates</h3>
									<h1 className="get-title">Get The Most Amazing Builder</h1>
									<p className="grey-text">Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
									<p className="grey-text">Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim. </p>
									<a href="#demo" className="btn btn-rounded btn-indigo-2">
										<i className="fa fa-eye"></i>Live demo
									</a>
								</div>
								<div className="img-container col-md-4 col-sm-12 offset-md-1 center-on-small-only">
									<img src="img/tablet.png" alt="" className="img-fluid" />
								</div>
							</div>
						</section>
						<hr className="between-sections" />
						<section id="testimonials" className="team-block">
							<h1 className="text-center team-title">What Clients said:</h1>
							<p className="section-description">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit, error amet numquam iure provident voluptate esse quasi, veritatis totam voluptas nostrum quisquam eum porro a pariatur accusamus veniam.</p>
							<div className="row text-center team-persons">
								<div className="col-md-4">
									<div className="testimonial">
										<div className="team-avatar">
											<img src="img/person1.jpg" className="img-fluid" />
										</div>
										<h4 className="team-person-name">Anna Deynah</h4>
										<h6 className="font-bold grey-text team-person-prof">Web Designer</h6>
										<p><i className="fa fa-quote-left"></i> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod eos id officiis hic tenetur quae quaerat ad velit ab hic tenetur.</p>
									</div>
								</div>
								<div className="col-md-4">
									<div className="testimonial">
										<div className="team-avatar">
											<img src="img/person2.jpg" className="img-fluid" />
										</div>
										<h4 className="team-person-name">John Doe</h4>
										<h6 className="font-bold grey-text team-person-prof">Web Developer</h6>
										<p><i className="fa fa-quote-left"></i> Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi.</p>
									</div>
								</div>
								<div className="col-md-4">
									<div className="testimonial">
										<div className="team-avatar">
											<img src="img/person3.jpg" className="img-fluid" />
										</div>
										<h4 className="team-person-name">Maria Kate</h4>
										<h6 className="font-bold grey-text team-person-prof">Photographer</h6>
										<p><i className="fa fa-quote-left"></i> At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti.</p>
									</div>
								</div>
							</div>
						</section>
						*/}
					</div>
				</main>

				<footer className="page-footer center-on-small-only">
					<div className="container-fluid">
						{/*
						<div className="row">
							<div className="col-sm-12 text-center first-row">
								<i className="fa fa-code fa-4x footer-icon"></i>
								<h2 className="footer-title">Subscribe to get news</h2>
								<p className="footer-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
								<a className="btn btn-rounded btn-pink" data-toggle="modal" data-target="#modal-subscription">Subscribe</a>
								<a className="btn btn-rounded btn-info" data-toggle="modal" data-target="#modal-contact">Contact form</a>
							</div>
						</div>
						*/}
						<div className="footer-copyright">
							<div className="container-fluid">© PRTV, 2018</div>
						</div>
					</div>
				</footer>
			</div>
		);
	}
}

export default HomePage;
