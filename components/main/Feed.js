import React, {useEffect, useState} from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';

//import {connect} from 'react-redux';

//import firebase from 'firebase';

require('firebase/firestore');

function Feed(props) {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		let posts = [];
		if (props.usersLoaded === props.following.length) {
			for (let i = 0; i < props.following.length; i++) {
				const user = props.users.find(user => user.uid === props.following[i]);
				if (user !== undefinded) {
					posts = [...posts, ...user.posts];
				}
			}
			posts.sort((a, b) => {
				return a.creation - b.creation;
			});
			setPosts(posts);
		}

	}, [props.usersLoaded]);

	return (
		<View style={styles.containerGallery}>
			<FlatList
				numColumns={1}
				horizontal={false}
				data={posts}
				renderItem={({item}) => (
					<View style={styles.containerImage}>
						<Text style={styles.container}>{item.user.name}</Text>
						<Image style={styles.image}
							   source={{uri: item.downloadURL}}/>
					</View>
				)}/>
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
	users: store.userState.users,
	usersLoaded: store.userState.usersLoaded
});

export default connect(mapStateToProps, null)(Feed);
