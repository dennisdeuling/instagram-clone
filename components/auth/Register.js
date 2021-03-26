import React, {Component} from 'react';
import {Button, TextInput, View} from 'react-native';
import firebase from 'firebase';

class Register extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: '',
			email: '',
			password: ''
		};
	}

	onRegister = userData => {
		const {name, email, password} = userData;
		firebase.auth().createUserWithEmailAndPassword(email, password)
			.then(result => {
				//TODO change it
				firebase.firestore().collection('users')
					.doc(firebase.auth().currentUser.uid)
					.set({
						name,
						email
					});
				console.log(result);
			})
			.catch(error => {
				console.log(error);
			});


	};

	render() {
		return (
			<View>
				<TextInput
					placeholder="Name"
					onChangeText={(name) => this.setState({name})}/>
				<TextInput
					placeholder="Email"
					onChangeText={(email) => this.setState({email})}/>
				<TextInput
					placeholder="Password"
					secureTextEntry={true}
					onChangeText={(password) => this.setState({password})}/>
				<Button
					title="Register"
					onPress={() => this.onRegister(this.state)}/>
			</View>
		);
	}
}

export default Register;
