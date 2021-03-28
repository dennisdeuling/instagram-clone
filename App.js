import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import * as firebase from 'firebase';

import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import rootReducer from './redux/reducer';
import thunk from 'redux-thunk';
import LandingScreen from './components/auth/Landingpage';
import RegisterScreen from './components/auth/Register';
import LoginScreen from './components/auth/Login';
import MainScreen from './components/Main';
import AddScreen from './components/main/Add';
import SaveScreen from './components/main/Save';

import {
	FIREBASE_API_KEY,
	FIREBASE_APP_ID,
	FIREBASE_AUTH_DOMAIN,
	FIREBASE_MASSAGING_SENDER_ID,
	FIREBASE_MESUREMENT_ID,
	FIREBASE_PROJECT_ID,
	FIREBASE_STORAGE_BUCKET
} from '@env';

const store = createStore(rootReducer, applyMiddleware(thunk));

const firebaseConfig = {
	apiKey: FIREBASE_API_KEY,
	authDomain: FIREBASE_AUTH_DOMAIN,
	projectId: FIREBASE_PROJECT_ID,
	storageBucket: FIREBASE_STORAGE_BUCKET,
	messagingSenderId: FIREBASE_MASSAGING_SENDER_ID,
	appId: FIREBASE_APP_ID,
	measurementId: FIREBASE_MESUREMENT_ID
};

if (firebase.apps.length === 0) {
	firebase.initializeApp(firebaseConfig);
}

const Stack = createStackNavigator();

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loaded: false,
			loggedIn: false
		};
	}

	componentDidMount() {
		firebase.auth().onAuthStateChanged(user => {
			if (!user) {
				this.setState({
					loaded: true,
					loggedIn: false
				});
			} else {
				this.setState({
					loaded: true,
					loggedIn: true
				});
			}
		});
	}

	render() {
		const {loggedIn, loaded} = this.state;

		if (!loaded) {
			return (
				<View style={{flex: 1, justifyContent: 'center'}}>
					<Text>Loading</Text>
				</View>
			);
		}

		if (!loggedIn) {
			return (
				<NavigationContainer>
					<Stack.Navigator
						initalRouteName="Landing">
						<Stack.Screen
							name="Landing"
							component={LandingScreen}
							options={{headerShown: false}}/>
						<Stack.Screen
							name="Register"
							component={RegisterScreen}/>
						<Stack.Screen
							name="Login"
							component={LoginScreen}/>
					</Stack.Navigator>
				</NavigationContainer>
			);
		}
		return (
			<Provider store={store}>
				<NavigationContainer>
					<Stack.Navigator
						initalRouteName="Main">
						<Stack.Screen
							name="Main"
							component={MainScreen}/>
						<Stack.Screen
							name="Add"
							component={AddScreen}
							navigation={this.props.navigation}/>
						<Stack.Screen
							name="Save"
							component={SaveScreen}
							navigation={this.props.navigation}/>
					</Stack.Navigator>
				</NavigationContainer>
			</Provider>
		);
	}
}

export default App;
