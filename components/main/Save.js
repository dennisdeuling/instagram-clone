import React, {useState} from 'react';
import {Button, Image, TextInput, View} from 'react-native';

import firebase from 'firebase';

require('firebase/firestore');
require('firebase/firebase-storage');

function Save(props) {
	const [caption, setCaption] = useState('');

	const uploadImage = async () => {
		const uri = props.route.params.image;
		const response = await fetch(uri);
		const blob = await response.blob();

		const task = firebase
			.storage()
			.ref()
			.child(`post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`)
			.put(blob);

		const taskProgress = snapshot => {
			console.log(`Transferred: ${snapshot.bytesTransferred}`);
		};

		const taskCompleted = () => {
			task.snapshot.ref.getDownloadURL()
				.then(snapshot => {
					savePostData(snapshot);
				});
		};

		const taskError = snapshot => {
			console.log(snapshot);
		};

		task.on('state_changed', taskProgress, taskError, taskCompleted);
	};

	const savePostData = downloadURL => {
		firebase
			.firestore()
			.collection('posts')
			.doc(firebase.auth().currentUser.uid)
			.collection('userPosts')
			.add({
				downloadURL,
				caption,
				creation: firebase.firestore.FieldValue.serverTimestamp()
			})
			.then(() => {
				props.navigation.popToTop();
			});
	};

	return (
		<View style={{flex: 1}}>
			<Image source={{uri: props.route.params.image}}/>
			<TextInput
				placeholder="Write a caption..."
				onChangeText={caption => setCaption(caption)}/>
			<Button
				title="Save"
				onPress={() => uploadImage()}/>
		</View>
	);
}

export default Save;
