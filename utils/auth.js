import * as firebase from 'firebase'
import firebaseConfig from '../config/firebase.js'

export async function signInWithFacebook() {
  const appId = firebaseConfig.appId;
  const permissions = ['public_profile', 'email'];  // Permissions required, consult Facebook docs
  
  const {
    type,
    token,
  } = await Expo.Facebook.logInWithReadPermissionsAsync(
    appId,
    {permissions}
  );

  switch (type) {
    case 'success': {
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);  // Set persistent auth state
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        const facebookProfileData = await firebase.auth().signInAndRetrieveDataWithCredential(credential);  // Sign in with Facebook credential

      // Do something with Facebook profile data
      // OR you have subscribed to auth state change, authStateChange handler will process the profile data
        firebase.auth().signInWithCredential(creds).catch((err) => {
            Alert.alert("UH oH Sphaget " + err)
        })
      
        return Promise.resolve({type: 'success'});
    }
    case 'cancel': {
        return Promise.reject({type: 'cancel'});
    }
  }
}