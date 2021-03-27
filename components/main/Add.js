import React, {useEffect, useState} from 'react';
import {Button, Image, StyleSheet, Text, View} from 'react-native';
import {Camera} from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export default function Add({navigation}) {
	const [hasCameraPermission, setHasCameraPermission] = useState(null);
	const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
	const [type, setType] = useState(Camera.Constants.Type.back);
	const [camera, setCamera] = useState(null);
	const [image, setImage] = useState(null);

	useEffect(() => {
		(async () => {
			const cameraStatus = await Camera.requestPermissionsAsync();
			setHasCameraPermission(cameraStatus.status === 'granted');

			const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
			setHasGalleryPermission(galleryStatus.status === 'granted');
		})();
	}, []);

	const takePicture = async () => {
		if (camera) {
			const data = await camera.takePictureAsync(null);
			setImage(data.uri);
		}
	};

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1
		});

		console.log(result);

		if (!result.cancelled) {
			setImage(result.uri);
		}
	};

	if (hasCameraPermission === null || hasGalleryPermission === null) {
		return <View/>;
	}
	if (hasCameraPermission === false || hasGalleryPermission === false) {
		return <Text>No access to camera or gallery</Text>;
	}
	return (
		<View style={styles.container}>
			<View style={styles.cameraContainer}>
				<Camera style={styles.fixedRatio}
						type={type}
						ref={ref => setCamera(ref)}/>
			</View>

			<Button
				style={styles.button}
				title="Flip Image"
				onPress={() => {
					setType(
						type === Camera.Constants.Type.back
							? Camera.Constants.Type.front
							: Camera.Constants.Type.back
					);
				}}/>
			<Button
				style={styles.button}
				title="Take picture"
				onPress={() => takePicture()}/>
			<Button
				style={styles.button}
				title="Pick image from gallery"
				onPress={() => pickImage()}/>
			<Button
				style={styles.button}
				title="Save"
				onPress={() => navigation.navigate('Save', {image})}/>

			{image && <Image
				style={styles.cameraContainer}
				source={{uri: image}}/>}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	button: {
		flex: 1,
		justifyContent: 'center'
	},
	cameraContainer: {
		flex: 1,
		flexDirection: 'row',
		maxHeight: 455
	},
	fixedRatio: {
		flex: 1,
		aspectRatio: 1
	}
});
