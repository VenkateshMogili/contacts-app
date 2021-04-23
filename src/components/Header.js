import React, { Component } from 'react';
import '../styles/Header.css';
import Contacts from './Contacts';
export default class Header extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hideSideNav: true,
			updatedContacts: false,
			contacts: [],
			currentUser: {},
			currentUserChanged: false,
		};
	}
	componentDidMount() {
		this.getContacts();
		this.getCurrentUser();
	}
	componentDidUpdate() {
		if (this.state.updatedContacts) {
			this.getContacts();
			this.getCurrentUser();
			this.setState({ updatedContacts: false });
		}
		if (this.state.currentUserChanged) {
			this.getContacts();
			this.getCurrentUser();
			this.setState({ currentUserChanged: false });
		}
	}
	// get all contacts
	getContacts = () => {
		let contacts = localStorage.getItem('contacts') ? JSON.parse(localStorage.getItem('contacts')) : null;
		if (contacts !== null) {
			this.setState({ contacts });
		}
	};

	// get current user details.
	getCurrentUser = () => {
		let currentUser = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : null;
		if (currentUser !== null) {
			this.setState({ currentUser });
			setTimeout(() => {
				this.loginCheck(currentUser.id);
			}, 500);
		}
	};
	// set current user details.
	setCurrentUser = (contact) => {
		localStorage.setItem('currentUser', JSON.stringify(contact));
		this.setState({ currentUser: contact, currentUserChanged: true });
	};

	// recheck user login
	loginCheck(id) {
		let loadContacts = [ ...this.state.contacts ];
		let getIndex = loadContacts.findIndex((contact) => contact.id === id);
		loadContacts.splice(getIndex, 1);
		this.setState({ contacts: loadContacts });
	}

	render() {
		const { hideSideNav, currentUserChanged, currentUser, contacts } = this.state;
		return (
			<div>
				<div className='d-flex flex-row'>
					<nav
						className={
							hideSideNav ? (
								'sidebar mobile-sidenav d-none d-sm-none d-md-block'
							) : (
								'sidebar d-none d-sm-none d-md-block'
							)
						}>
						<div className='sticky-top' style={{ height: window.innerHeight }}>
							<ul className='nav flex-column'>
								<li className='nav-item mt-3'>
									{!hideSideNav && (
										<div
											href='/'
											className='nav-link'
											onClick={() => this.setState({ hideSideNav: !hideSideNav })}>
											<i className='fa fa-align-right text-white' />
										</div>
									)}
									{hideSideNav && (
										<div
											href='/'
											className='nav-link'
											onClick={() => this.setState({ hideSideNav: !hideSideNav })}>
											<i className='fa fa-align-left text-white' />
										</div>
									)}
								</li>
								<br />
								<li className='nav-item'>
									<a className='nav-link' href='/'>
										<i className='fa fa-home' />{' '}
										<span className={hideSideNav ? 'd-none' : ''}>Home</span>
									</a>
								</li>
								<li className='nav-item'>
									<a className='nav-link active' href='/contacts'>
										<i className='fa fa-user' />{' '}
										<span className={hideSideNav ? 'd-none' : ''}>Contacts</span>
									</a>
								</li>
								<li className='nav-item'>
									<a className='nav-link' href='/reports'>
										<i className='fa fa-book' />{' '}
										<span className={hideSideNav ? 'd-none' : ''}>Reports</span>
									</a>
								</li>
								<li className='nav-item'>
									<a className='nav-link' href='/history'>
										<i className='fa fa-history' />{' '}
										<span className={hideSideNav ? 'd-none' : ''}>History</span>
									</a>
								</li>
								<li className='nav-item'>
									<a className='nav-link' href='/database'>
										<i className='fa fa-database' />{' '}
										<span className={hideSideNav ? 'd-none' : ''}>Database</span>
									</a>
								</li>
								<li className='nav-item'>
									<a className='nav-link' href='/calendar'>
										<i className='fa fa-calendar' />{' '}
										<span className={hideSideNav ? 'd-none' : ''}>Calendar</span>
									</a>
								</li>
								<li className='nav-item'>
									<a className='nav-link' href='/settings'>
										<i className='fa fa-gear' />{' '}
										<span className={hideSideNav ? 'd-none' : ''}>Settings</span>
									</a>
								</li>
							</ul>
						</div>
					</nav>
					<Contacts
						updatedContacts={(status) => this.setState({ updatedContacts: status })}
						currentUserChanged={currentUserChanged}
						currentUserChangedStatus={(status) => this.setState({ currentUserChanged: status })}
					/>
				</div>
				<nav
					className='navbar fixed-top navbar-expand-lg navbar-light bg-light ml-md-5 pl-md-2 border-bottom'
					style={{ zIndex: !hideSideNav ? '-1' : '0' }}>
					<button
						className='navbar-toggler'
						type='button'
						data-toggle='collapse'
						data-target='#navbarSupportedContent'
						aria-controls='navbarSupportedContent'
						aria-expanded='false'
						aria-label='Toggle navigation'>
						<span className='navbar-toggler-icon' />
					</button>

					<div className='collapse navbar-collapse' id='navbarSupportedContent'>
						<ul className='navbar-nav mr-auto d-none d-sm-block'>
							<li className='nav-item active'>
								<button className='nav-link'>
									<i className='fa fa-search searchicon p10 rounded-circle' />
								</button>
							</li>
						</ul>
						<div className='form-inline my-2 my-lg-0'>
							<ul className='navbar-nav mr-auto'>
								<li className='nav-item dropdown'>
									<button
										className='nav-link dropdown-toggle'
										id='navbarDropdown'
										data-toggle='dropdown'
										aria-haspopup='true'
										aria-expanded='false'>
										<i className='fa fa-user' /> &nbsp;
										{Object.keys(currentUser).length > 0 ? (
											currentUser.firstname + ' ' + currentUser.lastname
										) : (
											'Login'
										)}
									</button>
									<div className='dropdown-menu dropdown-menu-right' aria-labelledby='navbarDropdown'>
										{contacts.length > 0 &&
											contacts.map((contact) => (
												<button
													className='dropdown-item'
													key={contact.id}
													onClick={() => this.setCurrentUser(contact)}>
													{contact.firstname + ' ' + contact.lastname}
												</button>
											))}
										{contacts.length === 0 && <p className='text-center'>No Contact Found!</p>}
									</div>
								</li>
							</ul>
						</div>
					</div>
				</nav>
			</div>
		);
	}
}
