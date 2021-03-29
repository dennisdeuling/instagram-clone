import React, {useState} from 'react';
import {FlatList, View} from 'react-native';
import firebase from 'firebase';
//import {connet} from 'react-redux'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fetchUsersData} from '../../redux/actions/index';

require('firebase/firestore');

function Comment(props) {
	const [comments, setComments] = useState([]);
	const [postId, setPostId] = useState('');
	const [text, setText] = useState('');

	useEffect(() => {

		const matchUserToComment = comments => {
			for (let i = 0; i < comments.length; i++) {
				if (comments[i].hasOwnProperty('user')) {
					continue;
				}

				const user = props.user.find(user => user.uid === comments[i].creator);

				if (user === undefined) {
					props.fetchUsersData(comments[i].creator, false);
				} else {
					comments[i].user = user;
				}
			}
			setComments(comments);
		};

		if (props.route.params.postId !== postId) {
			firebase.firestore
				.collection('posts')
				.doc(props.route.params.uid)
				.collection('userPosts')
				.doc(props.route.params.postId)
				.collection('comments')
				.get()
				.then(snapshot => {
					let comments = snapshot.docs.map(doc => {
						const data = doc.data();
						const id = doc.id;
						return {id, ...data};
					});
					matchUserToComment(comments);
				});
			setPostId(props.route.params.postId);
		} else {
			matchUserToComment(comments);
		}

	}, [props.route.params.postId, props.user]);

	const onCommentSend = () => {
		firebase.firestore
			.collection('posts')
			.doc(props.route.params.uid)
			.collection('userPosts')
			.doc(props.route.params.postId)
			.collection('comments')
			.add({
				creator: firebase.auth().currentUser.uid,
				text
			});

	};

	return (
		<View>
			<FlatList
				numColumns={1}
				horizontal={false}
				data={comments}
				renderItem={({item}) => (
					<View>
						{item.user !== undefined ? (
							<Text>{item.user.name}</Text>
						) : null}
						<Text>{item.text}</Text>
					</View>
				)}/>
			<View>
				<TextInput
					placeholder="Comment..."
					onChangeText={(text) => setText(text)}/>
				<Button
					title="Send"
					onPress={() => onCommentSend()}
				/>
			</View>
		</View>
	);
}

const mapStateToProps = store => ({
	users: store.usersState.users
});

const mapDispatchToProps = dispatch => {
	return (
		bindActionCreators({
			fetchUsersData
		}, dispatch));
};

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
