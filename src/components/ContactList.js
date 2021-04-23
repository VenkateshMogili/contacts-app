import React, { Component } from 'react';
import '../styles/ContactList.css';
import Chat from './Chat';
const Swal = window.Swal;
const $ = window.jQuery;
$(function() {
	$('[data-toggle="tooltip"]').tooltip();
});
export class ContactList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			user: {},
			chatEnabled: false,
			loadChat: false,
		};
	}
	componentDidUpdate() {
		if (this.props.updatedContact) {
			this.setState({ loadChat: false, chatEnabled: false, user: {} });
			this.props.updateContactStatus(false);
		}
	}
	// Filter the contacts
	filterContacts = (contacts) => {
		return contacts.filter(
			(contact) =>
				contact.firstname.toLowerCase().indexOf(this.props.searchContact.toLowerCase()) !== -1 ||
				contact.lastname.toLowerCase().indexOf(this.props.searchContact.toLowerCase()) !== -1 ||
				(contact.firstname.toLowerCase() + ' ' + contact.lastname.toLowerCase()).indexOf(
					this.props.searchContact.toLowerCase(),
				) !== -1 ||
				contact.company.toLowerCase().indexOf(this.props.searchContact.toLowerCase()) !== -1 ||
				contact.email.toLowerCase().indexOf(this.props.searchContact.toLowerCase()) !== -1,
		);
	};

	// View Contact Details
	showDetails = (user) => {
		this.setState({ user, chatEnabled: false });
		this.scrollToDetails();
	};
	// Edit Contact Details
	editContact = (contact) => {
		this.props.editContact(contact);
		this.setState({
			loadChat: false,
			chatEnabled: false,
			user: {},
		});
	};
	// View Chat
	showChat = (user) => {
		let currentUser = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : null;
		if (currentUser !== null) {
			this.setState({ user, chatEnabled: true, loadChat: true });
			this.scrollToChat();
		} else {
			this.callAlert('warning', 'Warning', 'Please Login to continue');
		}
	};
	// Scroll to View Details Section
	scrollToDetails = () => {
		setTimeout(() => {
			this.details.scrollIntoView({ behavior: 'smooth' });
		}, 500);
	};
	// Scroll to Chat window
	scrollToChat = () => {
		setTimeout(() => {
			this.chatwindow.scrollIntoView({ behavior: 'smooth' });
		}, 1000);
	};
	// Common Sweet Alert
	callAlert = (icon, title, text) => {
		Swal.fire({
			icon,
			title,
			text,
			timer: 1500,
		});
	};
	render() {
		const { contacts } = this.props;
		const { user, chatEnabled, loadChat } = this.state;
		return (
			<div className='row ml-md-4 ml-lg-4 ml-sm-4 pl-md-0'>
				<table className='table table-hover col-sm-12 col-md-12 col-lg-6'>
					<thead className='border-0'>
						<tr>
							<th scope='col'>Basic Info</th>
							<th scope='col'>Company</th>
							<th scope='col'>Actions</th>
						</tr>
					</thead>
					<tbody>
						{contacts &&
							this.filterContacts(contacts).map((contact) => (
								<tr key={contact.id}>
									<td className='d-flex flex-row'>
										<div>
											<div className='nameImage text-center text-white rounded-circle p5'>
												{contact.firstname[0] + ' ' + contact.lastname[0]}
											</div>
										</div>
										<div className='ml-2'>
											{(contact.firstname + ' ' + contact.lastname).length > 16 ? (
												(contact.firstname + ' ' + contact.lastname).substr(0, 16) + '...'
											) : (
												contact.firstname + ' ' + contact.lastname
											)}
											<span className='small d-block'>{contact.email}</span>
										</div>
									</td>
									<td>
										{contact.company.length > 16 ? (
											contact.company.substr(0, 16) + '...'
										) : (
											contact.company
										)}
									</td>
									<td>
										<div className='d-flex flex-column flex-md-row'>
											<div className='d-flex flex-row'>
												<i
													className='fa fa-eye action'
													data-toggle='tooltip'
													data-placement='top'
													title='View Contact'
													onClick={() => this.showDetails(contact)}
												/>{' '}
												&nbsp;&nbsp;&nbsp;
												<i
													className='fa fa-edit action'
													data-toggle='tooltip'
													data-placement='top'
													title='Edit Contact'
													onClick={() => this.editContact(contact)}
												/>{' '}
											</div>
											&nbsp;&nbsp;&nbsp;
											<div className='d-flex flex-row'>
												<i
													className='fa fa-trash action'
													data-toggle='tooltip'
													data-placement='top'
													title='Delete Contact'
													onClick={() => this.props.deleteContact(contact.id)}
												/>{' '}
												&nbsp;&nbsp;&nbsp;
												<i
													className='fa fa-comments action'
													data-toggle='tooltip'
													data-placement='top'
													title='Chat'
													onClick={() => this.showChat(contact)}
												/>
											</div>
										</div>
									</td>
								</tr>
							))}
					</tbody>
				</table>
				<div className='col-sm-12 col-md-12 col-lg-6 pr-0 pl-2' ref={(ref) => (this.details = ref)}>
					{Object.keys(user).length > 0 &&
					!chatEnabled && (
						<div className='ml-lg-5 col-md-12 bg-lightgray'>
							<div className='d-flex flex-column align-items-center pt-4 pb-5'>
								<div className='nameImage nameImageBig text-center text-white rounded-circle p5'>
									{user.firstname[0] + ' ' + user.lastname[0]}
								</div>
								<h3>{user.firstname + ' ' + user.lastname}</h3>
								<span>{user.company}</span>
							</div>
							<DetailsRow title={'Full Name'} value={user.firstname + ' ' + user.lastname} />
							<DetailsRow title={'Email'} value={user.email} />
							<DetailsRow title={'Phone'} value={user.phone} />
							<DetailsRow title={'Company'} value={user.company} />
							<DetailsRow title={'Address'} value={user.address} lastrow={true} />
						</div>
					)}
					{chatEnabled && (
						<div className='ml-lg-5 col-md-12 bg-lightgray p-0' ref={(ref) => (this.chatwindow = ref)}>
							<Chat
								receiver={user}
								selectedUser={loadChat}
								selectUserBack={(status) => this.setState({ loadChat: status })}
							/>
						</div>
					)}
				</div>
			</div>
		);
	}
}
const DetailsRow = (props) => {
	return (
		<div>
			<div className={props.lastrow ? 'd-flex flex-row pb-3' : 'd-flex flex-row'}>
				<span className='col-md-4 text-lightgray'>{props.title}:</span>
				<span className='col-lg-offset-2 col-md-6'>{props.value}</span>
			</div>
			{!props.lastrow && <hr />}
		</div>
	);
};

export default ContactList;
