import * as firebase from 'firebase';
import cloudinaryConfig from '../config/cloudinary';
import sha1 from 'sha1';
import superagent from 'superagent';
// import aws from '../config/aws.js';
// import { RNS3 } from 'react-native-aws3';
import { Alert } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import Geohash from 'latlon-geohash';
import { Notifications } from 'expo';

export function login(user){
	return function(dispatch){
		let params = {
			id: user.uid, 
			photoUrl: ' ',
			birthDay: ' ',
			name: ' ',
			aboutMe: ' ',
			chats: ' ',
			geocode: ' ',
			images: [],
			notification: false,
			show: false,
			report: false,
			swipes: {
				[user.uid]: false
			},
			token: ' ',
			phoneNumber: user.phoneNumber,
			newUser: true,
		}

		  firebase.database().ref('cards/').child(user.uid).once('value', function(snapshot){
			if(snapshot.val() !== null){
				dispatch({ type: 'LOGIN', user: snapshot.val(), loggedIn: true });
				dispatch(allowNotifications())
			} 
			else {
			  firebase.database().ref('cards/' + user.uid ).update(params);
			  dispatch({ type: 'LOGIN', user: params, loggedIn: true });
			}
			dispatch(getLocation())
		  })
	}
}

export function logout() {
	return function(dispatch) {
		firebase.auth().signOut();
		dispatch({type: 'LOGOUT', loggedIn: false});
	}
}

export function addFirstImage() {
	return function(dispatch) {
		Permissions.askAsync(Permissions.CAMERA_ROLL);
		// Permissions.askAsync(Permissions.CAMERA);

		ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [4, 3], base64: true }).then(function(result) {
    		let base64Img = `data:image/jpg;base64,${result.base64}`;

			let data = {
				"file": base64Img,
				"upload_preset": cloudinaryConfig.PRESET_NAME,
			}

			fetch(cloudinaryConfig.URL, {
				body: JSON.stringify(data),
				headers: {
				  'content-type': 'application/json'
				},
				method: 'POST',
			  }).then(async r => {
				let data = await r.json()

				let img = data.url
				firebase.database().ref('cards/' + firebase.auth().currentUser.uid + '/images').set([img]);
				firebase.database().ref('cards/' + firebase.auth().currentUser.uid).update({ photoUrl: img })
				
				dispatch({ type: 'UPDATE_PROFILE_PICTURE', payload: img })
			  }).catch(err => console.log(err))

		})
	}
}

export function uploadImages(images) {
	return function(dispatch) {
		Permissions.askAsync(Permissions.CAMERA_ROLL);

		ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [4, 3], base64: true }).then(function(result) {
			let base64Img = `data:image/jpg;base64,${result.base64}`;

			let data = {
				"file": base64Img,
				"upload_preset": cloudinaryConfig.PRESET_NAME,
			}

			fetch(cloudinaryConfig.URL, {
				body: JSON.stringify(data),
				headers: {
					'content-type': 'application/json'
				},
				method: 'POST',
			}).then(async r => {
				let data = await r.json()

				let img = data.url
				let array = images
				array.push(img)

				firebase.database().ref('cards/' + firebase.auth().currentUser.uid + '/images').set(array)
				dispatch({ type: 'UPLOAD_IMAGES', payload: array })
			}).catch(err => console.log(err))
			// var array = images

			// let storageRef = firebase.storage().ref();
			// const fileRef = storageRef.child('images/test-img.jpg')			

			// fetch(result.uri).then((res) => {
			// 	res.blob().then((blob) => {
			// 		fileRef.put(blob).then((snapshot) => {
			// 			array.push(snapshot.task.uploadUrl_);
						// firebase.database().ref('cards/' + firebase.auth().currentUser.uid + '/images').set(array);
			// 			dispatch ({type: 'UPDATE_PROFILE_PICTURE', payload: array})
			// 		})
			// 	})
			// });
		})
	}
}

export function deleteImage(images, key) {
	return function(dispatch) {
		Alert.alert('Are you sure you want to Delete this Image?',
			  '',
			[
				{
					text: 'Ok', onPress: () => {
					var array = images;
					array.splice(key, 1)
					dispatch({type: 'UPLOAD_IMAGES', payload: array});
					firebase.database().ref('cards/' + firebase.auth().currentUser.uid + '/images').set(array);
					}
				},
				{
					text: 'Cancle', onPress: () => console.log('Cancle Pressed')
				}
			],
				{ cancelable: true }
			);

	}
}

export function updateAboutMe(value) {
	return function(dispatch) {
		dispatch({
			type: 'UPDATE_ABOUT',
			payload: value
		});
		setTimeout(function() {
			firebase.database().ref('cards/' + firebase.auth().currentUser.uid).update({aboutMe: value});
		}, 3000);
	}
}

export function newUser(user) {
	return function(dispatch) {
		if (user.name.length > 0 && user.photoUrl.length > 0 && user.aboutMe.length > 0) {
			let currentUser = firebase.auth().currentUser
			currentUser.newUser = false

			firebase.database().ref('cards/' + currentUser.uid).update({ newUser: currentUser.newUser})
			dispatch({ type: "LOGIN", user: currentUser, loggedIn: true })
		}
	}
}

export function updateName(value) {
	return function(dispatch) {
		dispatch({
			type: 'UPDATE_NAME',
			payload: value
		});
		setTimeout(function() {
			firebase.database().ref('cards/' + firebase.auth().currentUser.uid).update({name: value});
		}, 3000)
	}
}

export function getCards(geoCode, swipes) {
	return function(dispatch) {
		firebase.database().ref('cards').orderByChild("geocode").equalTo(geoCode).once('value', (snap) => {
			var items = [];

			snap.forEach((child) => {
				if (!(child.key in swipes)) {
					item = child.val();
					item.id = child.key;
					items.push(item);
				}
			});
			dispatch({type: 'GET_CARDS', payload: items})
		})
		
	}
}

export function getLocation() {
	return function(dispatch) {
		Permissions.askAsync(Permissions.LOCATION).then(function(res) {
			if (res) {
				Location.getCurrentPositionAsync({}).then(function(location) {
					var geocode = Geohash.encode(location.coords.latitude, location.coords.latitude, 4);
					firebase.database().ref('cards/' + firebase.auth().currentUser.uid).update({geocode: geocode});
					dispatch({type: 'GET_LOCATION', payload: geocode});
				})
			}
		})
	}
}

export function allowNotifications(){
	return function(dispatch){
		Permissions.getAsync(Permissions.NOTIFICATIONS).then(function(result){
		  if (result.status === 'granted') {
		    Notifications.getExpoPushTokenAsync().then(function(token){
		      firebase.database().ref('cards/' + firebase.auth().currentUser.uid ).update({ token: token });
		      dispatch({ type: 'ALLOW_NOTIFICATIONS', payload: token });
		    })
		  }
		})
	}
}

export function sendNotification(id, name, text){
	return function(dispatch){
		firebase.database().ref('cards/' + id).once('value', (snap) => {
			if(snap.val().token != null){

				return fetch('https://exp.host/--/api/v2/push/send', {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						to: snap.val().token,
						title: name,
						body: text,
					}),
				});

			}
		});
	}
}