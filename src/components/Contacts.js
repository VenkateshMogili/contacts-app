import React, { Component } from 'react';
import '../styles/Contacts.css';
import AddEditContact from './AddEditContact';
import ContactList from './ContactList';
const Swal = window.Swal;
export default class Contacts extends Component {
	constructor(props) {
		super(props);

		this.state = {
			contacts: [],
			typeOfAction: 'Add',
			contact: {},
			updateContact: false,
			updateContactUser: false,
			searchContact: '',
			sortBy: 'updatedDate',
		};
	}
	componentDidMount() {
		// fetch contacts
		this.getContacts();
	}
	componentDidUpdate() {
		if (this.state.refreshContacts) {
			this.getContacts();
			this.setState({ refreshContacts: false });
			this.props.updatedContacts(true);
		}
		if (this.props.currentUserChanged) {
			this.getContacts();
			this.setState({ updateContactUser: true });
			this.props.currentUserChangedStatus(false);
		}
	}
	// fetch contacts
	getContacts = () => {
		let contacts = localStorage.getItem('contacts');
		if (contacts !== null) {
			contacts = JSON.parse(contacts);
			let currentUser = JSON.parse(localStorage.getItem('currentUser'));
			if (currentUser !== null) {
				let getIndex = contacts.findIndex((contact) => contact.id === currentUser.id);
				contacts.splice(getIndex, 1);
			}
			this.setState({ contacts });
			this.defaultSort();
		}
	};
	editContact = (contact) => {
		this.setState({ contact, updateContact: true });
		document.getElementById('openPopup').click();
	};

	// Delete Contact
	deleteContact = (id) => {
		this.confirmDelete('warning', 'Confirm', 'Are you sure want to delete?', id);
	};
	confirmDelete = (icon, title, text, id) => {
		Swal.fire({
			icon,
			title,
			text,
			showCancelButton: true,
			confirmButtonText: 'Yes, Delete!',
		}).then((result) => {
			if (result.isConfirmed) {
				let contacts = [ ...this.state.contacts ];
				let getIndex = contacts.findIndex((contact) => contact.id === id);
				contacts.splice(getIndex, 1);
				localStorage.setItem('contacts', JSON.stringify(contacts));
				this.setState({ contacts, updateContactUser: true });
				Swal.fire({
					title: 'Deleted!',
					text: 'Contact has been deleted.',
					icon: 'success',
					timer: 1500,
					showConfirmButton: false,
				});
				this.props.updatedContacts(true);
			}
		});
	};
	// Sort Contacts
	defaultSort = () => {
		setTimeout(() => {
			this.sortByContacts(this.state.sortBy);
		}, 500);
	};
	sortByContacts = (sortKey) => {
		let contacts = [ ...this.state.contacts ];
		let sorted = contacts.sort((a, b) => {
			return a[sortKey] > b[sortKey] ? 1 : a[sortKey] < b[sortKey] ? -1 : 0;
		});
		this.setState({ contacts: sorted });
	};

	render() {
		const { contact, contacts, updateContact, updateContactUser, searchContact } = this.state;
		return (
			<div className='container mt-5 pt-3 pl-lg-3 pl-xs-0 ml-lg-4 ml-xs-1'>
				<div className='d-flex flex-row mt-3 justify-content-start align-items-center'>
					<i className='fa fa-address-book-o idcard text-white' />
					<h3 className='d-flex flex-column pl-3'>
						<span className='heading'>Contacts</span>
						<span className='tagline text-secondary small'>Welcome to DoodleBlue.com</span>
					</h3>
					<div className='d-flex flex-row col-sm-6 col-md-6 col-lg-3 justify-content-center align-items-center ml-4'>
						<span className='sortBy text-secondary'>Sort by:</span>
						<select
							className='ml-2 sortDropdown border-0 font-weight-bold'
							onChange={(e) => this.sortByContacts(e.target.value)}>
							<option value='updatedDate'>Date Created</option>
							<option value='firstname'>Name</option>
							<option value='company'>Company</option>
							<option value='email'>Email</option>
						</select>
					</div>
				</div>
				<div className='row ml-md-4 mt-4 mb-4 pl-1 pr-1'>
					<input
						type='text'
						placeholder='Search contacts'
						value={searchContact}
						onChange={(e) => this.setState({ searchContact: e.target.value })}
						className='col-sm-6 col-md-6 col-lg-3 search-contacts border'
					/>
					<i className='fa fa-search searchContact d-none d-md-block' />
					&nbsp;&nbsp;&nbsp;
					<button
						className='col-sm-4 col-md-4 col-lg-2 add-contact border-0 text-white'
						data-toggle='modal'
						data-target='#exampleModalCenter'
						onClick={() => this.setState({ contact: {} })}>
						+ Add Contact
					</button>
					<button hidden id='openPopup' data-toggle='modal' data-target='#exampleModalCenter'>
						Edit
					</button>
				</div>
				<div
					className='modal fade'
					id='exampleModalCenter'
					tabIndex='-1'
					role='dialog'
					data-backdrop='static'
					aria-labelledby='staticBackdropLabel'
					aria-hidden='true'>
					<AddEditContact
						contact={contact}
						updatedContact={updateContact}
						updateContactStatus={(status) => this.setState({ updateContact: status })}
						refreshContacts={(status) => this.setState({ refreshContacts: status })}
					/>
				</div>

				{contacts.length === 0 && <h3 className='ml-lg-5 nocontacts'>No Contacts Found!</h3>}
				{contacts.length > 0 && (
					<ContactList
						contacts={contacts}
						updatedContact={updateContactUser}
						updateContactStatus={(status) => this.setState({ updateContactUser: status })}
						editContact={(contact) => this.editContact(contact)}
						deleteContact={(id) => this.deleteContact(id)}
						searchContact={searchContact}
					/>
				)}
			</div>
		);
	}
}
