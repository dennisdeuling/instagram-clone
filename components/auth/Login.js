import React, {Component} from 'react';
import {Button, TextInput, View} from 'react-native';
import firebase from 'firebase';

class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: '',
			password: ''
		};
	}

	onLogin = userData => {
		const {email, password} = userData;
		firebase.auth().signInWithEmailAndPassword(email, password)
			.then(result => {
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
					placeholder="Email"
					onChangeText={(email) => this.setState({email})}/>
				<TextInput
					placeholder="Password"
					secureTextEntry={true}
					onChangeText={(password) => this.setState({password})}/>
				<Button
					title="Login"
					onPress={() => this.onLogin(this.state)}/>
			</View>
		);
	}
}

export default Login;
