import React, {useState} from 'react';
import {FlatList, Text, TextInput, TouchableOpacity, View} from 'react-native';

import firebase from 'firebase';

require('firebase/firestore');

function Search(props) {
	const [users, setUsers] = useState([]);

	const fetchUsers = search => {
		firebase.firestore()
			.collection('users')
			.where('name', '>=', search)
			.get()
			.then(snapshot => {
				let users = snapshot.docs.map(doc => {
					const data = doc.data();
					const id = doc.id;
					return {id, ...data};
				});
				setUsers(users);
			});
	};
	return (
		<View>
			<TextInput placeholder="Search users"
					   onChangeText={search => fetchUsers(search)}/>
			<FlatList
				numColumns={1}
				horizontal={false}
				data={users}
				renderItem={({item}) => (
					<TouchableOpacity
						onPress={() => props.navigation.navigate('Profile', {uid: item.id})}>
						<Text>{item.name}</Text>
					</TouchableOpacity>
				)}/>
		</View>
	);
}

export default Search;
