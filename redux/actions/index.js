import {
	CLEAR_DATA,
	USER_FOLLOWING_STATE_CHANGE,
	USER_POSTS_STATE_CHANGE,
	USER_STATE_CHANGE,
	USERS_DATA_STATE_CHANGE
} from '../constants/index';
import firebase from 'firebase';

require('firebase/firestore');

function clearData() {
	return (dispatch => {
		dispatch({type: CLEAR_DATA});
	});
}

function fetchUser() {
	return (dispatch => {
		firebase.firestore()
			.collection('users')
			.doc(firebase.auth().currentUser.uid)
			.get()
			.then(snapshot => {
				if (snapshot.exists) {
					dispatch({
						type: USER_STATE_CHANGE,
						currentUser: snapshot.data()
					});
				} else {
					console.log('Snapshot doesnt exists');
				}
			});
	});
};

function fetchUserPosts() {
	return (dispatch => {
		firebase.firestore()
			.collection('posts')
			.doc(firebase.auth().currentUser.uid)
			.collection('userPosts')
			.orderBy('creation', 'asc')
			.get()
			.then(snapshot => {
				let posts = snapshot.docs.map(doc => {
					const data = doc.data();
					const id = doc.id;
					return {id, ...data};
				});
				dispatch({
					type: USER_POSTS_STATE_CHANGE,
					posts
				});
			});
	});
};

function fetchUserFollowing() {
	return (dispatch => {
		firebase.firestore()
			.collection('following')
			.doc(firebase.auth().currentUser.uid)
			.collection('userFollowing')
			.onSnapshot(snapshot => {
				let following = snapshot.docs.map(doc => {
					const id = doc.id;
					return id;
				});
				dispatch({
					type: USER_FOLLOWING_STATE_CHANGE,
					following
				});

				for (let i = 0; i < following.length; i++) {
					dispatch(fetchUsersData(following[i], true));
				}
			});
	});
};

function fetchUsersData(uid, getPosts) {
	return ((dispatch, getState) => {
		const found = getState().usersState.users
			.some(user => user.uid === uid);

		if (!found) {
			firebase.firestore()
				.collection('users')
				.doc(uid)
				.get()
				.then(snapshot => {
					if (snapshot.exists) {
						let user = snapshot.data();
						user.uid = snapshot.id;

						dispatch({
							type: USERS_DATA_STATE_CHANGE,
							user
						});
					} else {
						console.log('Snapshot doesnt exists');
					}
				});

			if (getPosts) {
				dispatch(fetchUsersFollowingPosts(uid));
			}

		}
	});
}

function fetchUsersFollowingPosts(uid) {
	return ((dispatch, getState) => {
		firebase.firestore()
			.collection('posts')
			.doc(uid)
			.collection('userPosts')
			.orderBy('creation', 'asc')
			.get()
			.then(snapshot => {
				const uid = snapshot.query.EP.path.segments[1];
				console.log({snapshot, uid});
				const user = getState().userState.users.find(user => user.uid === uid);

				let posts = snapshot.docs.map(doc => {
					const data = doc.data();
					const id = doc.id;
					return {id, ...data, user};
				});
				dispatch({
					type: USERS_POSTS_STATE_CHANGE,
					posts,
					uid
				});
			});
	});
};


export {
	fetchUser,
	fetchUserPosts,
	fetchUserFollowing,
	fetchUsersData,
	fetchUsersFollowingPosts,
	clearData
};
