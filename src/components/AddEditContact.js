import React, { Component } from 'react';
import moment from 'moment';
const Swal = window.Swal;
export class AddEditContact extends Component {
	constructor(props) {
		super(props);

		this.state = {
			editForm: false,
			submitted: false,
			invalidEmail: false,
			firstname: '',
			lastname: '',
			email: '',
			phone: '',
			company: '',
			address: '',
			id: '',
			updatedDate: '',
		};
	}
	componentDidUpdate() {
		if (this.props.updatedContact) {
			const { id, firstname, lastname, email, phone, company, address } = this.props.contact;
			this.setState({ id, firstname, lastname, email, phone, company, address, editForm: true });
			this.props.updateContactStatus(false);
		}
	}
	// Add Contact Details
	addContactDetails = (e) => {
		e.preventDefault();
		if (this.state.editForm) {
			this.editContactDetails();
		} else {
			const { firstname, lastname, email, phone, company, address } = this.state;
			let updatedDate = moment(new Date()).format('DD-MM-YYYY HH:mm:ss');
			let contacts = localStorage.getItem('contacts');
			if (contacts !== null) {
				contacts = JSON.parse(contacts);
				// Check if the same mail is already exists
				let id = contacts[contacts.length - 1] ? contacts[contacts.length - 1]['id'] + 1 : 0;
				let checkEmail = contacts.filter((contact) => contact.email === email);
				if (checkEmail.length > 0) {
					this.setState({ invalidEmail: true });
					this.callAlert('error', 'Error', 'Email Already Exists');
				} else {
					let newContact = { id, firstname, lastname, email, phone, company, address, updatedDate };
					contacts.push(newContact);
					this.addContactToLocalStorage(contacts, 'add');
				}
			} else {
				let newContact = [ { id: 0, firstname, lastname, email, phone, company, address, updatedDate } ];
				this.addContactToLocalStorage(newContact, 'add');
			}
		}
	};
	// Edit Contact Details
	editContactDetails = () => {
		let contacts = JSON.parse(localStorage.getItem('contacts'));
		// Check if the same mail is already exists
		const { id, firstname, lastname, email, phone, company, address } = this.state;
		let updatedDate = moment(new Date()).format('DD-MM-YYYY HH:mm:ss');
		let checkEmail = contacts.filter((contact) => contact.email === email && contact.id !== id);
		if (checkEmail.length > 0) {
			this.setState({ invalidEmail: true });
			this.callAlert('warning', 'Warning', 'Email Already Exists');
		} else {
			let updatedContact = { id, firstname, lastname, email, phone, company, address, updatedDate };
			let getContactIndex = contacts.findIndex((contact) => contact.id === id);
			contacts[getContactIndex] = updatedContact;
			this.addContactToLocalStorage(contacts, 'edit');
			this.setState({ editForm: false });
		}
	};

	// Save Contact Details in Local Storage.
	addContactToLocalStorage = (contacts, type) => {
		localStorage.setItem('contacts', JSON.stringify(contacts));
		this.callAlert('success', 'Success', `Contact ${type === 'add' ? 'Added' : 'Updated'} Successfully`);
		document.getElementById('closemodal').click();
		this.resetForm();
		this.props.refreshContacts(true);
	};
	// Reset Contact Form
	resetForm = () => {
		this.setState({
			firstname: '',
			lastname: '',
			email: '',
			phone: '',
			company: '',
			address: '',
			id: '',
			updatedDate: '',
			submitted: false,
			editForm: false,
			invalidEmail: false,
		});
		this.props.updateContactStatus(false);
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
		const { submitted, firstname, lastname, email, phone, company, address, invalidEmail } = this.state;
		const { contact } = this.props;
		return (
			<div className='modal-dialog' role='document'>
				<div className='modal-content'>
					<div className='modal-header'>
						<h5 className='modal-title' id='exampleModalLabel'>
							{Object.keys(contact).length === 0 ? 'Add' : 'Edit'} Contact
						</h5>
						<button
							type='button'
							className='close'
							id='closemodal'
							onClick={this.resetForm}
							data-dismiss='modal'
							aria-label='Close'>
							<span aria-hidden='true'>&times;</span>
						</button>
					</div>
					<div className='modal-body'>
						<form
							ref={(ref) => (this.myForm = ref)}
							className={submitted ? 'needs-validation was-validated' : 'needs-validation'}
							onSubmit={this.addContactDetails}>
							<div className='form-row'>
								<FormRow
									type='text'
									label='First Name'
									size={6}
									index='1'
									pattern='^[a-zA-Z]*'
									max='20'
									value={firstname}
									setValue={(value) => this.setState({ firstname: value })}
								/>
								<FormRow
									type='text'
									label='Last Name'
									size={6}
									index='2'
									pattern='^[a-zA-Z]*'
									max='20'
									value={lastname}
									setValue={(value) => this.setState({ lastname: value })}
								/>
								<FormRow
									type='email'
									label='Email'
									size={6}
									index='3'
									pattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'
									max='50'
									invalidEmail={invalidEmail}
									value={email}
									setValue={(value) => this.setState({ email: value, invalidEmail: false })}
								/>
								<FormRow
									type='text'
									label='Phone Number'
									size={6}
									index='4'
									pattern='^[0-9]{10}$'
									max='10'
									value={phone.toString()}
									setValue={(value) => this.setState({ phone: value })}
								/>
								<FormRow
									type='text'
									label='Company Name'
									size={12}
									index='5'
									pattern='^[a-zA-Z]{1}[a-zA-Z., ]*'
									max='30'
									value={company}
									setValue={(value) => this.setState({ company: value })}
								/>
								<FormRow
									type='textarea'
									label='Address'
									size={12}
									index='6'
									pattern='^[a-zA-Z]{1}[a-zA-Z., ]*'
									max='50'
									value={address}
									setValue={(value) => this.setState({ address: value })}
								/>
							</div>
							<div className='text-center'>
								<button
									className='btn btn-primary'
									onClick={() => this.setState({ submitted: true })}
									type='submit'>
									Submit
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		);
	}
}
const FormRow = ({ size, label, index, type, value, pattern, max, setValue, invalidEmail }) => {
	return (
		<div className={'col-md-' + size + ' mb-3'}>
			<label htmlFor={'validationCustom0' + index}>{label}</label>
			{type !== 'textarea' && (
				<input
					type={type}
					className='form-control'
					id={'validationCustom0' + index}
					placeholder={'Enter ' + label}
					value={value}
					onChange={(e) => setValue(e.target.value)}
					pattern={pattern}
					maxLength={max}
					required
				/>
			)}
			{type === 'textarea' && (
				<textarea
					className='form-control'
					id={'validationCustom0' + index}
					placeholder={'Enter ' + label}
					value={value}
					onChange={(e) => setValue(e.target.value)}
					pattern={pattern}
					maxLength={max}
					required
				/>
			)}
			<div className='invalid-feedback'>Please Enter Valid {label}</div>
			{invalidEmail ? <div className='invalid-email text-danger small'>Email Already Exists</div> : null}
		</div>
	);
};

export default AddEditContact;
