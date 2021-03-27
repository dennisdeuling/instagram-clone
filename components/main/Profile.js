import React from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';

import {connect} from 'react-redux';

//import {bindActionCreators} from 'redux';

function Profile(props) {
	const {currentUser, posts} = props;
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
					data={posts}
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
