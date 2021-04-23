import React, { Component } from 'react';
import moment from 'moment';
import 'emoji-picker-element';
import '../styles/Chat.css';
const Swal = window.Swal;
export class Chat extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentUser: 0,
			receiver: this.props.receiver.id,
			messages: [],
			message: '',
			receiverDetails: this.props.receiver,
			loadingChat: false,
			enableEmoji: false,
		};
	}
	componentDidMount() {
		// fetch chat messages
		this.loadChat();
		// enable emoji picker
		document.querySelector('emoji-picker').addEventListener('emoji-click', (event) => {
			this.setState({ message: this.state.message + '' + event.detail.unicode });
		});
	}
	componentDidUpdate() {
		if (this.props.selectedUser) {
			this.setState({
				receiverDetails: this.props.receiver,
			});
			let currentUser = localStorage.getItem('currentUser');
			if (currentUser !== null) {
				currentUser = JSON.parse(currentUser);
				this.setState({
					receiver: this.props.receiver.id,
					currentUser: currentUser.id,
					loadingChat: true,
				});
				setTimeout(() => {
					this.loadChat();
				}, 500);
			}
			this.props.selectUserBack(false);
		}
	}

	// Load Chat Conversation
	loadChat = () => {
		let messages = localStorage.getItem('messages');
		if (messages !== null) {
			const { currentUser, receiver } = this.state;
			messages = JSON.parse(messages);
			let getConversation = messages.filter(
				(message) =>
					(message.senderid === currentUser && message.receiverid === receiver) ||
					(message.senderid === receiver && message.receiverid === currentUser),
			);
			this.setState({ messages: getConversation, loadingChat: false });
			this.scrollToDown();
		} else {
			this.setState({ loadingChat: false });
		}
	};

	// Scroll to bottom of the Chat Conversation
	scrollToDown = () => {
		setTimeout(() => {
			let element = document.getElementById('msgs');
			if (element) {
				this.down.scrollTo(0, element.scrollHeight);
			}
		}, 100);
	};

	// Send Message
	sendMessage = (e) => {
		e.preventDefault();
		const { message, currentUser, receiver } = this.state;
		if (message.trim().length === 0) {
			this.callAlert('error', 'Error', 'Message is invalid');
			this.setState({ message: '', enableEmoji: false });
		} else {
			let messages = localStorage.getItem('messages') ? JSON.parse(localStorage.getItem('messages')) : [];
			let id = 0;
			if (messages.length !== 0) {
				id = messages[messages.length - 1]['id'] + 1;
			}
			let currentTime = moment(new Date()).format('DD-MM-YYYY HH:MM A');
			let currentMessage = {
				id,
				senderid: currentUser,
				receiverid: receiver,
				text: message,
				time: currentTime,
			};
			let allMessages = [ ...messages, currentMessage ];
			// set in localstorage
			localStorage.setItem('messages', JSON.stringify(allMessages));
			this.setState({ message: '', enableEmoji: false });
			this.loadChat();
		}
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
		const { receiverDetails, messages, message, currentUser, loadingChat, enableEmoji } = this.state;
		return (
			<div className='chat-window'>
				<h3 className='chat-users text-center text-white p5'>
					<i className='fa fa-comments' /> {receiverDetails.firstname + ' ' + receiverDetails.lastname}
				</h3>
				<div className='messages' id='msgs' ref={(ref) => (this.down = ref)}>
					{loadingChat && (
						<p className='text-center'>
							Chat history is loading <i className='fa fa-refresh' />
						</p>
					)}
					{!loadingChat &&
					messages.length === 0 && (
						<div className='text-center'>
							<p>Start your conversation by sending a message...</p>
						</div>
					)}
					{!loadingChat &&
						messages.length > 0 &&
						messages.map((message) => (
							<div
								className={
									currentUser === message.senderid ? (
										'message mymessage float-right'
									) : (
										'message float-left'
									)
								}
								key={message.id}>
								<div className='message-text p5 m5'>
									<p>{message.text}</p>
									<span className='time small float-right p5'>{message.time}</span>
								</div>
							</div>
						))}
				</div>
				<div className='messageForm border-top'>
					<form className='d-flex flex-row align-items-center' onSubmit={this.sendMessage}>
						<div className='messageBox border bg-white p10 m5'>
							<input
								type='text'
								className='messageBox2 border-0'
								value={message}
								onChange={(e) => this.setState({ message: e.target.value })}
								onFocus={() => this.setState({ enableEmoji: false })}
								placeholder='Type your message here...'
								required
							/>
						</div>
						<div className={enableEmoji ? 'emojiPicker' : 'd-none'}>
							<emoji-picker />
						</div>
						<button
							className='emojiIcon bg-white border-0'
							type='button'
							onClick={() => this.setState({ enableEmoji: !this.state.enableEmoji })}>
							<i className='fa fa-smile-o' />
						</button>
						<button className='sendicon border rounded-circle text-white p10' title='Send'>
							<i className='fa fa-send' />{' '}
						</button>
					</form>
				</div>
			</div>
		);
	}
}

export default Chat;
