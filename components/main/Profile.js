import React, {useEffect, useState} from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';

import {connect} from 'react-redux';

import firebase from 'firebase';

require('firebase/firestore');

function Profile(props) {
	const [userPosts, setUserPosts] = useState([]);
	const [user, setUser] = useState(null);
	const [following, setFollowing] = useState(false);

	useEffect(() => {
		const {currentUser, posts} = props;

		if (props.route.params.uid === firebase.auth().currentUser.uid) {
			setUser(currentUser);
			setUserPosts(posts);
		} else {
			//TODO: This code has to be refactored
			firebase.firestore()
				.collection('users')
				.doc(props.route.params.uid)
				.get()
				.then(snapshot => {
					if (snapshot.exists) {
						setUser(snapshot.data);
					} else {
						console.log('Snapshot doesnt exists');
					}
				});
			firebase.firestore()
				.collection('posts')
				.doc(props.route.params.uid)
				.collection('userPosts')
				.orderBy('creation', 'asc')
				.get()
				.then(snapshot => {
					let posts = snapshot.docs.map(doc => {
						const data = doc.data();
						const id = doc.id;
						return {id, ...data};
					});
					setUserPosts(posts);
				});
		}
	}, [props.route.params.uid]);

	if (user === null) {
		return <View/>;
	}
	return (
		<View style={styles.container}>
			<View style={styles.containerInfo}>
				{/*TODO: Add username and email*/}
				<Text>User name</Text>
				<Text>User email</Text>
			</View>
			<View style={styles.containerGallery}>
				<FlatList
					numColumns={3}
					horizontal={false}
					data={userPosts}
					renderItem={({item}) => (
						<View style={styles.containerImage}>
							<Image style={styles.image}
								   source={{uri: item.downloadURL}}/>
						</View>
					)}/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 40
	},
	containerInfo: {
		margin: 20
	},
	containerGallery: {
		flex: 1
	},
	containerImage: {
		flex: 1 / 3
	},
	image: {
		flex: 1,
		aspectRatio: 1 / 1
	}
});

const mapStateToProps = store => ({
	currentUser: store.userState.currentUser,
	posts: store.userState.posts
});

export default connect(mapStateToProps, null)(Profile);
